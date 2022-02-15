import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";

// API endpoint to get list of majors from DB
// Usage: /api/get-majors
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDB();
  return await db
    .collection("admin")
    .findOne({}, { projection: { _id: 0, majors: 1 } })
    .then((data) => {
      return res.status(200).json({ data: data });
    });
}
