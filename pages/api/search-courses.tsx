import type { NextApiRequest, NextApiResponse } from "next";
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
    return res.status(200).json({ courses: [] });
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
      "crosslistings.catalog_title": 1,
    },
  };

  return db
    .collection("courses")
    .find(query, projection)
    .toArray()
    .then((data: Object) => {
      return res.status(200).json({ courses: data });
    });
}
