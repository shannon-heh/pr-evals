import type { NextApiRequest, NextApiResponse } from "next";
import { validateInstructor, getNetID } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";
import { QuestionMetadata } from "../../src/Types";

type Args = {
  formid: string;
  questions: QuestionMetadata[];
  courseid: string;
};

// API endpoint for instructors to edit their form
// Usage: call using POST request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!netid) return res.status(401).end();

  const db = await getDB();
  const { formid, questions, courseid }: Args = req.body;
  if (!formid || !questions || !courseid)
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
          questions: questions,
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res.status(200).json(`updated questions for form ${formid}`);
    })
    .catch((err) => {
      console.log(`error in updating questions for form ${formid}`, err);
      return res.status(500).end();
    });
}
