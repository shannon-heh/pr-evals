import { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import RatingInput from "../../question-types/RatingInput";

// Allow customization & render Rating in Add Question Dialog
export default function AddRating(props) {
  // customization options
  const [max, setMax] = useState(5);
  const [precision, setPrecision] = useState(0.5);

  const formik = useFormik({
    initialValues: {
      max: 5,
      precision: 0.5,
    },
    onSubmit: (values) => {
      // TO-DO: need field validation
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
          required
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
          required
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
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
