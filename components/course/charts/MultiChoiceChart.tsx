import { Box, Typography } from "@mui/material";
import HoverCard from "../HoverCard";

export default function MultiChoiceChart(props: {
  data: Object[];
  title: string;
  width: number;
}) {
  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {props.title}
        </Typography>
      </HoverCard>
    </Box>
  );
}
