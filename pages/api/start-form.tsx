import type { NextApiRequest, NextApiResponse } from "next";
import { validateInstructor } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";
import sessionstorage from "sessionstorage";

type Args = {
  courseid: string;
  title: string;
  description: string;
};

// API endpoint for instructors to start a new form
// Usage: call using POST request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = sessionstorage.getItem("netid");
  const { courseid, title, description }: Args = req.body;
  const db = await getDB();

  const isValid: boolean = await validateInstructor(db, netid, courseid);
  if (!isValid) {
    return res
      .status(401)
      .json(`${netid} is not an instructor for course ${courseid}`);
  }

  // construct new form ID
  const { counter, guid } = await db
    .collection("courses")
    .findOne(
      { course_id: courseid },
      { projection: { _id: 0, counter: 1, guid: 1 } }
    );
  const formid: string = `${guid}-${counter}`;

  // increment counter for next form
  await db
    .collection("courses")
    .updateOne({ course_id: courseid }, { $inc: { counter: 1 } });

  // insert new form document
  return await db
    .collection("forms")
    .updateOne(
      { form_id: formid },
      {
        $set: {
          course_id: courseid,
          time_created: new Date(),
          questions: [],
          title: title,
          description: description,
          published: false,
        },
      },
      { upsert: true }
    )
    .then(() => {
      // return formid in response
      return res.status(200).json({ formid });
    });
}
