import type { NextApiRequest, NextApiResponse } from "next";
import { ReqLib } from "../../src/reqLib";
import { getDB } from "../../src/mongodb";
import { getNetID } from "../../src/Helpers";

const BASE_URL = "https://api.princeton.edu:443/student-app/1.0.0";
const COURSE_COURSES = "/courses/courses";
const CURR_TERM = "1224";

// API endpoint to update department list & add basic course data to DB.
// Calls /courses/courses endpoint on MobileApp API.
// Usage: /api/populate-courses
// Only call-able by sheh or ntyp
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const netid = getNetID();
  if (!netid || (netid != "sheh" && netid != "ntyp"))
    return res.status(401).end();

  const reqLib = new ReqLib();

  // update departments in DB
  const deptList: string[] = await getDepartments(reqLib);
  await updateDepartments(deptList);

  // update courses in DB
  const allCourses = await getAllCourses(reqLib, deptList);
  const dbCourses = (await getDB()).collection("courses");
  await dbCourses.deleteMany({});
  return await dbCourses.insertMany(allCourses).then(() => {
    res.status(200).json({ message: "populated DB with course data!" });
  });
}

// Returns array of objects, where each object is one course's data.
async function getAllCourses(
  reqLib: ReqLib,
  deptList: string[]
): Promise<Object[]> {
  const deptString: string = deptList.join(",");
  let resCourses: Object[] = [];
  return reqLib
    .getJSON(BASE_URL, COURSE_COURSES, {
      term: CURR_TERM,
      subject: deptString,
      fmt: "json",
    })
    .then((data) => {
      const allCourses = data["term"][0]["subjects"];
      allCourses.forEach((subject: Object) => {
        const deptCode = subject["code"];
        const rawCourses = subject["courses"];
        const newCourses = rawCourses.map((data: Object) => {
          const course: Object = {};
          course["code"] = deptCode;
          course["guid"] = data["guid"];
          course["course_id"] = data["course_id"];
          course["title"] = data["title"];
          course["catalog_number"] = data["catalog_number"];
          course["catalog_title"] = deptCode + data["catalog_number"];
          course["instructors"] = data["instructors"].map((instr: Object) => {
            return {
              instructorid: instr["emplid"],
              instructor_name: instr["full_name"],
            };
          });
          course["crosslistings"] = data["crosslistings"].map(
            (class_: Object) => {
              class_["catalog_title"] =
                class_["subject"] + class_["catalog_number"];
              return class_;
            }
          );
          course["classes"] = data["classes"].map((class_: Object) => {
            return {
              class_number: class_["class_number"],
              section: class_["section"],
              type_name: class_["type_name"],
              weekly_meetings: class_["schedule"]["meetings"][0]["days"].length,
              enrollment: class_["enrollment"],
            };
          });
          return course;
        });
        resCourses = resCourses.concat(newCourses);
      });
      return resCourses;
    });
}

// Returns list of all department codes from Mobileapp
async function getDepartments(reqLib: ReqLib): Promise<string[]> {
  return await reqLib
    .getJSON(BASE_URL, COURSE_COURSES, {
      term: CURR_TERM,
      subject: "list",
      fmt: "json",
    })
    .then((data) => {
      const deptList: string[] = data["term"][0]["subjects"].map(
        (subject: Object) => {
          return subject["code"];
        }
      );
      return deptList;
    });
}

// Hard-code list of majors into DB, given list of depts
async function updateDepartments(deptList: string[]) {
  const dbAdmin = (await getDB()).collection("admin");
  await dbAdmin.insertOne({ majors: deptList });
}
