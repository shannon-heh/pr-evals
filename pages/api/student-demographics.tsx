import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getNetID } from "../../src/Helpers";
import { getDB } from "../../src/mongodb";
import { ResponseData } from "../../src/Types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!getNetID()) return res.end();
  const courseid = req.query.courseid as string;
  if (!courseid) return res.end();

  const dbForms = (await getDB()).collection("forms") as Collection;
  const dbResponses = (await getDB()).collection("responses") as Collection;
  const dbUsers = (await getDB()).collection("users") as Collection;

  let _: Object = await dbForms.findOne({
    course_id: courseid,
    form_id: /-std$/,
  });
  if (!_) return res.end();
  const formid = _["form_id"];

  const responsesRes: Object[] = await dbResponses
    .find({ form_id: formid })
    .project({ netid: 1 })
    .toArray();
  const netids: string[] = responsesRes.map((response) => {
    return response["netid"];
  });
  const uniqueNetids = netids.filter((netid, i) => {
    return netids.indexOf(netid) == i;
  });

  const usersRes: Object[] = await dbUsers
    .find({ netid: { $in: uniqueNetids } })
    .project({ major_code: 1 })
    .toArray();
  const majors = usersRes.map((user) => {
    return user["major_code"];
  });
  const majorCounts = {};
  majors.forEach((major) => {
    if (!major) return;
    majorCounts[major] = majorCounts[major] ? majorCounts[major]++ : 1;
  });

  console.log(majorCounts);

  /*
    TODO: class year counts
    return all data in correct format for a bar chart (?)
  */

  return res.status(200).json(formid);
}
