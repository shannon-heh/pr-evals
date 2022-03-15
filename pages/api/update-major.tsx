import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import sessionstorage from "sessionstorage";
import { isStudent } from "../../src/Helpers";

// API endpoint to save major for user,
// given major code and user's netid.
// Usage: /api/update-major?netid=NETID&major=MAJOR_CODE
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = sessionstorage.getItem("netid");
  const major = req.query.major as string;
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
    });
}
