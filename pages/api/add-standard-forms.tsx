import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { FormMetadata } from "../../src/Types";
import { getNetID } from "../../src/Helpers";

// APi endpoint to add a standard form for each course in DB
// Only call-able by sheh or ntyp
// Usage: /api/add-standard-forms
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!netid || (netid != "sheh" && netid != "ntyp"))
    return res.status(401).end();

  const db = await getDB();

  // delete any existing standardized forms
  await db.collection("forms").deleteMany({ standardized: true });

  // insert standard form for every course
  return db
    .collection("courses")
    .find({}, { _id: 0, guid: 1, course_id: 1 })
    .toArray()
    .then((courses: { guid: string; course_id: string }[]) => {
      const stdForms = courses.map((course) => {
        // standard form id always ends with -std
        const form: FormMetadata = {
          form_id: course.guid + "-std",
          description: "standard form", // change description
          questions: [], // add questions here
          title: "Standard Form", // change title
          standardized: true,
          published: true,
          time_published: new Date(),
          released: true,
          time_released: new Date(),
          course_id: course.course_id,
        };
        return form;
      });
      return db.collection("forms").insertMany(stdForms);
    })
    .then(() => {
      return res
        .status(200)
        .json("inserted a standard form into DB for every course");
    })
    .catch((err) => {
      console.log("error in inserting standard forms to DB:", err);
      return res.status(500).end();
    });
}
