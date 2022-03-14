import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
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
      <FormControl sx={{ width: 330 }}>
        <InputLabel>Select Form</InputLabel>
        {props.data && props.data.length > 0 ? (
          <Select value={id} label="Select Form" onChange={handleChange}>
            {props.data?.map((form, i) => (
              <MenuItem key={i} value={form["form_id"]}>
                {form["title"]}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <>
            <Select
              label="Select Form Disabled"
              variant="filled"
              disabled
            ></Select>
            <Typography variant="subtitle1" fontWeight="medium" mt={2}>
              This course doesn't have any published forms (yet)!
            </Typography>
          </>
        )}
      </FormControl>
    </Box>
  );
}

export default function Responses(props: { courseID: string }) {
  const { data, error } = useSWR(
    `/api/forms-list?courseid=${props.courseID}`,
    fetcher
  );

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
