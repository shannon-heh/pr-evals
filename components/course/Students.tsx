import { Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import useSWR from "swr";
import { fetcher } from "../../src/Helpers";
import HoverCard from "./HoverCard";

export default function Students(props: { courseID?: string }) {
  const { data, error } = useSWR(
    `/api/student-demographics?courseid=${props.courseID}`,
    fetcher
  );

  return (
    <>
      <HoverCard sx={{ mt: 2, p: 2.5, background: blue[300] }}>
        <Typography variant="subtitle1" fontWeight="medium" color="white">
          These charts visualize demographics about the students who completed
          this course's standardized evaluations form.
        </Typography>
      </HoverCard>
    </>
  );
}
