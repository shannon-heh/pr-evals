import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../src/Helpers";
import { FormMetadataResponses, ResponseData } from "../../src/Types";
import HoverCard from "./HoverCard";

function FormSelector(props: {
  data?: Object[];
  setId?: Function;
  id?: string;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setId(event.target.value as string);
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
          <Select value={props.id} label="Select Form" onChange={handleChange}>
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
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              mt={2}
              color={red[500]}
            >
              This course doesn't have any published forms (yet)!
            </Typography>
          </>
        )}
      </FormControl>
    </Box>
  );
}

function Charts(props: { id?: string }) {
  function FormMetadata(props: { meta: FormMetadataResponses }) {
    const nonTitleColor = grey[800];

    return (
      <HoverCard sx={{ mt: 2, p: 2.5, background: blue[300] }}>
        <Typography
          variant="h5"
          component="div"
          fontWeight="medium"
          color="white"
        >
          {props.meta.title}
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          fontWeight="medium"
          fontStyle="italic"
          color={nonTitleColor}
        >
          {props.meta.description}
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          fontWeight="medium"
          color={nonTitleColor}
        >
          {props.meta.num_responses} Responses • Published on{" "}
          {props.meta.time_published.toString().split("T")[0]}
        </Typography>
      </HoverCard>
    );
  }

  const { data: data_, error } = useSWR(
    `/api/response-data?formid=${props.id}`,
    fetcher
  );
  const data = data_ as ResponseData;

  if (!props.id) return null;
  if (!data || error)
    return (
      <Grid container sx={{ textAlign: "center", mt: 2 }}>
        <Grid item container lg={6} direction="column">
          <Box sx={{ p: 2 }}>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
            <br />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
          </Box>
        </Grid>
        <Grid item container lg={6} direction="column">
          <Box sx={{ p: 2 }}>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
            <br />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
          </Box>
        </Grid>
      </Grid>
    );

  return (
    <>
      <FormMetadata meta={data.meta} />
    </>
  );
}

export default function Responses(props: { courseID: string }) {
  const { data, error } = useSWR(
    `/api/forms-list?courseid=${props.courseID}`,
    fetcher
  );
  const [id, setId] = useState("");

  if (error) return <Box sx={{ mt: 2 }}>Failed to load forms!</Box>;

  return (
    <>
      {data ? (
        <>
          <FormSelector data={data} setId={setId} id={id} />
          <Charts id={id} />
        </>
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
