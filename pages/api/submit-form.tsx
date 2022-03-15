import type { NextApiRequest, NextApiResponse } from "next";
import { validateStudent } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";
import sessionstorage from "sessionstorage";

type Args = {
  formid: string;
  responses: { q_id: number; response: any }[];
  courseid: string;
};

// API endpoint for students to submit completed form
// Usage: call using POST request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDB();
  const netid: string = sessionstorage.getItem("netid");
  const { formid, responses, courseid }: Args = req.body;

  const isValid: boolean = await validateStudent(db, netid, courseid);
  if (!isValid) {
    return res
      .status(401)
      .json(`${netid} is not a student in course ${courseid}`);
  }

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
        .json(`updated ${netid}'s response for form ${formid}`);
    });
}
