import type { NextApiRequest, NextApiResponse } from "next";
import { validateInstructor, getNetID } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";

// API endpoint for instructors to publish a form
// Usage: /api/publish-form?formid=FORMID&courseid=COURSEID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!netid) return res.status(401).end();

  const db = await getDB();
  const formid = req.query.formid as string;
  const courseid = req.query.courseid as string;
  if (!formid || !courseid)
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
          published: true,
          time_published: new Date(),
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res.status(200).json(`published form ${formid}`);
    })
    .catch((err) => {
      console.log(`error in publishing form ${formid}`, err);
      return res.status(500).end();
    });
}
