import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import useSWR from "swr";
import { fetcher } from "../../src/Helpers";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Filters(props: {
  setConcentrationFilter: Function;
  concentrationFilter: string;
  setYearFilter: Function;
  yearFilter: string;
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

  return (
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
          value={props.concentrationFilter}
          label="Select Concentration"
          onChange={handleConcentrationChange}
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
          value={props.yearFilter}
          label="Select Year"
          onChange={handleYearChange}
        >
          {dataYears?.map((year: string) => (
            <MenuItem key={year} value={year}>
              {year}
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
  );
}
