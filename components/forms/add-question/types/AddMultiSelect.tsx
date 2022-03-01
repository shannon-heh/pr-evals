import { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import MultiSelectInput from "../../question-types/MultiSelectInput";
import * as yup from "yup";
import { Dispatch, SetStateAction } from "react";

// Allow customization & render preview of MultiSelect in Add Question Dialog
export default function AddMultiSelect(props: {
  setOptions: Dispatch<SetStateAction<{}>>;
}) {
  // customization options
  const [options, setOptions] = useState([]);

  // input validation
  const validationSchema = yup.object({
    option: yup
      .string()
      .trim()
      .min(1, "Enter a non-whitespace character")
      .max(500, "Max 500 characters"),
  });

  const formik = useFormik({
    initialValues: {
      option: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const newOptions: string[] = [...options, values.option];
      props.setOptions({ options: newOptions });
      setOptions(newOptions);
    },
  });
  return (
    <>
      <Grid container item flexDirection="column">
        <Divider sx={{ my: 2 }} />
        <FormLabel>Customize</FormLabel>
        <Typography variant="caption" color="gray">
          Set Options below to enable Done button.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="multi-select-option"
          name="option"
          label="Option"
          value={formik.values.option}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
          required
          helperText={
            formik.touched.option && formik.errors.option
              ? formik.errors.option
              : null
          }
          FormHelperTextProps={{
            style: { color: "red" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                  type="submit"
                >
                  Add Option
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid container item flexDirection="column">
        <Divider sx={{ my: 2 }} />
        <FormLabel>Preview</FormLabel>
        {options.length == 0 ? (
          <Typography>Add options above to see Preview.</Typography>
        ) : null}
        <MultiSelectInput options={options} rowOrder={true} />
      </Grid>
    </>
  );
}
