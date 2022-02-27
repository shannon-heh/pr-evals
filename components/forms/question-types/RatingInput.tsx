import Rating from "@mui/material/Rating";

// Generic Rating input
export default function RatingInput(props) {
  return (
    <Rating
      name="simple-controlled"
      max={props.max}
      precision={props.precision}
      size="large"
    />
  );
}
