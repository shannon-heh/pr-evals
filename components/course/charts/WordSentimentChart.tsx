import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { EvalsData } from "../../../src/Types";
import HoverCard from "../HoverCard";
import Sentiment from "sentiment";
import { prepText } from "../../../src/Helpers";
import { blue } from "@mui/material/colors";

const sentiment = new Sentiment();

export default function WordSentimentChart(props: { evalsData: EvalsData[] }) {
  const generateSentiments = (evalsData: EvalsData[]): Object[] => {
    const sentiments: number[] = [];
    evalsData.forEach((evalDoc: EvalsData) => {
      sentiments.push(
        sentiment.analyze(prepText(evalDoc.text).join(" "))["comparative"]
      );
    });
    const sentimentBuckets = {
      "-5 to -4": 0,
      "-4 to -3": 0,
      "-3 to -2": 0,
      "-2 to -1": 0,
      "-1 to 0": 0,
      "0 to 1": 0,
      "1 to 2": 0,
      "2 to 3": 0,
      "3 to 4": 0,
      "4 to 5": 0,
    };
    sentiments.forEach((sentiment: number) => {
      if (sentiment <= -4) sentimentBuckets["-5 to -4"]++;
      else if (sentiment <= -3) sentimentBuckets["-4 to -3"]++;
      else if (sentiment <= -2) sentimentBuckets["-3 to -2"]++;
      else if (sentiment <= -1) sentimentBuckets["-2 to -1"]++;
      else if (sentiment <= 0) sentimentBuckets["-1 to 0"]++;
      else if (sentiment <= 1) sentimentBuckets["0 to 1"]++;
      else if (sentiment <= 2) sentimentBuckets["1 to 2"]++;
      else if (sentiment <= 3) sentimentBuckets["2 to 3"]++;
      else if (sentiment <= 4) sentimentBuckets["3 to 4"]++;
      else if (sentiment <= 5) sentimentBuckets["4 to 5"]++;
    });
    const res = [];
    for (const [key, value] of Object.entries(sentimentBuckets)) {
      res.push({ name: key, count: value });
    }
    return res;
  };

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          Sentiment Distribution: -5 (negative) to +5 (positive)
        </Typography>
        <ResponsiveContainer width="99%" aspect={1.78}>
          <BarChart data={generateSentiments(props.evalsData)}>
            <XAxis dataKey="name" tickCount={6} />
            <YAxis dataKey="count" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Tooltip />
            <Bar type="monotone" dataKey="count" fill={blue[400]} />
          </BarChart>
        </ResponsiveContainer>
        <Typography fontStyle="italic">
          Each evaluation's sentiment is computed using the{" "}
          <a
            href="https://www2.imm.dtu.dk/pubdb/pubs/6010-full.html"
            target="_blank"
          >
            AFINN-165
          </a>{" "}
          wordlist.
        </Typography>
      </HoverCard>
    </Box>
  );
}
