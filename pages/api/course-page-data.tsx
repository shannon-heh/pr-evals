import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/database";

export type classData = {
  classID: string;
  classType: string;
  weeklyMeetingsCount: number;
};

export type instructorData = {
  instructorID: string;
  instructorName: string;
};

export type courseData = {
  courseTitle: string;
  catalogTitle: string;
  courseID: string;
  instructors: instructorData[];
  crosslistingCatalogTitles: string[];
  classes: classData[];
};

// retrieves course-related data used on course pages
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<courseData>
) {
  const coursesCollection = (await getDB()).collection("courses");
  const courseid = req.query.courseid as string;

  if (!courseid) return res.status(404).end();

  return coursesCollection
    .findOne({ course_id: courseid })
    .then((data) => {
      let course: courseData = {
        courseTitle: data["title"],
        catalogTitle: data["catalog_title"],
        courseID: data["course_id"],
        instructors: data["instructors"],
        crosslistingCatalogTitles: data["crosslistings"].map(
          (crosslisting: Object) => {
            return crosslisting["catalog_title"];
          }
        ),
        classes: data["classes"].map((class_: classData) => {
          return {
            classID: class_["class_number"],
            classType: class_["type_name"],
            weeklyMeetingsCount: class_["weekly_meetings"],
          };
        }),
      };
      res.status(200).json(course);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).end();
    });
}
