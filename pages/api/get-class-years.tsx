import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { getNetID } from "../../src/Helpers";
import { Collection } from "mongodb";

// API endpoint to get list of majors from DB
// Usage: /api/get-majors
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!getNetID()) return res.status(401).end();

  const dbUsers = (await getDB()).collection("users") as Collection;
  return await dbUsers.distinct("class_year").then((data: string[]) => {
    return res.status(200).json(data.filter((item) => item)); // remove nulls
  });
}
