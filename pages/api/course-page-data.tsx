import type { NextApiRequest, NextApiResponse } from "next";

type classData = {
  classID: string;
  classType: string;
};

type Data = {
  courseTitle: string;
  catalogTitle: string;
  courseID: string;
  instructorIDs: string[];
  crosslistingCatalogTitles: string[];
  classes: classData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {}
