import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { evalsData } from "../../pages/api/textual-evaluations";
import HoverCard from "./HoverCard";

export default function Evaluation(props: { evalDoc: evalsData }) {
  return (
    <HoverCard sx={{ my: 4, p: 2.5 }}>
      <Typography textAlign="left">{props.evalDoc.text}</Typography>
    </HoverCard>
  );
}
