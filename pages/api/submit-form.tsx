import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { AdminData } from "../../src/Types";

// API endpoint to get list of majors from DB
// Usage: /api/get-majors
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDB();
  const { formid, questions } = req.body;
  return db
    .collection("forms")
    .updateOne({ form_id: formid }, { $set: { questions: questions } })
    .then((data) => {
      return res
        .status(200)
        .json({ message: `updated questions for form ${formid}` });
    });
}
