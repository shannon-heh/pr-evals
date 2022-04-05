import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { CourseFormData, FormMetadata } from "../../src/Types";
import { AUTH_COOKIE, sortByReleased } from "../../src/Helpers";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to get a course's forms given a course ID
// For students, we also retrieve whether they completed each form
// Usage: /api/get-course-forms?courseid=COURSEID
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const courseid = req.query.courseid as string;
  if (!courseid) return res.status(404).json("missing query parameters");

  const db = await getDB();

  // get all published forms for a course
  return await db
    .collection("forms")
    .find(
      { course_id: courseid },
      {
        projection: {
          _id: 0,
          title: 1,
          description: 1,
          form_id: 1,
          time_created: 1,
          published: 1,
          time_published: 1,
          released: 1,
          time_released: 1,
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
      forms.sort(sortByReleased);
      return res.status(200).json(forms);
    })
    .catch((err) => {
      console.log(
        `error in retrieving course forms for course ${courseid}`,
        err
      );
      return res.status(500).end();
    });
}
