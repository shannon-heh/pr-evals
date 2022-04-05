import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { FormResponseData } from "../../src/Types";
import { AUTH_COOKIE } from "../../src/Helpers";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to get a student's form response given a form ID
// Usage: /api/get-form-response?formid=FORMID
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();
  const netid: string = user["netid"];

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
        `error in getting response for form ${formid} and student ${netid}`,
        err
      );
      return res.status(500).end();
    });
}
