import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { AUTH_COOKIE, validateInstructor } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint for instructors to release responses for form
// Usage: /api/release-form?formid=FORMID&courseid=COURSEID
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const db = await getDB();
  const formid = req.query.formid as string;
  const courseid = req.query.courseid as string;
  if (!courseid || !formid)
    return res.status(404).json("missing query parameters");

  const isValid: boolean = await validateInstructor(db, netid, courseid);
  if (!isValid) {
    return res
      .status(401)
      .json(`${netid} is not an instructor for course ${courseid}`);
  }

  return db
    .collection("forms")
    .updateOne(
      { form_id: formid },
      {
        $set: {
          released: true,
          time_released: new Date(),
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res.status(200).json(`released responses for form ${formid}`);
    })
    .catch((err) => {
      console.log(`error in releasing responses for form ${formid}`, err);
      return res.status(500).end();
    });
}
