import { Typography } from "@mui/material";
import { EvalsData } from "../../src/Types";
import EvaluationBadges from "./EvaluationBadges";
import HoverCard from "./HoverCard";

export default function Evaluation(props: { evalDoc: EvalsData }) {
  return (
    <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
      <EvaluationBadges evalDoc={props.evalDoc} />
      <Typography textAlign="left">{props.evalDoc.text}</Typography>
    </HoverCard>
  );
}
