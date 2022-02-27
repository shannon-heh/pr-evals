import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import ShortTextInput from "../../question-types/ShortTextInput";
import { useEffect } from "react";

// Render preview of ShortText in Add Question Dialog
export default function AddShortText(props) {
  useEffect(() => {
    props.setOptions({ set: true });
  }, []);
  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <FormLabel>Preview</FormLabel>
      <ShortTextInput />
    </Box>
  );
}
