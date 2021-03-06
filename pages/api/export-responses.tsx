import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { FormResponseData, QuestionMetadata } from "../../src/Types";
import { AUTH_COOKIE, validateInstructor } from "../../src/Helpers";
import objectsToCsv from "objects-to-csv";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to export responses for a form
// Usage: /api/export-responses?formid=FORMID&courseid=COURSEID
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const formid = req.query.formid as string;
  const courseid = req.query.courseid as string;
  if (!formid || !courseid)
    return res.status(404).json("missing query parameters");

  const db = await getDB();

  const isValid: boolean = await validateInstructor(db, netid, courseid);
  if (!isValid) res.status(401).end();

  // validate this form's responses have been released
  const { released } = await db
    .collection("forms")
    .findOne({ form_id: formid }, { projection: { _id: 0, released: 1 } });
  if (!released)
    return res
      .status(401)
      .json(
        "Cannot export responses for this form, since responses haven't been released by the instructor."
      );

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
  return await db
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
    .then(async (formResponses: Object[]) => {
      const allResponses = formResponses.map((rData: FormResponseData) => {
        // restructure to be {q1: r1, q2: r2...}
        const qToR = {};
        rData.responses.forEach((r: { q_id: number; response: any }) => {
          if (r.response == null) {
            // empty string for unanswered questions
            qToR[form[`${r.q_id}`]] = "";
          } else if (typeof r.response == "object") {
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

      // convert array of objects to csv string
      const csv = new objectsToCsv(allResponses);
      const csvString = await csv.toString();
      return res.status(200).json(csvString);
    })
    .catch((err) => {
      console.log(`error in exporting responses for form ${formid}`, err);
      return res.status(500).end();
    });
}
