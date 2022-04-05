import type { NextApiRequest, NextApiResponse } from "next";
import { getNetID, validateInstructor } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";
import { QuestionMetadata } from "../../src/Types";

type Args = {
  formid: string;
  questions: QuestionMetadata[];
  courseid: string;
  publish: boolean;
};

// API endpoint for instructors to edit their form
// Usage: call using POST request
// Set 'publish' to true in order to publish this form
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!netid) return res.status(401).end();

  const db = await getDB();
  const { formid, questions, courseid, publish }: Args = req.body;
  if (!formid || !questions || !courseid)
    return res.status(404).json("missing query parameters");

  const isValid: boolean = await validateInstructor(db, netid, courseid);
  if (!isValid) {
    return res
      .status(401)
      .json(`${netid} is not an instructor for course ${courseid}`);
  }

  const setFields = publish
    ? {
        questions: questions,
        published: true,
        time_published: new Date(),
      }
    : {
        questions: questions,
      };

  return db
    .collection("forms")
    .updateOne(
      { form_id: formid },
      {
        $set: setFields,
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
