import type { NextApiRequest, NextApiResponse } from "next";
import { validateInstructor, getNetID } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";
import { QuestionMetadata } from "../../src/Types";

type Args = {
  formid: string;
  questions: QuestionMetadata[];
  courseid: string;
};

// API endpoint for instructors to finish creating new form
// Usage: call using POST request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!netid) return res.status(401).end();

  const db = await getDB();
  const { formid, questions, courseid }: Args = req.body;

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
          published: true,
          time_published: new Date(),
          questions: questions,
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res.status(200).json(`updated questions for form ${formid}`);
    })
    .catch((err) => {
      console.log(`error in creating form for ${courseid}`, err);
      return res.status(500).end();
    });
}
