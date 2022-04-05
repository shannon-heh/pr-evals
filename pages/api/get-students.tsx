import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { AUTH_COOKIE, validateInstructor } from "../../src/Helpers";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to get list of students in a course
// Usage: /api/get-student-emails?courseid=COURSEID
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const db = await getDB();
  const courseid = req.query.courseid as string;
  if (!courseid) return res.status(404).json("missing query parameters");

  const isValid: boolean = await validateInstructor(db, netid, courseid);
  if (!isValid) {
    return res
      .status(401)
      .json(`${netid} is not an instructor for course ${courseid}`);
  }

  return await db
    .collection("users")
    .find({ student_courses: courseid }, { projection: { _id: 0, netid: 1 } })
    .toArray()
    .then((students: { netid: string }[]) => {
      const studentsList = students.map((student) => {
        return student.netid;
      });
      return res.status(200).json(studentsList);
    })
    .catch((err) => {
      console.log(
        `error in getting list of students in course ${courseid}`,
        err
      );
      return res.status(500).end();
    });
}
