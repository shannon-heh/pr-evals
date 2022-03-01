import Rating from "@mui/material/Rating";
import { RatingProps } from "../../../src/Types";

// Generic Rating input
export default function RatingInput(props: RatingProps) {
  return (
    <Rating
      name="simple-controlled"
      max={props.max}
      precision={props.precision}
      size="large"
    />
  );
}
