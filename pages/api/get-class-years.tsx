import type { NextApiRequest } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { AUTH_COOKIE } from "../../src/Helpers";
import { Collection } from "mongodb";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to get list of class years from DB given a courseID
// Usage: /api/get-class-years
async function handler(req: NextApiRequest, res) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();

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
