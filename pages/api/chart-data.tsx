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
    {
      question: "What aspects of this course did you dislike?",
      type: "MULTI_SEL",
      data: [
        { name: "Precepts", value: 12 },
        { name: "Assignments", value: 3 },
        { name: "Exams", value: 9 },
        { name: "Office hours", value: 1 },
        { name: "Labs", value: 17 },
      ],
    },
    {
      question: "How many hours per week did you spend on assignments?",
      type: "SLIDER",
      data: [
        { name: "0", value: 1 },
        { name: "1", value: 5 },
        { name: "2", value: 10 },
        { name: "3", value: 12 },
        { name: "4", value: 9 },
        { name: "5", value: 3 },
      ],
    },
    {
      question: "How would you rate this course?",
      type: "RATING",
      precision: 0.1,
      data: [
        { name: "0", value: 1 },
        { name: "1", value: 5 },
        { name: "2", value: 10 },
        { name: "3", value: 12 },
        { name: "4", value: 20 },
        { name: "5", value: 19 },
      ],
    },
  ];

  res.status(200).json(dummyData);
}
