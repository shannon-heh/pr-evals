import * as yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import SliderInput from "../../question-types/SliderInput";
import Typography from "@mui/material/Typography";
import { Dispatch, SetStateAction } from "react";
import { SliderProps } from "../../../../src/Types";

// Allow customization & render preview of Slider in Add Question Dialog
export default function AddSlider(props: {
  setOptions: Dispatch<SetStateAction<{}>>;
  options?: SliderProps;
}) {
  // customization options
  const [min, setMin] = useState(props.options.min ?? 0);
  const [max, setMax] = useState(props.options.max ?? 100);
  const [step, setStep] = useState(props.options.step ?? 10);
  const [marks, setMarks] = useState(
    props.options.marks ?? [{ value: 50, label: "neutral" }]
  );

  // initial input validation
  const validationSchema = yup.object({
    min: yup
      .number()
      .typeError("Min must be a number")
      .required("Min is required")
      .min(0, "Min must be at least 0")
      .max(100, "Min can be at most 100"),
    max: yup
      .number()
      .typeError("Max must be a number")
      .required("Max is required")
      .min(0, "Max must be at least 0")
      .max(100, "Max can be at most 100"),
    step: yup
      .number()
      .typeError("Step must be a number")
      .moreThan(0, "Step must be more than 0, and at most Max minus Min"),
    marks: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      min: min,
      max: max,
      step: step,
      marks: marks
        .map((mark) => {
          return `${mark.value},${mark.label}`;
        })
        .join("\r\n"),
    },
    validationSchema,
    onSubmit: (values) => {
      // we know these are numbers based on validation above
      const min = Number(values.min);
      const max = Number(values.max);
      const step = Number(values.step);

      let hasError = false; // true if error is found below

      // validate max > min
      if (max <= min) {
        formik.setFieldError("min", "Max must be greater than Min");
        formik.setFieldError("max", "Max must be greater than Min");
        hasError = true;
      }
      // validate step is <= max - min
      if (step > max - min) {
        formik.setFieldError(
          "step",
          "Step must be more than 0, and at most Max minus Min"
        );
        hasError = true;
      }

      // parse marks entered by instructor
      let countEmpty = 0; // count number of empty lines
      const marks_: string[] = values.marks.split(/\r?\n/);
      const marks: { value: number; label: string }[] = marks_.reduce(
        (result, mark: string) => {
          // skip empty lines
          if (mark.trim() == "") {
            countEmpty += 1;
            return result;
          }

          // validate format is VALUE,LABEL
          const splitMark = mark.split(",");
          if (splitMark.length !== 2) {
            hasError = true;
            formik.setFieldError(
              "marks",
              "Badly formatted mark value. Mark should be VALUE,LABEL, each separated by newlines."
            );
            return result;
          }
          const [value, label] = splitMark;

          // validate value is anumber between min and max, inclusive
          if (
            isNaN(Number(value)) ||
            Number(value) < min ||
            Number(value) > max
          ) {
            hasError = true;
            formik.setFieldError(
              "marks",
              "Invalid mark value. Must be a number between Min and Max."
            );
            return result;
          }

          // if these checks pass, save this mark
          result.push({ value: Number(value), label: label });
          return result;
        },
        []
      );

      // validate either step or marks field is set
      if (step == 0 && countEmpty == marks_.length) {
        hasError = true;
        formik.setFieldError("step", "Either Step or Marks must be set.");
        formik.setFieldError("marks", "Either Step or Marks must be set.");
      }

      // if error occurred, do not set options
      if (hasError) return;

      setMin(min);
      setMax(max);
      setStep(step);
      setMarks(marks);

      props.setOptions({ min: min, max: max, step: step, marks: marks });
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
          id="slider-min"
          name="min"
          label="Min"
          value={formik.values.min}
          onChange={formik.handleChange}
          type="text"
          fullWidth
          variant="filled"
          autoComplete="off"
          helperText={
            formik.touched.min && formik.errors.min ? formik.errors.min : null
          }
          FormHelperTextProps={{
            style: { color: "red" },
          }}
          required
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
          autoComplete="off"
          helperText={
            formik.touched.max && formik.errors.max ? formik.errors.max : null
          }
          FormHelperTextProps={{
            style: { color: "red" },
          }}
          required
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
          autoComplete="off"
          helperText={
            formik.touched.step && formik.errors.step
              ? formik.errors.step
              : null
          }
          FormHelperTextProps={{
            style: { color: "red" },
          }}
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
          autoComplete="off"
          multiline
          helperText={
            formik.touched.marks && formik.errors.marks
              ? formik.errors.marks
              : "Add multiple marks, separated by a new line. Each mark should formatted as: VALUE,LABEL"
          }
          FormHelperTextProps={{
            style: {
              color: formik.touched.marks && formik.errors.marks ? "red" : null,
            },
          }}
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
        <SliderInput
          min={min}
          max={max}
          step={step}
          marks={marks}
          lgSlider={true}
        />
      </Grid>
    </>
  );
}
