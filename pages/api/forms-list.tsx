import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getNetID } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";

// endpoint to get form titles and IDs
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!getNetID()) return res.end();

  const courseid = req.query.courseid as string;
  const dbForms = (await getDB()).collection("forms") as Collection;
  const data = await dbForms
    .find({
      course_id: courseid,
      published: true,
    })
    .project({ title: 1, form_id: 1, _id: 0 })
    .toArray();
  res.status(200).json(data);
}
