import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { QuestionMetadata } from "../../src/Types";

type Args = {
  formid: string;
  questions: QuestionMetadata[];
};

// API endpoint for instructors to finish creating new form
// Usage: call using POST request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDB();
  const { formid, questions }: Args = req.body;
  return db
    .collection("forms")
    .updateOne(
      { form_id: formid },
      {
        $set: {
          published: true,
          time_published: new Date(),
          questions: questions,
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res
        .status(200)
        .json({ message: `updated questions for form ${formid}` });
    });
}
