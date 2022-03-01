import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { SelectProps } from "../../../src/Types";

// Generic Single-Select input
export default function SingleSelectInput(
  props: SelectProps & { rowOrder?: boolean }
) {
  return (
    <RadioGroup
      defaultValue="female"
      name="radio-buttons-group"
      row={props.rowOrder ?? false}
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
