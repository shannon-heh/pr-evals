import { Box, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import { EvalsData } from "../../../src/Types";
import HoverCard from "../HoverCard";
import Sentiment from "sentiment";
import removePunctuation from "remove-punctuation";
import stopwords from "stopwords-iso";
import sw from "stopword";
import {
  amber,
  blue,
  deepOrange,
  green,
  grey,
  lime,
  red,
} from "@mui/material/colors";

export default function Evaluation(props: {
  evalDoc: EvalsData;
  sx?: SxProps<Theme>;
}) {
  return (
    <HoverCard sx={{ mt: 2, mb: 4, p: 2.5, ...props.sx }}>
      <EvaluationBadges evalDoc={props.evalDoc} />
      <Typography textAlign="left">{props.evalDoc.text}</Typography>
    </HoverCard>
  );
}

const sentiment = new Sentiment();

function EvaluationBadges(props: { evalDoc: EvalsData }) {
  const difficultyColorMap = {
    5: red[300],
    4: deepOrange[300],
    3: amber[500],
    2: lime[600],
    1: green[400],
    0: grey[400],
  };

  const difficultyDescriptionMap = {
    5: "Very Difficult",
    4: "Difficult",
    3: "Average",
    2: "Easy",
    1: "Very Easy",
    0: "No response (author has not yet submitted the standardized evaluations form)",
  };

  const badgeStyles = {
    background: blue[400],
    p: 0.6,
    m: 0.5,
    borderRadius: 2,
    fontWeight: "medium",
    color: "white",
  };

  const sentimentColorMap = (val: number) => {
    if (val < -3) return difficultyColorMap[5];
    if (val < -1) return difficultyColorMap[4];
    if (val < 1) return difficultyColorMap[3];
    if (val < 3) return difficultyColorMap[2];
    else return difficultyColorMap[1];
  };

  const prepText = (evalText: string) => {
    const rawLowercaseText = evalText
      .split(" ")
      .map((word) => word.toLowerCase());
    const noPunctuationText: string[] = rawLowercaseText.map((word) =>
      removePunctuation(word)
    );
    const noStopwordsText: string[] = sw.removeStopwords(
      noPunctuationText,
      stopwords.en
    );
    return noStopwordsText.join(" ");
  };

  return (
    <Box sx={{ mb: 1.5 }}>
      {props.evalDoc.major != "" ? (
        <Tooltip
          title={
            props.evalDoc.major
              ? "Concentration"
              : "No concentration (author has not yet set their concentration on the profile page)"
          }
          placement="top"
          arrow
        >
          <Typography display="inline" sx={badgeStyles}>
            {props.evalDoc.major ? props.evalDoc.major : "N/A"}
          </Typography>
        </Tooltip>
      ) : null}
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
          Difficulty:{" "}
          {props.evalDoc.difficulty == 0 ? "N/A" : props.evalDoc.difficulty}
        </Typography>
      </Tooltip>
      <Tooltip
        title="Sentiment from -5 (negative) to +5 (positive)"
        placement="top"
        arrow
      >
        <Typography
          display="inline"
          sx={{
            ...badgeStyles,
            background: sentimentColorMap(
              sentiment
                .analyze(prepText(props.evalDoc.text))
                ["comparative"].toFixed(2)
            ),
          }}
        >
          Sentiment:{" "}
          {sentiment
            .analyze(prepText(props.evalDoc.text))
            ["comparative"].toFixed(2)}
        </Typography>
      </Tooltip>
    </Box>
  );
}
