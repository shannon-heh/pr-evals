import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { FormMetadata, Question, QuestionMetadata } from "../../src/Types";
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
      { value: 1, label: "0-2" },
      { value: 2, label: "2-4" },
      { value: 3, label: "4-7" },
      { value: 4, label: "7-10" },
      { value: 5, label: ">10" },
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

  let id = 0;
  let likertIdx = 0;

  const organizationAndStructureQuestions: QuestionMetadata[] = [
    "I found the course intellectually challenging and stimulating.",
    "Required readings/texts were valuable.",
    "The course followed the syllabus.",
  ].map((questionText) => {
    return {
      question: questionText,
      description: "Category: Organization and Structure",
      q_id: id++,
      type: Question.Slider,
      min: 1,
      max: 5,
      step: 1,
      marks: likertScales[likertIdx],
    };
  }) as QuestionMetadata[];

  const instructorQuestions: QuestionMetadata[] = [
    "The instructor's explanations were clear.",
    "The instructor's materials were well prepared and carefully explained.",
    "The instructor (or TA) was adequately accessible to students during office hours or after class.",
  ].map((questionText) => {
    return {
      question: questionText,
      description: "Category: Instructor",
      q_id: id++,
      type: Question.Slider,
      min: 1,
      max: 5,
      step: 1,
      marks: likertScales[likertIdx],
    };
  }) as QuestionMetadata[];

  const assessmentAndFeedbackQuestions: QuestionMetadata[] = [
    "Methods of evaluating student work were fair and appropriate.",
    "Exams and/or graded materials tested course content emphasized by the instructor.",
    "Course workload and requirements were appropriate for the course level.",
  ].map((questionText) => {
    return {
      question: questionText,
      description: "Category: Assessment and Feedback",
      q_id: id++,
      type: Question.Slider,
      min: 1,
      max: 5,
      step: 1,
      marks: likertScales[likertIdx],
    };
  }) as QuestionMetadata[];

  const personalInteractionsQuestions: QuestionMetadata[] = [
    "I was encouraged to participate in class discussions.",
    "I was invited to share my ideas and knowledge.",
    "I was encouraged to express my own ideas and/or question the instructor.",
  ].map((questionText) => {
    return {
      question: questionText,
      description: "Category: Personal Interactions",
      q_id: id++,
      type: Question.Slider,
      min: 1,
      max: 5,
      step: 1,
      marks: likertScales[likertIdx],
    };
  }) as QuestionMetadata[];

  const breadthQuestions: QuestionMetadata[] = organizationAndStructureQuestions
    .concat(instructorQuestions)
    .concat(assessmentAndFeedbackQuestions)
    .concat(personalInteractionsQuestions);

  const academicRigorQuestions: QuestionMetadata[] = [
    "Course pace was...",
    "Hours per week required outside of class",
    "Course difficulty, relative to other courses, was...",
    "Course workload, relative to other courses, was...",
  ].map((questionText) => {
    return {
      question: questionText,
      description: "Category: Academic Rigor",
      q_id: id++,
      type: Question.Slider,
      min: 1,
      max: 5,
      step: 1,
      marks: likertScales[++likertIdx],
    };
  }) as QuestionMetadata[];

  const overallQuestion: QuestionMetadata[] = [
    {
      question:
        "My background prepared me well for this course's requirements.",
      description: "Category: Overall",
      q_id: id++,
      type: Question.Slider,
      min: 1,
      max: 5,
      step: 1,
      // @ts-expect-error
      marks: likertScales[0],
    },
    {
      question: "Why did you decide to take this course?",
      description: "Category: Overall",
      q_id: id++,
      type: Question.MultiSelect,
      options: [
        "General interest",
        "Pre-requisite",
        "Distribution requirement",
        "Departmental requirement",
        "To fill my schedule",
      ],
    },
    {
      question:
        "Would you recommend this course to a student considering taking it? Why or why not?",
      description: "Category: Overall",
      q_id: id++,
      type: Question.LongText,
    },
  ];

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
          description:
            "Responses to this form are visualized/displayed in the Charts and Reviews tabs!",
          questions: academicRigorQuestions
            .concat(breadthQuestions)
            .concat(overallQuestion),
          title: "Standardized Evaluations Form",
          standardized: true,
          published: true,
          time_published: new Date(),
          released: false,
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
