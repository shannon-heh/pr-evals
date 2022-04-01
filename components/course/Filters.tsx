import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  ThemeProvider,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { fetcher, prEvalsTheme } from "../../src/Helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import gradeMap from "../../src/Types";

export default function Filters(props: {
  setConcentrationFilter: Function;
  concentrationFilter: string;
  setYearFilter: Function;
  yearFilter: string;
  disabled: boolean;
}) {
  const { data: dataMajors, error: errorMajors } = useSWR(
    "/api/get-majors",
    fetcher
  );
  const { data: dataYears, error: errorYears } = useSWR(
    "/api/get-class-years",
    fetcher
  );

  const handleConcentrationChange = (event: SelectChangeEvent) => {
    props.setConcentrationFilter(event.target.value as string);
  };
  const handleYearChange = (event: SelectChangeEvent) => {
    props.setYearFilter(event.target.value as string);
  };
  const handleFilterReset = () => {
    props.setYearFilter("");
    props.setConcentrationFilter("");
  };

  if (errorMajors || errorYears)
    return (
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        mt={2}
        color={red[500]}
      >
        Filters failed to load!
      </Typography>
    );

  if (!dataMajors || !dataYears)
    return (
      <Typography variant="subtitle1" fontWeight="medium" mt={2}>
        Loading filters...
      </Typography>
    );

  return (
    <ThemeProvider theme={prEvalsTheme}>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Select Concentration</InputLabel>
          <Select
            color="secondary"
            value={props.concentrationFilter}
            label="Select Concentration"
            onChange={handleConcentrationChange}
            variant={props.disabled ? "filled" : "outlined"}
            disabled={props.disabled}
          >
            {dataMajors?.majors.map((major: string) => (
              <MenuItem key={major} value={major}>
                {major}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ ml: 2, width: 200 }}>
          <InputLabel>Select Year</InputLabel>
          <Select
            color="secondary"
            value={props.yearFilter}
            label="Select Year"
            onChange={handleYearChange}
            variant={props.disabled ? "filled" : "outlined"}
            disabled={props.disabled}
          >
            {dataYears?.map((year: string) => (
              <MenuItem key={year} value={year}>
                {gradeMap[year]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ ml: 2, width: 100 }}>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            size="large"
            color="error"
            onClick={() => {
              handleFilterReset();
            }}
          >
            Reset
          </Button>
        </FormControl>
      </Box>
    </ThemeProvider>
  );
}
