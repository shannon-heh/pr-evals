import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import { ChartData, FormMetadata, ResponseData } from "../../src/Types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const formid = req.query.formid as string;
  const dbForms = (await getDB()).collection("forms") as Collection;

  const data = await dbForms
    .find({ form_id: formid })
    .project({
      title: 1,
      description: 1,
      time_published: 1,
      num_responses: 1,
      _id: 0,
    })
    .toArray();

  return res.status(200).json({ responses: [], meta: data[0] as FormMetadata });

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
    {
      question: "Please give feedback on the first coding assignment.",
      type: "TEXT",
      data: [
        {
          text: "I kinda loved it!",
          major: "ENG",
          year: "Junior",
          difficulty: 3,
        },
        {
          text: "Was a bit difficult but I got through it",
          major: "POL",
          year: "Senior",
          difficulty: 3,
        },
        {
          text: "I thought that the assignment was too hard and the instructors suck.",
          major: "COS",
          year: "Sophomore",
          difficulty: 4,
        },
        {
          text: "Took me only an hour, very easy...",
          major: "ECO",
          year: "Junior",
          difficulty: 1,
        },
      ],
    },
  ];
}