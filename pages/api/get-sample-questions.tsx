import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getDB } from "../../src/mongodb";
import { AdminData } from "../../src/Types";
import { AUTH_COOKIE } from "../../src/Helpers";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// API endpoint to get sample questions from DB
// Usage: /api/get-sample-questions
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();

  const db = await getDB();
  return await db
    .collection("admin")
    .findOne({}, { projection: { _id: 0, sample_questions: 1 } })
    .then((data: AdminData) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(`error in getting sample questions`, err);
      return res.status(500).end();
    });
}
