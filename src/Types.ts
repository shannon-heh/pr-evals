// If type refers to data retrieved from DB,
// do not use camel case field names to match MongoDB syntax
export type ClassData = {
  class_id: string;
  class_type?: string;
  weekly_meetings_count?: number;
};

export type InstructorData = {
  instructor_id: string;
  instructor_name: string;
};

export type CourseData = {
  course_id: string;
  course_title: string;
  catalog_title: string;
  instructors?: InstructorData[];
  crosslisting_catalog_titles?: string[];
  classes?: ClassData[];
};

export type UserDataDB = {
  netid: string;
  instructor_courses?: string[] | null;
  major_code: string | null;
  student_courses: string[] | null;
  class_year: string | null;
  instructorid: string | null;
  person_type: string;
  name: string;
};

export type StudentDataDB = {
  netid: string;
  class_year: string | null;
  person_type: string;
  major_code: string | null;
  name: string;
};

export type AdminData = {
  major: string[];
};
