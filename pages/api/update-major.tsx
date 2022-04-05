import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { AUTH_COOKIE, isStudent } from "../../src/Helpers";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to save major for user,
// given major code and user's netid.
// Usage: /api/update-major?netid=NETID&major=MAJOR_CODE
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const major = req.query.major as string;
  if (!major) return res.status(404).json("missing query parameters");

  const db = await getDB();

  // make sure only students can update major
  const student: boolean = await isStudent(db, netid);
  if (!student) {
    return res.status(401).json(`${netid} is not a student`);
  }

  return db
    .collection("users")
    .updateOne({ netid: netid }, { $set: { major_code: major } })
    .then(() => {
      res.status(200).json(`updated major ${major} for ${netid}`);
    })
    .catch((err) => {
      console.log(`error in updating major ${major} for ${netid}`, err);
      return res.status(500).end();
    });
}
