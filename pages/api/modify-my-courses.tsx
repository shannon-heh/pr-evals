import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import sessionstorage from "sessionstorage";
import { isStudent } from "../../src/Helpers";

// API endpoint to add or remove course for a student
// (given their netid)
// Usage: /api/get-user-data?netid=NETID&courseid=COURSEID&action=ACTION
// ACTION is "add" or "remove"
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = sessionstorage.getItem("netid");
  const courseid = req.query.courseid as string;
  const action = req.query.action as string;
  const db = await getDB();

  // make sure only students can modify courses
  const student: boolean = await isStudent(db, netid);
  if (!student) {
    return res.status(401).json(`${netid} is not a student`);
  }

  const dbUsers = db.collection("users");
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
          .json(`added course ${courseid} for student ${netid}`);
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
          .json(`removed course ${courseid} for student ${netid}`);
      });
  }
}
