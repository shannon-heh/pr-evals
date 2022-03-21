import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getNetID } from "../../src/Helpers";
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

const gradeMap = {
  "2022": "Senior",
  "2023": "Junior",
  "2024": "Sophomore",
  "2025": "First-year",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!getNetID()) return res.end();

  let formid = req.query.formid as string;
  const courseid = req.query.courseid as string;
  if (!formid && !courseid) return res.end();

  // if courseid is provided, we assume that the client wants the course's standardized form, so
  // set formid to the course's standardized formid
  const dbForms = (await getDB()).collection("forms") as Collection;

  if (courseid) {
    let _: Object = await dbForms.findOne({
      course_id: courseid,
      form_id: /-std$/,
    });
    if (!_) return res.end();
    formid = _["form_id"];
  }

  const dbResponses = (await getDB()).collection("responses") as Collection;
  const dbUsers = (await getDB()).collection("users") as Collection;

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

  const userDataCache = {};

  // load responses into data
  for (let _ = 0; _ < allResponses.length; _++) {
    const responses = allResponses[_]["responses"];
    for (let i = 0; i < responses.length; i++) {
      const response: string | number | string[] = responses[i]["response"];

      if (response == "" || response == []) continue;

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
          const netID = allResponses[_]["netid"];
          if (!(netID in userDataCache)) {
            let userData = await dbUsers.findOne({
              netid: allResponses[_]["netid"],
            });

            const difficultyQuestionIdx = 2;
            let userStdFormData: Object[] = await dbResponses
              .find({
                form_id: formid.split("-")[0] + "-std",
                netid: netID,
              })
              .toArray();

            userDataCache[netID] = {
              data: userData,
              difficulty:
                userStdFormData.length > 0
                  ? userStdFormData[0]["responses"][difficultyQuestionIdx][
                      "response"
                    ]
                  : 0,
            };

            if (
              userDataCache[netID].difficulty < 1 ||
              userDataCache[netID].difficulty > 5
            )
              userDataCache[netID].difficulty = 0;
          }

          data[i].data.push({
            text: response as string,
            major: userDataCache[netID]["data"]["major_code"],
            year: gradeMap[userDataCache[netID]["data"]["class_year"]],
            difficulty: userDataCache[netID].difficulty,
          });
          break;
      }
    }
  }

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
