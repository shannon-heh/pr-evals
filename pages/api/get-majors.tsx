import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { AUTH_COOKIE } from "../../src/Helpers";
import { Collection } from "mongodb";
import { AdminData } from "../../src/Types";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to get list of concentrations from DB given a courseID
// Usage: /api/get-majors
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();

  const courseid = req.query.courseid as string;

  // original functionality, meant for profile page
  if (courseid === undefined) {
    const db = await getDB();
    return await db
      .collection("admin")
      .findOne({}, { projection: { _id: 0, majors: 1 } })
      .then((data: AdminData) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        console.log(`error in getting list of majors`, err);
        return res.status(500).end();
      });
  }

  const dbUsers = (await getDB()).collection("users") as Collection;

  const usersInCourse = await dbUsers
    .find({ student_courses: courseid })
    .project({ major_code: 1 })
    .toArray();

  let uniqueMajorCodes = usersInCourse.map((e) => e["major_code"]);
  uniqueMajorCodes = uniqueMajorCodes.filter(function (item, pos) {
    return uniqueMajorCodes.indexOf(item) == pos;
  });

  return res.status(200).json(uniqueMajorCodes.filter((item) => item)); // remove nulls
}
