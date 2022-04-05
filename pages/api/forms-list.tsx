import { Collection } from "mongodb";
import { NextApiRequest } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { AUTH_COOKIE } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

// endpoint to get form titles and IDs
async function handler(req: NextApiRequest, res) {
  const user = req.session["user"];
  if (!user) return res.status(401).end();

  const courseid = req.query.courseid as string;
  const dbForms = (await getDB()).collection("forms") as Collection;
  const data = await dbForms
    .find({
      course_id: courseid,
      released: true,
      form_id: /-\d*$/,
    })
    .project({ title: 1, form_id: 1, _id: 0 })
    .toArray();
  res.status(200).json(data);
}
