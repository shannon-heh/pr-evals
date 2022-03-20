import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { FormMetadata } from "../../src/Types";
import sessionstorage from "sessionstorage";

// APi endpoint to add a standard form for each course in DB
// Only call-able by sheh or ntyp
// Usage: /api/add-standard-forms
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDB();
  const netid = sessionstorage.getItem("netid");
  if (netid != "sheh" && netid != "ntyp") return res.status(401).end();

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
          published: true,
          standardized: true,
          time_published: new Date(),
          course_id: course.course_id,
          released: false,
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
      console.log("error in adding standard forms to DB:", err);
      return res.status(500).end();
    });
}
