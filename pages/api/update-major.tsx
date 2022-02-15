import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";

// API endpoint to save major for user,
// given major code and user's netid.
// Usage: /api/update-major?netid=NETID&major=MAJOR_CODE
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = req.query.netid as string;
  const major: string = req.query.major as string;
  const db = await getDB();
  return db
    .collection("users")
    .updateOne({ netid: netid }, { $set: { major_code: major } })
    .then(() => {
      res.status(200).json({ message: `updated major ${major} for ${netid}` });
    });
}
