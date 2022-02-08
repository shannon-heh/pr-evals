import type { NextApiRequest, NextApiResponse } from "next";
import urllib from "urllib";
import sessionstorage from "sessionstorage";
import { MongoClient } from "mongodb";

type Data = {
  netid?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // attempt to retrieve netID from session (i.e. user logged in already)
  let netid: string = sessionstorage.getItem("netid");
  if (netid) {
    res.status(200).json({ netid: netid.toLowerCase() });
    return;
  }

  // connect to DB
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const usersCollection = client.db("course-evals-iw").collection("users");

  // otherwise, perform CAS login
  await urllib
    .request(
      `${process.env.NEXT_PUBLIC_CAS_SERVER_URL}/validate?service=${process.env.NEXT_PUBLIC_HOSTNAME}&ticket=${req.query.ticket}`
    )
    .then((res_) => {
      // validate CAS response
      let casData: string = res_.data.toString();
      if (!casData) {
        res.status(201).json({});
        return "";
      }
      let casDataParts: string[] = casData.split("\n");
      if (casDataParts.length < 3 || casDataParts[0] != "yes") {
        res.status(201).json({});
        return "";
      }
      // CAS response validated, save netID to session
      let netid: string = casDataParts[1].toLowerCase();
      sessionstorage.setItem("netid", netid);
      res.status(200).json({ netid: netid });
      return netid;
    })
    .then((netid: string) => {
      if (!netid) return;
      // if necessary, create user document in database
      usersCollection
        .updateOne(
          { netid: netid },
          // TODO: correctly set isInstructor and instructorid from /users
          { $set: { netid: netid, isInstructor: false, instructorid: 0 } },
          { upsert: true }
        )
        .then(() => client.close());
    })
    .catch((err) => {
      console.log(err);
      res.status(201).json({});
    });
}
