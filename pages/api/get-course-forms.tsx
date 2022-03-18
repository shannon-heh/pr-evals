import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { FormMetadata, CourseFormData } from "../../src/Types";
import sessionstorage from "sessionstorage";

// API endpoint to get a course's forms given a course ID
// For students, we also retrieve whether they completed each form
// Usage: /api/get-course-forms?courseid=COURSEID&netid=NETID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = sessionstorage.getItem("netid");
  const courseid = req.query.courseid as string;
  const db = await getDB();

  // get all published forms for a course
  return await db
    .collection("forms")
    .find(
      { course_id: courseid, published: true },
      {
        projection: {
          _id: 0,
          title: 1,
          form_id: 1,
          time_published: 1,
          standardized: 1,
        },
      }
    )
    .toArray()
    .then((forms: Object[]) => {
      // for each form...
      return Promise.all(
        forms.map(async (form: FormMetadata) => {
          // get number of responses
          const numResponses = await db
            .collection("responses")
            .find({ form_id: form.form_id })
            .count();

          // return some more data
          return await db
            .collection("responses")
            .findOne(
              { netid: netid, form_id: form.form_id },
              {
                projection: {
                  _id: 0,
                  time_submitted: 1,
                },
              }
            )
            .then((response: Object) => {
              // response is null if student didn't submit form
              return {
                ...form,
                ...response,
                completed: response != null,
                num_responses: numResponses,
              };
            });
        })
      );
    })
    .then((forms: CourseFormData[]) => {
      return res.status(200).json(forms);
    });
}
