import { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import SingleSelectInput from "../../question-types/SingleSelectInput";

// Allow customization & render preview of SingleSelect in Add Question Dialog
export default function AddSingleSelect(props) {
  // customization options
  const [options, setOptions] = useState([]);

  const formik = useFormik({
    initialValues: {
      option: "",
    },
    onSubmit: (values) => {
      // do not duplicate options
      if (options.includes(values.option)) return;
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
        <TextField
          autoFocus
          margin="dense"
          id="single-select-option"
          name="option"
          label="Option"
          value={formik.values.option}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
          required
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
        <SingleSelectInput options={options} />
      </Grid>
    </>
  );
}
