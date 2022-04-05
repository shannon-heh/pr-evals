import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { getNetID } from "../../src/Helpers";
import { Collection } from "mongodb";

// API endpoint to get list of class years from DB given a courseID
// Usage: /api/get-class-years
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!getNetID()) return res.status(401).end();

  const courseid = req.query.courseid as string;

  const dbUsers = (await getDB()).collection("users") as Collection;

  const usersInCourse = await dbUsers
    .find({ student_courses: courseid })
    .project({ class_year: 1 })
    .toArray();

  let uniqueClassYears = usersInCourse.map((e) => e["class_year"]);
  uniqueClassYears = uniqueClassYears.filter(function (item, pos) {
    return uniqueClassYears.indexOf(item) == pos;
  });

  return res.status(200).json(uniqueClassYears.filter((item) => item)); // remove nulls
}
