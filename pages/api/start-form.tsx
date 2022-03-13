import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";

type Args = {
  courseid: string;
  netid: string;
  title: string;
  description: string;
};

// API endpoint for instructors to start a new form
// Usage: call using POST request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { courseid, netid, title, description }: Args = req.body;
  const db = await getDB();

  // validate query args
  const isValid: boolean = await validateInstr(db, netid, courseid);
  if (!isValid) {
    return res.status(401).json({
      message: `${netid} is not an instructor for course ${courseid}`,
    });
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

// validate that netid is an instructor, and courseid is one of their courses
async function validateInstr(db, netid: string, courseid: string) {
  const { instructor_courses, person_type } = await db
    .collection("users")
    .findOne({ netid: netid }, { instructor_courses: 1, person_type: 1 });
  if (person_type !== "instructor") {
    return false;
  }
  if (!instructor_courses.includes(courseid)) {
    return false;
  }
  return true;
}
