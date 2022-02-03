import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const url = process.env.DATABASE_URL;
  const client = new MongoClient(url);

  async function main() {
    await client.connect();
    console.log("Connected successfully to server");
  }

  main()
    .then(() => {
      let name = req.query.name as string;
      res.status(200).json({ name: name || "moo" });
    })
    .catch(console.error)
    .finally(() => client.close());
}
