import { NextApiRequest, NextApiResponse } from "next";

export type evalsData = { text: string };

// retrieves textual evaluation data for a course page
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<evalsData[]>
) {
  const courseid = req.query.courseid as string;
  const dummyData = [
    {
      text: "Solid course, lots of independent learning though. The hardest parts of the course are the written exam, so if you do well on those the rest of the course should be pretty easy. All around great introduction to Java",
    },
    {
      text: "I advise students who take this course to attend the extra help sessions and actively watch the lectures. They greatly help in figuring out and completing the weekly assignments and give great insight into material covered on the exams.",
    },
    {
      text: "Definitely take it if you have any interest in tech/comp sci/anything like that. I did this as a humanities student and found it very fun. Everything is pretty easy other than written exams (study for those)",
    },
    {
      text: "it's work but manageable, don't procrastinate on stuff, find other people to work with",
    },
    {
      text: "Please keep up with the work. Read/watch the lectures; find what works for you. The practice exams are useful resources for not only understanding the concepts but also for preparing for the exams. Make sure to give yourself time to try them.",
    },
    {
      text: "I think that keeping up with lectures and staying on top of the material is important. It is also very helpful to go to office hours and lab TAs for help when needed on the assignments.",
    },
    {
      text: "This course features online lectures, so you must be comfortable with that to take this course.",
    },
  ];
  res.status(200).json(dummyData);
}
