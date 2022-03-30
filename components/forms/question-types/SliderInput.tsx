import Slider from "@mui/material/Slider";
import { SliderProps } from "../../../src/Types";

// Generic Slider input
export default function SliderInput(
  props: SliderProps & { name?: string; formik?: any; lgSlider?: boolean }
) {
  const { name, formik, min, max, step, marks, lgSlider } = props;
  const value: number = name ? formik?.values[name] ?? min : undefined;

  return (
    <Slider
      sx={{ width: lgSlider ? "90%" : "80%", margin: "auto" }}
      size="medium"
      min={min}
      max={max}
      step={step}
      marks={marks}
      name={name}
      value={value}
      onChange={formik?.handleChange}
      valueLabelDisplay="auto"
    />
  );
}
