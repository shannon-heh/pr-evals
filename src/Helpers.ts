// fetcher for useSWR calls
export const fetcher = (url: string) => fetch(url).then((r) => r.json());

// get course title with crosslistings
export function getFullTitle(catalogTitle: string, crosslistingCatalogTitles: string[]): string {
  const titles = [catalogTitle, ...crosslistingCatalogTitles];
  return titles.join(" / ");
}

// validate that netid is an instructor, and courseid is one of their courses
export async function validateInstructor(db, netid: string, courseid: string) {
  const { instructor_courses, person_type } = await db
    .collection("users")
    .findOne({ netid: netid }, { instructor_courses: 1, person_type: 1 });
  if (person_type !== "instructor") {
    return false;
  }
  if (!instructor_courses.includes(courseid)) {
    return false;
  }
  return true;
}

// validate that netid is a student, and courseid is one of their courses
export async function validateStudent(db, netid: string, courseid: string) {
  const { student_courses, person_type } = await db
    .collection("users")
    .findOne({ netid: netid }, { student_courses: 1, person_type: 1 });
  if (person_type == "instructor") {
    return false;
  }
  if (!student_courses.includes(courseid)) {
    return false;
  }
  return true;
}

// validate that netid is a student
export async function isStudent(db, netid: string) {
  const { person_type } = await db
  .collection("users").findOne(
    { netid: netid },
    { _id: 0, person_type: 1 }
  );
  return person_type !== "instructor"
}

