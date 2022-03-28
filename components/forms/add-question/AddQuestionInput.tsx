import LongTextInput from "../question-types/LongTextInput";
import AddLongText from "./types/AddLongText";
import AddMultiSelect from "./types/AddMultiSelect";
import AddRating from "./types/AddRating";
import AddShortText from "./types/AddShortText";
import AddSingleSelect from "./types/AddSingleSelect";
import AddSlider from "./types/AddSlider";
import { Question } from "../../../src/Types";
import { Dispatch, SetStateAction } from "react";

// This component is nested in AddQuestionDialog.
// Given a question type, show the respective component preview.
export default function AddQuestionInput(props: {
  type: number;
  setOptions: Dispatch<SetStateAction<{}>>;
  options;
}) {
  if (props.type == Question.ShortText) {
    return <AddShortText setOptions={props.setOptions} />;
  } else if (props.type == Question.LongText) {
    return <AddLongText setOptions={props.setOptions} />;
  } else if (props.type == Question.SingleSelect) {
    return (
      <AddSingleSelect
        setOptions={props.setOptions}
        options={props.options.options}
      />
    );
  } else if (props.type == Question.MultiSelect) {
    return <AddMultiSelect setOptions={props.setOptions} />;
  } else if (props.type == Question.Slider) {
    return <AddSlider setOptions={props.setOptions} />;
  } else if (props.type == Question.Rating) {
    return <AddRating setOptions={props.setOptions} />;
  }
  return null;
}
