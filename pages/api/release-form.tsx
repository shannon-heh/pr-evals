import type { NextApiRequest, NextApiResponse } from "next";
import { validateInstructor, getNetID } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";

// API endpoint for instructors to release responses for form
// Usage: /api/release-form?formid=FORMID&courseid=COURSEID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!netid) return res.status(401).end();

  const db = await getDB();
  const formid = req.query.formid as string;
  const courseid = req.query.courseid as string;

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
          released: true,
          time_released: new Date(),
        },
      },
      { upsert: true }
    )
    .then(() => {
      return res.status(200).json(`released responses for form ${formid}`);
    })
    .catch((err) => {
      console.log(`error in releasing responses for form ${formid}`, err);
      return res.status(500).end();
    });
}
