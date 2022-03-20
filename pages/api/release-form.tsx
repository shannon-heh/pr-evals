import type { NextApiRequest, NextApiResponse } from "next";
import { validateInstructor } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";
import sessionstorage from "sessionstorage";

// API endpoint for instructors to release responses for form
// Usage: /api/release-form?formid=FORMID&courseid=COURSEID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDB();
  const netid: string = sessionstorage.getItem("netid");
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
      console.log(`failed to release responses for form ${formid}`, err);
      return res.status(500).end();
    });
}
