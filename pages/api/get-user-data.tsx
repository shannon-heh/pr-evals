import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { UserDataDB } from "../../src/Types";
import sessionstorage from "sessionstorage";

// API endpoint to return data about an instructor or student
// (given their netid)
// Usage: /api/get-user-data?netid=NETID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = sessionstorage.getItem("netid");
  const dbUsers = (await getDB()).collection("users");
  return dbUsers
    .findOne(
      { netid: netid },
      {
        projection: {
          _id: 0,
        },
      }
    )
    .then((user: UserDataDB) => {
      // if given netid is not valid
      if (user == null) {
        return res.status(404).json(`user ${netid} not found in DB`);
      }
      if (user["person_type"] === "instructor") {
        delete user["class_year"];
        delete user["student_courses"];
        delete user["major_code"];
      } else {
        delete user["instructorid"];
        delete user["instructor_courses"];
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.log(`error in getting data about user ${netid}`, err);
      return res.status(500).end();
    });
}
