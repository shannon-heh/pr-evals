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

  const likertScales: Object[][] = [
    [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ],
    [
      { value: 1, label: "Too Slow" },
      { value: 2, label: "Slow" },
      { value: 3, label: "About Right" },
      { value: 4, label: "Fast" },
      { value: 5, label: "Too Fast" },
    ],
    [
      { value: 1, label: "Very Easy" },
      { value: 2, label: "Easy" },
      { value: 3, label: "Average" },
      { value: 4, label: "Difficult" },
      { value: 5, label: "Very Difficult" },
    ],
    [
      { value: 1, label: "Very Light" },
      { value: 2, label: "Light" },
      { value: 3, label: "Average" },
      { value: 4, label: "Heavy" },
      { value: 5, label: "Very Heavy" },
    ],
  ];

  const organizationAndStructureQuestions: string[] = [
    "I found the course intellectually challenging and stimulating.",
    "Required readings/texts were valuable.",
    "The course followed the syllabus.",
  ];

  const instructorQuestions: string[] = [
    "The instructor's explanations were clear.",
    "The instructor's materials were well prepared and carefully explained.",
    "The instructor (or TA) was adequately accessible to students during office hours or after class.",
  ];

  const assessmentAndFeedbackQuestions: string[] = [
    "Methods of evaluating student work were fair and appropriate.",
    "Exams and/or graded materials tested course content emphasized by the instructor.",
    "Course workload and requirements were appropriate for the course level.",
  ];

  const personalInteractionsQuestions: string[] = [
    "I was encouraged to participate in class discussions.",
    "I was invited to share my ideas and knowledge.",
    "I was encouraged to express my own ideas and/or question the instructor.",
  ];

  const academicRigorQuestions: string[] = [
    "Course pace was...",
    "Hours per week required outside of class",
    "Course difficulty, relative to other courses, was...",
    "Course workload, relative to other courses, was...",
  ];

  const overallQuestion =
    "Would you recommend this course to a student considering taking it? Why or why not?";

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
