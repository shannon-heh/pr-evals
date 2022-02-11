import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/database";

type classData = {
  classID: string;
  classType: string;
};

type courseData = {
  courseTitle: string;
  catalogTitle: string;
  courseID: string;
  instructorIDs: string;
  crosslistingCatalogTitles: string[];
  classes: classData[];
};

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
        instructorIDs: data["instructors"].join(","),
        crosslistingCatalogTitles: data["crosslistings"].map(
          (crosslisting: Object) => {
            return crosslisting["catalog_title"];
          }
        ),
        classes: data["classes"].map((class_: classData) => {
          return {
            classID: class_["class_number"],
            classType: class_["type_name"],
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
