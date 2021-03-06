import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { AUTH_COOKIE, validateStudent } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";

type Args = {
  formid: string;
  responses: { q_id: number; response: any }[];
  courseid: string;
};

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint for students to submit completed form
// Usage: call using POST request
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const { formid, courseid, responses }: Args = req.body;
  if (!formid || !courseid || !responses)
    return res.status(404).json("missing query parameters");

  const db = await getDB();

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
          course_id: courseid,
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res
        .status(200)
        .json(`updated ${netid}'s response for form ${formid}`);
    })
    .catch((err) => {
      console.log(
        `error in updating ${netid}'s response for form ${formid}`,
        err
      );
      return res.status(500).end();
    });
}
