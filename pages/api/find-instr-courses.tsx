import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/database";

// API endpoint to return list of course IDs
// taught by an instructor (given their emplid)
// Usage: /api/find-instr-courses?emplid=EMPLID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const emplid = req.query.emplid; // instructor ID
  const isInstructor = await checkValidId(emplid as string);

  if (isInstructor) {
    const dbCourses = (await getDB()).collection("courses");
    return dbCourses
      .find({ instructors: emplid }, { projection: { _id: 0, course_id: 1 } })
      .toArray()
      .then((allCourses) => {
        const courseIds = allCourses.map((course) => {
          return course["course_id"];
        });
        return res.status(200).json({ course_ids: courseIds });
      });
  } else {
    return res
      .status(404)
      .json({ message: `${emplid} is not a valid instructor ID` });
  }
}

// Check if emplid is valid instructor
async function checkValidId(emplid: string) {
  const dbUsers = (await getDB()).collection("users");
  return dbUsers
    .find({ instructorid: emplid })
    .toArray()
    .then((instr) => {
      return instr.length !== 0;
    });
}
