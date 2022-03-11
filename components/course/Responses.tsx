import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../src/Helpers";

function FormSelector(props: { data?: Object[] }) {
  const [id, setId] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setId(event.target.value as string);
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
      <FormControl sx={{ width: 300 }}>
        <InputLabel>Select Form</InputLabel>
        <Select value={id} label="Select Form" onChange={handleChange}>
          {props.data?.map((form, i) => (
            <MenuItem key={i} value={form["form_id"]}>
              {form["title"]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default function Responses() {
  const { data, error } = useSWR("/api/forms-list", fetcher);

  if (error) return <Box sx={{ mt: 2 }}>Failed to load forms!</Box>;

  return (
    <>
      {data ? (
        <FormSelector data={data} />
      ) : (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton>
            <FormSelector />
          </Skeleton>
        </Box>
      )}
    </>
  );
}
