import Slider from "@mui/material/Slider";
import { SliderProps } from "../../../src/Types";

// Generic Slider input
export default function SliderInput(props: SliderProps) {
  return (
    <Slider
      sx={{ width: "90%", margin: "auto" }}
      size="medium"
      min={props.min}
      max={props.max}
      step={props.step}
      marks={props.marks}
      valueLabelDisplay="auto"
    />
  );
}
