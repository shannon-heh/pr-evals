import Slider from "@mui/material/Slider";

// Generic Slider input
export default function SliderInput(props) {
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
