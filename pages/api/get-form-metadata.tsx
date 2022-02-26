import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { FormMetadata } from "../../src/Types";

// API endpoint to get form metadata given a form ID
// Usage: /api/get-form-metadata?formid=FORMID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const formid = req.query.formid as string;
  const db = await getDB();
  return await db
    .collection("forms")
    .findOne({ form_id: formid }, { projection: { _id: 0 } })
    .then((data: FormMetadata) => {
      return res.status(200).json(data);
    });
}
