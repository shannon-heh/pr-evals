import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import { useEffect } from "react";
import LongTextInput from "../../question-types/LongTextInput";
import { Dispatch, SetStateAction } from "react";

// Render preview of LongText in Add Question Dialog
export default function AddLongText(props: {
  setOptions: Dispatch<SetStateAction<{}>>;
}) {
  useEffect(() => {
    props.setOptions({ set: true });
  }, []);
  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <FormLabel>Preview</FormLabel>
      <LongTextInput />
    </Box>
  );
}
