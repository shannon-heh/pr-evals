import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { AUTH_COOKIE } from "../../src/Helpers";

type Data = {
  status: string;
};

export default withIronSessionApiRoute(handler, AUTH_COOKIE);

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  req.session.destroy();
  res.status(200).json({ status: "ok" });
}
