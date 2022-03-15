import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";

type Args = {
  formid: string;
  responses: { q_id: number; response: any }[];
  netid: string;
};

// API endpoint for students to submit completed form
// Usage: call using POST request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDB();
  const { formid, responses, netid }: Args = req.body;
  return db
    .collection("responses")
    .updateOne(
      { form_id: formid, netid: netid },
      {
        $set: {
          time_submitted: new Date(),
          responses: responses,
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res
        .status(200)
        .json({ message: `updated ${netid}'s response for form ${formid}` });
    });
}
