import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { EvalsData } from "../../src/Types";
import HoverCard from "./HoverCard";

export default function Evaluation(props: { evalDoc: EvalsData }) {
  return (
    <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
      <Typography textAlign="left">{props.evalDoc.text}</Typography>
    </HoverCard>
  );
}
