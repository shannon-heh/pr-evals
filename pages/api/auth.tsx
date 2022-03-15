import type { NextApiRequest, NextApiResponse } from "next";
import urllib from "urllib";
import sessionstorage from "sessionstorage";
import { getDB } from "../../src/mongodb";
import { ReqLib } from "../../src/reqLib";

const BASE_URL = "https://api.princeton.edu:443/active-directory/1.0.4";
const USERS = "/users";

type Data = {
  netid?: string;
  isInstructor?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // attempt to retrieve netID from session (i.e. user logged in already)
  let netid: string = sessionstorage.getItem("netid");
  if (netid)
    return res.status(200).json({
      netid: netid.toLowerCase(),
      isInstructor: sessionstorage.getItem("isInstructor"),
    });

  // connect to DB
  const usersCollection = (await getDB()).collection("users");

  // if netID not in session, perform CAS login
  const res_ = await urllib.request(
    `${process.env.NEXT_PUBLIC_CAS_SERVER_URL}/validate?service=${process.env.NEXT_PUBLIC_HOSTNAME}&ticket=${req.query.ticket}`
  );

  // validate CAS response
  let casData: string = res_.data.toString();
  if (!casData) return res.status(401).json({});

  let casDataParts: string[] = casData.split("\n");
  if (casDataParts.length < 3 || casDataParts[0] != "yes")
    return res.status(401).json({});

  // @shannon-heh hardcode a netID here to "login" as someone else
  netid = casDataParts[1].toLowerCase();

  // retrieve and update user data from Users API
  let data: Object[] = await new ReqLib().getJSON(BASE_URL, USERS, {
    uid: netid,
  });
  const userData = data[0];

  const pustatusMapping = {
    fac: "instructor",
    undergraduate: "undergrad",
    graduate: "grad",
  };
  const pustatus = userData["pustatus"];

  const isInstructor = pustatus == "fac";
  const classYear =
    pustatus == "undergraduate"
      ? userData["department"].split(" ").at(-1)
      : null;

  // if necessary, create or update user document in database
  // first, populate fields that won't automatically change (i.e. from semester to semester)
  // then, populate fields that might or will change
  const instrCourses = isInstructor
    ? await getInstrCourses(userData["universityid"])
    : [];
  usersCollection
    .updateOne(
      { netid: netid },
      {
        $set: {
          netid: netid,
          instructor_courses: instrCourses,
        },
      },
      { upsert: true }
    )
    .then(() => {
      // do not update major if field already exists
      usersCollection.updateOne(
        { major_code: { $exists: false } },
        {
          $set: {
            major_code: null,
          },
        }
      );
      // do not update student courses if field already exists
      usersCollection.updateOne(
        { student_courses: { $exists: false } },
        {
          $set: {
            student_courses: [],
          },
        }
      );
    })
    .then(() => {
      usersCollection.updateOne(
        { netid: netid },
        {
          $set: {
            class_year: classYear,
            person_type:
              pustatus in pustatusMapping ? pustatusMapping[pustatus] : "other",
            instructorid: isInstructor ? userData["universityid"] : null,
            name: userData["displayname"],
          },
        }
      );
    });

  sessionstorage.setItem("netid", netid);
  sessionstorage.setItem("isInstructor", isInstructor);

  res.status(200).json({ netid: netid, isInstructor: isInstructor });
}

// Returns list of course IDs taught by an instructor
async function getInstrCourses(emplid: string) {
  const dbCourses = (await getDB()).collection("courses");
  return dbCourses
    .find(
      { instructors: { $elemMatch: { instructorid: emplid } } },
      { projection: { _id: 0, course_id: 1 } }
    )
    .toArray()
    .then((allCourses: Object[]) => {
      const courseIds = allCourses.map((course) => {
        return course["course_id"];
      });
      return courseIds;
    });
}
