import { NextApiRequest, NextApiResponse } from "next";
import { ChartData } from "../../src/Types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChartData[]>
) {
  const courseid = req.query.courseid as string;

  const dummyData: ChartData[] = [
    {
      question: "How difficult was this course overall?",
      type: "SINGLE_SEL",
      data: [
        { name: "Very Challenging", value: 12 },
        { name: "Challenging", value: 3 },
        { name: "Somewhat Challenging", value: 9 },
        { name: "Not Challenging", value: 1 },
      ],
    },
  ];

  res.status(200).json(dummyData);
}
