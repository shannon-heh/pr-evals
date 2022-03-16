import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../src/mongodb";
import {
  ChartData,
  FormMetadataResponses,
  ResponseData,
} from "../../src/Types";

const questionTypeMap = {
  0: "TEXT",
  1: "TEXT",
  2: "SINGLE_SEL",
  3: "MULTI_SEL",
  4: "SLIDER",
  5: "RATING",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const formid = req.query.formid as string;
  if (!formid) return res.end();
  const dbForms = (await getDB()).collection("forms") as Collection;
  const dbResponses = (await getDB()).collection("responses") as Collection;

  const form = (await dbForms
    .find({ form_id: formid })
    .project({
      title: 1,
      description: 1,
      time_published: 1,
      num_responses: 1,
      questions: 1,
      _id: 0,
    })
    .toArray()) as Object[];

  const questions = form[0]["questions"] as Object[];

  // prepare the response objects in data (e.g. initialize all counts to 0)
  const data: ChartData[] = questions.map((question) => {
    const res = {
      question: question["question"],
      type: questionTypeMap[question["type"]],
      data: [],
    };

    switch (questionTypeMap[question["type"]]) {
      case "SINGLE_SEL":
        (question["options"] as Array<string>).forEach((choice) =>
          res.data.push({ name: choice, value: 0 })
        );
        break;
      case "MULTI_SEL":
        (question["options"] as Array<string>).forEach((choice) =>
          res.data.push({ name: choice, value: 0 })
        );
        break;
      case "SLIDER":
        if (question["step"] == 0) {
          const marks: Object[] = question["marks"];
          marks.forEach((mark) =>
            res.data.push({ name: mark["value"], value: 0 })
          );
          break;
        }

        for (
          let i = question["min"];
          i <= question["max"];
          i += question["step"]
        )
          res.data.push({ name: i, value: 0 });
        break;
      case "RATING":
        for (let i = 0; i <= question["max"]; i += question["precision"])
          res.data.push({ name: i, value: 0 });
        break;
      // "TEXT" requires no initial setup
    }

    return res;
  });

  const allResponses = (await dbResponses
    .find({ form_id: formid })
    .project({ netid: 1, responses: 1, _id: 0 })
    .toArray()) as Object[];

  // detect if the form has 0 responses
  if (
    allResponses.length == 0 ||
    allResponses.every(
      (response) => (response["responses"] as Object[]).length == 0
    )
  )
    return res
      .status(200)
      .json({ responses: [], meta: form[0] as FormMetadataResponses });

  // load responses into data
  allResponses.forEach((doc_) => {
    const responses = doc_["responses"];
    responses.forEach((response_: Object[], i: number) => {
      const response: string | number | string[] = response_["response"];
      switch (data[i].type) {
        case "SINGLE_SEL":
          data[i].data.forEach((sample, j) => {
            if (sample["name"] === (response as string))
              data[i].data[j]["value"]++;
          });
          break;
        case "MULTI_SEL":
          data[i].data.forEach((sample, j) => {
            (response as string[]).forEach((_response) => {
              if (sample["name"] === _response) data[i].data[j]["value"]++;
            });
          });
          break;
        case "SLIDER":
          data[i].data.forEach((sample, j) => {
            if (sample["name"] === (response as number))
              data[i].data[j]["value"]++;
          });
          break;
        case "RATING":
          data[i].data.forEach((sample, j) => {
            if (sample["name"] === (response as number))
              data[i].data[j]["value"]++;
          });
          break;
        case "TEXT":
          // TODO: @nicholaspad get major and year using netID
          data[i].data.push({
            text: response as string,
            major: "COS",
            year: "Junior",
            difficulty: 2, // TODO: @nicholaspad extract from standardized form
          });
      }
    });
  });

  // for slider charts, replace numbers with labels if applicable
  data.forEach((chart, i) => {
    if (chart.type == "SLIDER") {
      const marks: Object[] = questions[i]["marks"];
      const data_ = chart.data;
      marks.forEach((mark) => {
        const value = mark["value"];
        const label = mark["label"];
        data_.forEach((sample) => {
          if (sample["name"] == value) sample["name"] = `${label}`;
        });
      });
    }
  });

  return res
    .status(200)
    .json({ responses: data, meta: form[0] as FormMetadataResponses });
}
