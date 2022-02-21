import type { NextApiRequest, NextApiResponse } from "next";
import { CourseData } from "../../src/Types";
import { getDB } from "../../src/mongodb";

// API endpoint to search for courses in DB
// given a user query
// Usage: /api/search-courses?q=QUERY
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q: string = req.query.q as string;
  const db = await getDB();

  const qMod = q.replace(/\s+/g, ""); // strip whitespaces

  // if empty query, don't return results
  if (qMod == "") {
    return res.status(200).json([]);
  }

  // if query is substring of dept + course code, or title
  const query: Object = {
    $or: [
      { catalog_title: { $regex: qMod, $options: "i" } },
      { title: { $regex: q, $options: "i" } },
      { "crosslistings.catalog_title": { $regex: qMod, $options: "i" } },
    ],
  };

  // returned fields
  const projection: Object = {
    projection: {
      _id: 0,
      course_id: 1,
      title: 1,
      catalog_title: 1,
      crosslistings: 1,
    },
  };

  return db
    .collection("courses")
    .find(query, projection)
    .toArray()
    .then((data: Object[]) => {
      const courses: CourseData[] = data.map((course: Object) => {
        return {
          course_title: course["title"],
          catalog_title: course["catalog_title"],
          course_id: course["course_id"],
          crosslisting_catalog_titles: course["crosslistings"].map(
            (crosslisting: Object) => {
              return crosslisting["catalog_title"];
            }
          ),
        };
      });
      return res.status(200).json(courses);
    });
}
