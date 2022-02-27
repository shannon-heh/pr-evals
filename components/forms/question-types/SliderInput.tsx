import { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";

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
