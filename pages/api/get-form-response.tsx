import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { FormResponseData } from "../../src/Types";
import { getNetID } from "../../src/Helpers";

// API endpoint to get a student's form response given a form ID
// Usage: /api/get-form-response?formid=FORMID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid: string = getNetID();
  if (!netid) return res.status(401).end();

  const formid = req.query.formid as string;
  if (!formid) return res.status(404).json("missing query parameters");

  const db = await getDB();

  return await db
    .collection("responses")
    .findOne({ form_id: formid, netid: netid }, { projection: { _id: 0 } })
    .then((data: FormResponseData) => {
      if (data == null) return res.status(200).json({});
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(
        `error in getting reesponse for form ${formid} and student ${netid}`,
        err
      );
      return res.status(500).end();
    });
}
