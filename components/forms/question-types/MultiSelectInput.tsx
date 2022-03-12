import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SelectProps } from "../../../src/Types";

// Generic Multi-Select input
export default function MultiSelectInput(
  props: SelectProps & { rowOrder?: boolean; name?: string; formik?: any }
) {
  const { name, formik, rowOrder } = props;
  return (
    <FormControl component="fieldset" variant="standard">
      <FormGroup row={rowOrder ?? false}>
        {props.options.map((option: string, i: number) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  name={option}
                  onChange={(e) => {
                    if (!formik) return undefined;
                    if (e.target.checked) {
                      formik.setFieldValue(
                        name,
                        formik.values[name].concat([option])
                      );
                    } else {
                      formik.setFieldValue(
                        name,
                        formik.values[name].filter((item) => {
                          return item !== option;
                        })
                      );
                    }
                  }}
                />
              }
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
