import type { NextApiRequest, NextApiResponse } from "next";
import { ReqLib } from "../../src/reqLib";

const BASE_URL = "https://api.princeton.edu:443/active-directory/1.0.4";
const USERS = "/users";

// API endpoint that calls user API and retrieves user data
// for a given user's netid.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let reqLib = new ReqLib();
  const netid: string = req.query.netid as string;
  return await reqLib
    .getJSON(BASE_URL, USERS, {
      uid: netid,
    })
    .then((data) => {
      res.status(200).json(data);
    });
}
