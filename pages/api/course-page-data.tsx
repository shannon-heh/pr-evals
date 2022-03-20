import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { ClassData, CourseData } from "../../src/Types";

// API endpoint to retrieve course-related data
// Usage: /api/course-page-data/courseids=COURSEID1,COURSEID2,COURSEID3
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CourseData[]>
) {
  const db = await getDB();

  // courseIDs passed in as comma-separated string
  const courseids = req.query.courseids as string;
  if (!courseids) return res.status(404).end();
  const courseidsList: string[] = courseids.split(",");

  const res_: CourseData[] = [];
  for (const courseid of courseidsList) {
    const data = await getCourseData(db, courseid);
    // do not error if course data cannot be retrieved
    if (data == null) continue;
    res_.push(data);
  }
  return res.status(200).json(res_);
}

// Retrieves course data for a given courseID
function getCourseData(db, courseId: string): CourseData | null {
  return db
    .collection("courses")
    .findOne({ course_id: courseId })
    .then(async (data: Object | null) => {
      if (data == null) {
        return null;
      }
      // get number of students in course
      const num_students = await db
        .collection("users")
        .find({ student_courses: data["course_id"] })
        .count();
      const course: CourseData = {
        course_title: data["title"],
        catalog_title: data["catalog_title"],
        course_id: data["course_id"],
        instructors: data["instructors"],
        crosslisting_catalog_titles: data["crosslistings"].map(
          (crosslisting: Object) => {
            return crosslisting["catalog_title"];
          }
        ),
        classes: data["classes"].map((class_: ClassData) => {
          return {
            class_id: class_["class_number"],
            class_type: class_["type_name"],
            weekly_meetings_count: class_["weekly_meetings"],
          };
        }),
        num_students: num_students,
      };
      return course;
    })
    .catch((err) => {
      console.log(`error in getting page data for course ${courseId}`, err);
      return null;
    });
}
