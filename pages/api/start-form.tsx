import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { AUTH_COOKIE, validateInstructor } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";

type Args = {
  courseid: string;
  title: string;
  description: string;
};

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint for instructors to start a new form
// Usage: call using POST request
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const { courseid, title, description }: Args = req.body;
  if (!courseid || !title)
    return res.status(404).json("missing query parameters");

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
  const formid = `${guid}-${counter}`;

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
          released: false,
        },
      },
      { upsert: true }
    )
    .then(() => {
      // return formid in response
      return res.status(200).json({ formid });
    })
    .catch((err) => {
      console.log(`error in starting form for course ${courseid}`, err);
      return res.status(500).end();
    });
}
