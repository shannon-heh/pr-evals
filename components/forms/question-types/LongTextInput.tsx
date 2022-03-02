import TextField from "@mui/material/TextField";

// Generic Long Text input
export default function LongTextInput() {
  return (
    <TextField
      margin="dense"
      type="text"
      multiline
      rows={3}
      fullWidth
      variant="filled"
      autoComplete="off"
    />
  );
}
