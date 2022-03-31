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
  num_students?: number;
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
  sample_questions: Object;
};

export type EvalsData = {
  text: string;
  major?: string;
  year?: string;
  difficulty?: number;
};

export type ChartData = {
  question: string;
  type: "SINGLE_SEL" | "MULTI_SEL" | "SLIDER" | "RATING" | "TEXT";
  data: Object[];
};

export type ChartWord = {
  key?: string;
  value: string;
  count: number;
  props?: { className?: string; style?: Object };
};

export type ChartItem = {
  className?: string;
  isEmpty?: boolean;
  label: string;
  value: number;
};

export type FormMetadataResponses = {
  description?: string;
  num_responses?: number;
  title: string;
  time_published?: Date;
};

export type ResponseData = {
  responses: ChartData[];
  meta?: FormMetadataResponses;
};

// form metadata stored in DB
export type FormMetadata = {
  form_id: string;
  title: string;
  description: string;
  questions: QuestionMetadata[];
  course_id: string;
  time_created?: Date;
  published: boolean;
  time_published?: Date;
  released: boolean;
  time_released?: Date;
  standardized?: boolean;
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

export type QuestionTypes = keyof typeof Question;

type BaseQuestion = {
  question: string;
  description: string;
  q_id?: number;
};

// Text input
export type ShortTextMetadata = BaseQuestion & {
  type: Question.ShortText;
};

export type LongTextMetadata = BaseQuestion & {
  type: Question.LongText;
};

// Rating input
export type RatingProps = {
  max: number;
  precision: number;
};

export type RatingMetadata = BaseQuestion &
  RatingProps & {
    type: Question.Rating;
  };

// Slider input
export type SliderProps = {
  min: number;
  max: number;
  step: number;
  marks: { value: number; label: string }[];
};

export type SliderMetadata = BaseQuestion &
  SliderProps & {
    type: Question.Slider;
  };

// Select input
export type SelectProps = {
  options: string[];
};

export type SingleSelectMetadata = BaseQuestion &
  SelectProps & {
    type: Question.SingleSelect;
  };

export type MultiSelectMetadata = BaseQuestion &
  SelectProps & {
    type: Question.MultiSelect;
  };

// Aggregate types
export type QuestionProps = RatingProps | SliderProps | SelectProps;

export type QuestionMetadata =
  | ShortTextMetadata
  | LongTextMetadata
  | RatingMetadata
  | SliderMetadata
  | SingleSelectMetadata
  | MultiSelectMetadata;

// used to construct forms in Forms tab
export type CourseFormData = {
  title: string;
  form_id: string;
  completed: boolean;
  course_id?: string;
  num_responses: number;
  published: boolean;
  released: boolean;
  time_created: Date;
  time_released?: Date;
  time_published: Date;
  time_submitted?: Date;
  standardized?: boolean;
};

export type FormResponseData = {
  form_id: string;
  netid: string;
  responses: { q_id: number; response: any }[];
  time_submitted: Date;
  course_id: string;
};

const gradeMap = {
  "2022": "Senior",
  "2023": "Junior",
  "2024": "Sophomore",
  "2025": "First-year",
};

export default gradeMap;

// Enum for a form's status
export enum FormStatus {
  Created,
  Published,
  Released,
}
