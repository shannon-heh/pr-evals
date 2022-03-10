import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { SelectProps } from "../../../src/Types";

// Generic Single-Select input
export default function SingleSelectInput(
  props: SelectProps & {
    rowOrder?: boolean;
    name?: string;
    formik?: any;
  }
) {
  const { name, formik, rowOrder } = props;
  const value: any = name ? formik?.values[name] ?? "" : undefined;
  return (
    <RadioGroup
      row={rowOrder ?? false}
      name={name}
      value={value}
      onChange={formik?.handleChange}
    >
      {props.options.map((option: string, i: number) => {
        return (
          <FormControlLabel
            key={i}
            value={option}
            control={<Radio />}
            label={option}
            sx={{ overflowWrap: "anywhere" }}
          />
        );
      })}
    </RadioGroup>
  );
}
