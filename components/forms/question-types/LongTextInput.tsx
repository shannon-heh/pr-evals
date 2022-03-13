import TextField from "@mui/material/TextField";

// Generic Long Text input
export default function LongTextInput(props: { name?: string; formik?: any }) {
  const { name, formik } = props;
  const value: string = name ? formik?.values[name] ?? "" : undefined;
  return (
    <TextField
      margin="dense"
      type="text"
      multiline
      rows={3}
      fullWidth
      variant="filled"
      autoComplete="off"
      name={name}
      value={value}
      onChange={formik?.handleChange}
    />
  );
}
