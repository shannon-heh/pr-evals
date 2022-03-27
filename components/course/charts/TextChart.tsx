import { Box, Typography } from "@mui/material";
import { EvalsData } from "../../../src/Types";
import Evaluation from "./Evaluation";
import HoverCard from "../HoverCard";
import pluralize from "pluralize";

export default function TextChart(props: {
  data: Object[];
  title: string;
  width: number;
  numResponses: number;
  totalResponses: number;
}) {
  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {props.title}
          <br />
          <i>
            Question type: Text ({props.numResponses}{" "}
            {pluralize("response", props.numResponses)} • 
            {(100 * props.numResponses) / props.totalResponses}% response rate)
          </i>
        </Typography>
        <Box
          sx={{ height: 350, px: 2, overflowX: "auto", overflowY: "scroll" }}
        >
          {(props.data as EvalsData[]).map((evalDoc: EvalsData, i) => (
            <Evaluation key={i} evalDoc={evalDoc} sx={{ mb: 2 }} />
          ))}
        </Box>
      </HoverCard>
    </Box>
  );
}
