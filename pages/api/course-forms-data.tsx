import type { NextApiRequest } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { AUTH_COOKIE } from "../../src/Helpers";

type FormStats = { numForms: number; numSubmitted: number };

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to retrieve form stats for courses
// Usage: /api/course-forms-data?courseids=COURSEID1,COURSEID2,COURSEID3
async function handler(req: NextApiRequest, res) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

  const db = await getDB();

  // courseIDs passed in as comma-separated string
  const courseids = req.query.courseids as string;
  if (!courseids) return res.status(404).end();
  const courseidsList: string[] = courseids.split(",");

  const res_ = {};
  for (const courseid of courseidsList) {
    const stats: FormStats = await getFormStats(db, courseid, netid);
    res_[courseid] = stats;
  }
  return res.status(200).json(res_);
}

// Retrieves form data for a given courseID
async function getFormStats(
  db,
  courseId: string,
  netid: string
): Promise<FormStats> {
  // get number of forms for a course
  let numForms = 0;
  try {
    numForms = await db
      .collection("forms")
      .find({ course_id: courseId, published: true })
      .count();
  } catch (err) {
    console.log(`error in getting # forms in course ${courseId}`, err);
  }

  // get number of completed forms for this student
  let numSubmitted = 0;
  try {
    numSubmitted = await db
      .collection("responses")
      .find({ course_id: courseId, netid: netid })
      .count();
  } catch (err) {
    console.log(
      `error in getting # forms submitted by ${netid} in course ${courseId}`,
      err
    );
  }
  return { numForms, numSubmitted };
}
