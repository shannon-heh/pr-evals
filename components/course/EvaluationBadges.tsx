import Box from "@mui/material/Box";
import { blue, green, amber, deepOrange, lime } from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { EvalsData } from "../../src/Types";

export default function EvaluationBadges(props: { evalDoc: EvalsData }) {
  const difficultyColorMap = {
    4: deepOrange[300],
    3: amber[500],
    2: lime[600],
    1: green[400],
  };

  const difficultyDescriptionMap = {
    4: "Very Challenging",
    3: "Challenging",
    2: "Somewhat Challenging",
    1: "Not Challenging",
  };

  const badgeStyles = {
    background: blue[400],
    p: 0.6,
    m: 0.5,
    borderRadius: 2,
    fontWeight: "medium",
    color: "white",
  };

  return (
    <Box sx={{ mb: 1.5 }}>
      <Tooltip title="Concentration" placement="top" arrow>
        <Typography display="inline" sx={badgeStyles}>
          {props.evalDoc.major}
        </Typography>
      </Tooltip>
      <Tooltip title="Class" placement="top" arrow>
        <Typography display="inline" sx={badgeStyles}>
          {props.evalDoc.year}
        </Typography>
      </Tooltip>
      <Tooltip
        title={difficultyDescriptionMap[props.evalDoc.difficulty]}
        placement="top"
        arrow
      >
        <Typography
          display="inline"
          sx={{
            ...badgeStyles,
            background: difficultyColorMap[props.evalDoc.difficulty],
          }}
        >
          Difficulty: {props.evalDoc.difficulty}
        </Typography>
      </Tooltip>
    </Box>
  );
}
