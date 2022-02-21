import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { UserDataDB } from "../../src/Types";

// API endpoint to add or remove course for a student
// (given their netid)
// Usage: /api/get-user-data?netid=NETID&courseid=COURSEID&action=ACTION
// ACTION is "add" or "remove"
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid = req.query.netid as string;
  const courseid = req.query.courseid as string;
  const action = req.query.action as string;

  const dbUsers = (await getDB()).collection("users");
  if (action == "add") {
    return dbUsers
      .updateOne(
        { netid: netid },
        {
          $addToSet: { student_courses: courseid },
        }
      )
      .then(() => {
        return res
          .status(200)
          .json({ message: `added course ${courseid} for student ${netid}` });
      });
  } else if (action == "remove") {
    return dbUsers
      .updateOne(
        { netid: netid },
        {
          $pull: { student_courses: courseid },
        }
      )
      .then(() => {
        return res
          .status(200)
          .json({ message: `removed course ${courseid} for student ${netid}` });
      });
  }
}
