import { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import RatingInput from "../../question-types/RatingInput";
import * as yup from "yup";
import Typography from "@mui/material/Typography";
import { Dispatch, SetStateAction } from "react";

// Allow customization & render Rating in Add Question Dialog
export default function AddRating(props: {
  setOptions: Dispatch<SetStateAction<{}>>;
}) {
  // customization options
  const [max, setMax] = useState(5);
  const [precision, setPrecision] = useState(0.5);

  // input validation
  const validationSchema = yup.object({
    max: yup
      .number()
      .typeError("Max must be an integer")
      .required("Max is required")
      .integer("Max must be an integer")
      .min(1, "Max must be at least 1 star")
      .max(10, "Max can be at most 10 stars"),
    precision: yup
      .number()
      .typeError("Precision must be a number")
      .required("Precision is required")
      .oneOf([0.25, 0.5, 1], "Precision must be 0.25, 0.5, or 1"),
  });

  const formik = useFormik({
    initialValues: {
      max: 5,
      precision: 0.5,
    },
    validationSchema,
    onSubmit: (values) => {
      const max = Number(values.max);
      const precision = Number(values.precision);

      setMax(max);
      setPrecision(precision);
      props.setOptions({ max: max, precision: precision });
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
          id="rating-max"
          name="max"
          label="Max Rating"
          value={formik.values.max}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
          autoComplete="off"
          required
          helperText={
            formik.touched.max && formik.errors.max ? formik.errors.max : null
          }
          FormHelperTextProps={{
            style: { color: "red" },
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="rating-precision"
          name="precision"
          label="Precision"
          value={formik.values.precision}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
          autoComplete="off"
          required
          helperText={
            formik.touched.precision && formik.errors.precision
              ? formik.errors.precision
              : null
          }
          FormHelperTextProps={{
            style: { color: "red" },
          }}
        />
        <Button
          onClick={(e) => {
            formik.handleSubmit();
          }}
          type="submit"
          variant="contained"
          sx={{ mt: 1 }}
        >
          Set Options
        </Button>
      </Grid>
      <Grid container item flexDirection="column">
        <Divider sx={{ my: 2 }} />
        <FormLabel>Preview</FormLabel>
        <RatingInput max={max} precision={precision} />
      </Grid>
    </>
  );
}
