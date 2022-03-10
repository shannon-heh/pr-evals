import TextField from "@mui/material/TextField";

// Generic Short-Text input
export default function ShortTextInput(props: { name?: string; formik?: any }) {
  const { name, formik } = props;
  const value: any = name ? formik?.values[name] ?? "" : undefined;

  return (
    <TextField
      margin="dense"
      type="text"
      fullWidth
      variant="filled"
      autoComplete="off"
      name={name}
      value={value}
      onChange={formik?.handleChange}
    />
  );
}
