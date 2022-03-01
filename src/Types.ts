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
  major_code?: string | null;
  student_courses?: string[] | null;
  class_year?: string | null;
  instructorid?: string | null;
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
  majors: string[];
};

export type FormMetadata = {
  form_id: string;
  title: string;
  description: string;
  published: boolean;
  time_created: Date;
  questions: QuestionMetadata[];
  num_responses: number;
  time_published?: Date,
};

// Enum for possible question types
export enum Question {
  ShortText,
  LongText,
  SingleSelect,
  MultiSelect,
  Slider,
  Rating,
}

export type QuestionTypes = keyof typeof Question

type BaseQuestion = {
  question: string,
  description: string,
}

// Text input
export type ShortTextMetadata = BaseQuestion & {
  type: Question.ShortText,
}

export type LongTextMetadata = BaseQuestion & {
  type: Question.LongText,
}

// Rating input
export type RatingProps = {
  max: number,
  precision: number
}

export type RatingMetadata = BaseQuestion & RatingProps & {
  type: Question.Rating,
}

// Slider input
export type SliderProps = {
  min: number,
  max: number,
  step: number,
  marks: {value: number, label: string}[]
}

export type SliderMetadata = BaseQuestion & SliderProps & {
  type: Question.Slider,
}

// Select input
export type SelectProps = {
  options: string[]
}

export type SingleSelectMetadata = BaseQuestion & SelectProps & {
  type: Question.SingleSelect,
}

export type MultiSelectMetadata = BaseQuestion & SelectProps & {
  type: Question.MultiSelect,
}

// Aggregate types
export type QuestionProps = RatingProps | SliderProps | SelectProps;

export type QuestionMetadata = ShortTextMetadata | LongTextMetadata | RatingMetadata | SliderMetadata | SingleSelectMetadata | MultiSelectMetadata;
