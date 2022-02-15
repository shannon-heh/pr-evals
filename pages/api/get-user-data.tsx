import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";

// API endpoint to return list of stored courses
// being taught by an instructor / taken by a student
// (given their netid)
// Usage: /api/get-courses?netid=NETID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid = req.query.netid;
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
    .then((user: Object) => {
      // if given netid is not valid
      if (user == null) {
        return res.status(404).json(`user ${netid} not found in DB`);
      }
      // return res.status(200).json({ data: user });
      if (user["person_type"] === "instructor") {
        delete user["class_year"];
        delete user["student_courses"];
        delete user["major_code"];
      } else {
        delete user["instructorid"];
        delete user["instructor_courses"];
      }
      return res.status(200).json({ data: user });
    });
}
