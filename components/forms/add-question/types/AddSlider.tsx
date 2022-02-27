import { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import SliderInput from "../../question-types/SliderInput";

// Allow customization & render preview of Slider in Add Question Dialog
export default function AddSlider(props) {
  // customization options
  const [step, setStep] = useState(10);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [marks, setMarks] = useState([{ value: 50, label: "neutral" }]);

  const formik = useFormik({
    initialValues: {
      step: 10,
      min: 0,
      max: 100,
      marks: "50,neutral",
    },
    onSubmit: (values) => {
      // TO-DO: more strict validation on these fields
      const min = Number(values.min);
      const max = Number(values.max);
      const step = Number(values.step);

      setMin(min);
      setMax(max);
      setStep(step);

      // parse marks entered by instructor
      const marks_: string[] = values.marks.split(/\r?\n/);
      const marks = marks_.map((mark: string) => {
        const [value, label] = mark.split(",");
        return { value: Number(value), label: label };
      });
      setMarks(marks);

      props.setOptions({ min: min, max: max, step: step, marks: marks });
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
          id="slider-min"
          name="min"
          label="Min"
          value={formik.values.min}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
        />
        <TextField
          autoFocus
          margin="dense"
          id="slider-max"
          name="max"
          label="Max"
          value={formik.values.max}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
        />
        <TextField
          autoFocus
          margin="dense"
          id="slider-step"
          name="step"
          label="Step"
          value={formik.values.step}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
        />
        <TextField
          autoFocus
          margin="dense"
          id="slider-marks"
          name="marks"
          label="Marks"
          value={formik.values.marks}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
          multiline
          helperText="Add multiple marks, separated by new line. Each mark should look like: VALUE,LABEL."
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
        <SliderInput min={min} max={max} step={step} marks={marks} />
      </Grid>
    </>
  );
}
