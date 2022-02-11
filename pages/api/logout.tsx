import type { NextApiRequest, NextApiResponse } from "next";
import sessionstorage from "sessionstorage";

type Data = {
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  sessionstorage.removeItem("netid");
  res.status(200).json({ status: "ok" });
}
