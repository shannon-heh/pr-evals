import { Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import HoverCard from "./HoverCard";

export default function Students(props: { courseID?: string }) {
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
