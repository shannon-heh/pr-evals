import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// Generic Multi-Select input
export default function MultiSelectInput(props) {
  return (
    <FormControl component="fieldset" variant="standard">
      <FormGroup row={props.rowOrder ?? false}>
        {props.options.map((option: string, i: number) => {
          return (
            <FormControlLabel
              control={<Checkbox name={option} />}
              label={option}
              key={i}
              sx={{ overflowWrap: "anywhere" }}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
}
