import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { FormResponseData, QuestionMetadata } from "../../src/Types";
import sessionstorage from "sessionstorage";
import { validateInstructor } from "../../src/Helpers";
import objectsToCsv from "objects-to-csv";

// API endpoint to export responses for a form
// Usage: /api/export-responses?formid=FORMID&courseid=COURSEID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = sessionstorage.getItem("netid");
  const formid = req.query.formid as string;
  const courseid = req.query.courseid as string;
  const db = await getDB();

  const isValid: boolean = await validateInstructor(db, netid, courseid);
  if (!isValid) res.status(401).end();

  // get form metadata
  const form = await db
    .collection("forms")
    .findOne({ form_id: formid }, { projection: { _id: 0, questions: 1 } })
    .then((form: { questions: QuestionMetadata[] }) => {
      // reformat questions as {q_id: question...}
      const questions = {};
      form.questions.forEach((q: QuestionMetadata) => {
        questions[`${q.q_id}`] = q.question;
      });
      delete form.questions;
      return { ...form, ...questions };
    });

  // create array of response objects
  const allResponses = await db
    .collection("responses")
    .find(
      { form_id: formid },
      {
        projection: {
          _id: 0,
          course_id: 0,
          netid: 0,
        },
      }
    )
    .toArray()
    .then((formResponses: Object[]) => {
      return formResponses.map((rData: FormResponseData) => {
        // restructure to be {q1: r1, q2: r2...}
        const qToR = {};
        rData.responses.forEach((r: { q_id: number; response: any }) => {
          if (typeof r.response == "object") {
            qToR[form[`${r.q_id}`]] = r.response.join(",");
          } else {
            qToR[form[`${r.q_id}`]] = r.response;
          }
        });

        delete rData.responses;
        return {
          "Time Submitted": new Date(rData.time_submitted).toLocaleString(
            "en-US"
          ),
          ...qToR,
        };
      });
    });

  // convert array of objects to csv string
  const csv = new objectsToCsv(allResponses);
  const csvString = await csv.toString();
  return res.status(200).json(csvString);
}
