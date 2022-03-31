import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { getNetID, validateInstructor } from "../../src/Helpers";

// API endpoint to get list of students in a course
// Usage: /api/get-student-emails?courseid=COURSEID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!getNetID()) return res.status(401).end();

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
