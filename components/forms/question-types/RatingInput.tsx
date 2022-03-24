import Rating from "@mui/material/Rating";
import { RatingProps } from "../../../src/Types";

// Generic Rating input
export default function RatingInput(
  props: RatingProps & { name?: string; formik?: any }
) {
  const { name, formik, max, precision } = props;
  const value: number = name ? Number(formik?.values[name]) ?? 0 : undefined;
  return (
    <>
      <Rating
        max={max}
        precision={precision}
        size="large"
        name={name}
        onChange={(e, value) => {
          // manually set rating value
          if (formik && name && value != undefined) {
            formik.setFieldValue(name, Number(value));
          }
        }}
        value={value}
      />
    </>
  );
}
