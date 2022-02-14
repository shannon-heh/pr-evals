import type { NextApiRequest, NextApiResponse } from "next";
import urllib from "urllib";
import sessionstorage from "sessionstorage";
import { getDB } from "../../src/database";
import { ReqLib } from "../../src/reqLib";

const BASE_URL = "https://api.princeton.edu:443/active-directory/1.0.4";
const USERS = "/users";

type Data = {
  netid?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // attempt to retrieve netID from session (i.e. user logged in already)
  let netid: string = sessionstorage.getItem("netid");
  if (netid) {
    return res.status(200).json({ netid: netid.toLowerCase() });
  }

  // connect to DB
  const usersCollection = (await getDB()).collection("users");

  // if netID not in session, perform CAS login
  await urllib
    .request(
      `${process.env.NEXT_PUBLIC_CAS_SERVER_URL}/validate?service=${process.env.NEXT_PUBLIC_HOSTNAME}&ticket=${req.query.ticket}`
    )
    .then((res_) => {
      // validate CAS response
      let casData: string = res_.data.toString();
      if (!casData) {
        res.status(401).json({});
        return "";
      }
      let casDataParts: string[] = casData.split("\n");
      if (casDataParts.length < 3 || casDataParts[0] != "yes") {
        res.status(401).json({});
        return "";
      }
      // CAS response validated, save netID to session
      let netid: string = casDataParts[1].toLowerCase();
      sessionstorage.setItem("netid", netid);
      res.status(200).json({ netid: netid });
      return netid;
    })
    .then((netid: string) => {
      if (!netid) return;

      new ReqLib()
        .getJSON(BASE_URL, USERS, {
          uid: netid,
        })
        .then(async (data: Array<Object>) => {
          const userData = data[0];

          const pustatusMapping = {
            fac: "instructor",
            undergraduate: "undergrad",
            graduate: "grad",
          };
          const pustatus = userData["pustatus"];

          const isInstructor = pustatus == "fac";
          let classYear =
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
                  student_courses: [],
                  major_code: null,
                  instructor_courses: instrCourses,
                },
              },
              { upsert: true }
            )
            .then(() => {
              usersCollection.updateOne(
                { netid: netid },
                {
                  $set: {
                    class_year: classYear,
                    person_type:
                      pustatus in pustatusMapping
                        ? pustatusMapping[pustatus]
                        : "other",
                    instructorid: isInstructor
                      ? userData["universityid"]
                      : null,
                  },
                }
              );
            });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({});
    });
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
