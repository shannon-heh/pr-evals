import TextField from "@mui/material/TextField";

// Generic Short-Text input
export default function ShortTextInput(props: { name?: string; formik?: any }) {
  const { name, formik } = props;
  // if no name provided, then we don't need to keep track of this field's value
  // --> set value to undefined
  // if formik value is undefined for any reason, then set value to empty
  const value: string = name ? formik?.values[name] ?? "" : undefined;

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
