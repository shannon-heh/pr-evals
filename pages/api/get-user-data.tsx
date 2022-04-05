import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { UserDataDB } from "../../src/Types";
import { AUTH_COOKIE } from "../../src/Helpers";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to return data about an instructor or student
// (given their netid)
// Usage: /api/get-user-data
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const dbUsers = (await getDB()).collection("users");
  return dbUsers
    .findOne(
      { netid: netid },
      {
        projection: {
          _id: 0,
        },
      }
    )
    .then((user: UserDataDB) => {
      // if given netid is not valid
      if (user == null) {
        return res.status(404).json(`user ${netid} not found in DB`);
      }
      if (user["person_type"] === "instructor") {
        delete user["class_year"];
        delete user["student_courses"];
        delete user["major_code"];
      } else {
        delete user["instructorid"];
        delete user["instructor_courses"];
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.log(`error in getting data about user ${netid}`, err);
      return res.status(500).end();
    });
}
