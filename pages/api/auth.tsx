import type { NextApiRequest, NextApiResponse } from "next";
import urllib from "urllib";
import sessionstorage from "sessionstorage";

type Data = {
  netid?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let netid: string = sessionstorage.getItem("netid");
  if (netid) {
    res.status(200).json({ netid: netid });
    return;
  }
  await urllib
    .request(
      `${process.env.NEXT_PUBLIC_CAS_SERVER_URL}/validate?service=${process.env.NEXT_PUBLIC_HOSTNAME}&ticket=${req.query.ticket}`
    )
    .then((res_) => {
      let casData: string = res_.data.toString();
      if (!casData) {
        res.status(201).json({});
        return;
      }
      let casDataParts: string[] = casData.split("\n");
      if (casDataParts.length < 3 || casDataParts[0] != "yes") {
        res.status(201).json({});
        return;
      }
      let netid: string = casDataParts[1];
      sessionstorage.setItem("netid", netid);
      res.status(200).json({ netid: netid });
    })
    .catch((err) => {
      console.log(err);
      res.status(201).json({});
    });
}
