import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { ClassData, CourseData } from "../../src/Types";

// retrieves course-related data used on course pages
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const coursesCollection = (await getDB()).collection("courses");

  // courseIDs passed in as comma-separated string
  const courseids = req.query.courseids as string;
  if (!courseids) return res.status(404).end();
  const courseidsList: string[] = courseids.split(",");

  const res_: CourseData[] = [];
  for (const courseid of courseidsList) {
    const data = await getCourseData(coursesCollection, courseid);
    if (data == null) continue;
    res_.push(data);
  }
  return res.status(200).json(res_);
}

// Retrieves course data for a given courseID
function getCourseData(db, courseId: string): CourseData | null {
  return db
    .findOne({ course_id: courseId })
    .then((data: Object | null) => {
      if (data == null) {
        return null;
      }
      let course: CourseData = {
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
      };
      return course;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
}
