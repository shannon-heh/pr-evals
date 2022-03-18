import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import sessionstorage from "sessionstorage";

type FormStats = { numForms: number; numSubmitted: number };

// API endpoint to retrieve form stats for courses
// Usage: /api/course-forms-data/courseids=COURSEID1,COURSEID2,COURSEID3
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  const db = await getDB();

  // courseIDs passed in as comma-separated string
  const courseids = req.query.courseids as string;
  if (!courseids) return res.status(404).end();
  const courseidsList: string[] = courseids.split(",");

  const res_ = {};
  for (const courseid of courseidsList) {
    const stats: FormStats = await getFormStats(db, courseid);
    res_[courseid] = stats;
  }
  return res.status(200).json(res_);
}

// Retrieves form data for a given courseID
async function getFormStats(db, courseId: string): Promise<FormStats> {
  // get number of forms for a course
  const numForms: number = await db
    .collection("forms")
    .find({ course_id: courseId, published: true })
    .count();
  // get number of completed forms for this student
  const netid: string = sessionstorage.getItem("netid");
  const numSubmitted: number = await db
    .collection("responses")
    .find({ course_id: courseId, netid: netid })
    .count();
  return { numForms, numSubmitted };
}