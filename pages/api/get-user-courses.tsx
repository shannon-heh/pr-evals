import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/database";

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
          instructor_courses: 1,
          student_courses: 1,
          person_type: 1,
        },
      }
    )
    .then((user) => {
      // if given netid is not valid
      if (user == null) {
        return res.status(404).json(`user ${netid} not found in DB`);
      }
      if (user["person_type"] === "instructor") {
        return res.status(200).json({ course_ids: user["instructor_courses"] });
      } else {
        return res.status(200).json({ course_ids: user["student_courses"] });
      }
    });
}
