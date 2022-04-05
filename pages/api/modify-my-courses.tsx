import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { AUTH_COOKIE, isStudent } from "../../src/Helpers";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to add or remove course for a student
// (given their netid)
// Usage: /api/get-user-data?netid=NETID&courseid=COURSEID&action=ACTION
// ACTION is "add" or "remove"
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const courseid = req.query.courseid as string;
  const action = req.query.action as string;
  if (!courseid || !action)
    return res.status(404).json("missing query parameters");
  if (action != "add" && action != "remove")
    return res.status(404).end("invalid action");

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
      })
      .catch((err) => {
        console.log(
          `error in adding course ${courseid} for student ${netid}`,
          err
        );
        return res.status(500).end();
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
      })
      .catch((err) => {
        console.log(
          `error in removing course ${courseid} for student ${netid}`,
          err
        );
        return res.status(500).end();
      });
  }
}
