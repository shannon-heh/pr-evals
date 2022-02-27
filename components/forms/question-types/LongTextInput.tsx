import TextField from "@mui/material/TextField";

// Generic Long Text input
export default function LongTextInput(props) {
  return (
    <TextField
      margin="dense"
      type="text"
      multiline
      rows={3}
      fullWidth
      variant="filled"
    />
  );
}
