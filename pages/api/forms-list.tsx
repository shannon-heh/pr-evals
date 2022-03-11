import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";

// endpoint to get form titles and IDs
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dbForms = (await getDB()).collection("forms") as Collection;
  const data = await dbForms
    .find({
      published: true,
      num_responses: { $gt: -1 }, // change to 0 later
    })
    .project({ title: 1, form_id: 1, _id: 0 })
    .toArray();
  res.status(200).json(data);
}
