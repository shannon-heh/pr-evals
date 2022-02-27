import { NextApiRequest, NextApiResponse } from "next";
import { ChartData } from "../../src/Types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChartData[]>
) {
  const courseid = req.query.courseid as string;

  const dummyData: ChartData[] = [
    { question: "Test Question", type: "SINGLE_SEL", data: [{}] },
  ];
}
