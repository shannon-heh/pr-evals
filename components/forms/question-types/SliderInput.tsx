import Slider from "@mui/material/Slider";
import { SliderProps } from "../../../src/Types";

// Generic Slider input
export default function SliderInput(
  props: SliderProps & { name?: string; formik?: any }
) {
  const { name, formik, min, max, step, marks } = props;
  const value: number = name ? formik?.values[name] ?? min : undefined;
  return (
    <Slider
      sx={{ width: "90%", margin: "auto" }}
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
