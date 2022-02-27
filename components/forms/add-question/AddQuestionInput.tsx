import LongTextInput from "../question-types/LongTextInput";
import AddLongText from "./types/AddLongText";
import AddMultiSelect from "./types/AddMultiSelect";
import AddRating from "./types/AddRating";
import AddShortText from "./types/AddShortText";
import AddSingleSelect from "./types/AddSingleSelect";
import AddSlider from "./types/AddSlider";

// This component is nested in AddQuestionDialog.
// Given a question type, show the respective component preview.
export default function AddQuestionInput(props: { type: string; setOptions }) {
  if (props.type == "SHORT_TEXT") {
    return <AddShortText setOptions={props.setOptions} />;
  } else if (props.type == "LONG_TEXT") {
    return <AddLongText setOptions={props.setOptions} />;
  } else if (props.type == "SINGLE_SEL") {
    return <AddSingleSelect setOptions={props.setOptions} />;
  } else if (props.type == "MULTI_SEL") {
    return <AddMultiSelect setOptions={props.setOptions} />;
  } else if (props.type == "SLIDER") {
    return <AddSlider setOptions={props.setOptions} />;
  } else if (props.type == "RATING") {
    return <AddRating setOptions={props.setOptions} />;
  }
  return null;
}
