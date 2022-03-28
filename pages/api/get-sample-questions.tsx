import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { AdminData } from "../../src/Types";
import { getNetID } from "../../src/Helpers";

// API endpoint to get sample questions from DB
// Usage: /api/get-sample-questions
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!getNetID()) return res.status(401).end();

  const db = await getDB();
  return await db
    .collection("admin")
    .findOne({}, { projection: { _id: 0, sample_questions: 1 } })
    .then((data: AdminData) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(`error in getting sample questions`, err);
      return res.status(500).end();
    });
}
