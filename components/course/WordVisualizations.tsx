import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { TagCloud } from "react-tagcloud";
import removePunctuation from "remove-punctuation";
import sw from "stopword";
import stopwords from "stopwords-iso";
import useWindowDimensions from "../../hooks/windowDimensions";
import DonutChart from "../../src/donut/DonutChart";
import { EvalsData } from "../../src/Types";
import HoverCard from "./HoverCard";
import Sentiment from "sentiment";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { blue } from "@mui/material/colors";
import Typography from "@mui/material/Typography";

const sentiment = new Sentiment();

type Word = {
  key?: string;
  value: string;
  count: number;
  props?: { className?: string; style?: Object };
};

type Item = {
  className?: string;
  isEmpty?: boolean;
  label: string;
  value: number;
};

export default function WordVisualizations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  const { width } = useWindowDimensions();

  const prepText = (evalText: string): string[] => {
    let rawLowercaseText = evalText
      .split(" ")
      .map((word) => word.toLowerCase());
    const noPunctuationText: string[] = rawLowercaseText.map((word) =>
      removePunctuation(word)
    );
    const noStopwordsText: string[] = sw.removeStopwords(
      noPunctuationText,
      stopwords.en
    );
    return noStopwordsText;
  };

  const generateSentiments = (evalsData: EvalsData[]): Array<Object> => {
    const sentiments: Array<number> = [];
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

  const generateWordCounts = (evalsData: EvalsData[]): Object => {
    let wordCounts = {};
    evalsData.forEach((evalDoc: EvalsData) => {
      prepText(evalDoc.text).forEach((word: string) => {
        wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
      });
    });
    return wordCounts;
  };

  const generateTagCloudCounts = (
    evalsData: EvalsData[],
    numWords: number
  ): Word[] => {
    let wordCounts = generateWordCounts(evalsData);
    let res: Word[] = Array();
    for (const [text, value] of Object.entries(wordCounts)) {
      res.push({
        value: text as string,
        count: value as number,
      });
    }
    return res.sort((a: Word, b: Word) => b.count - a.count).slice(0, numWords);
  };

  const generateDonutCounts = (
    evalsData: EvalsData[],
    numWords: number
  ): Item[] => {
    let wordCounts = generateWordCounts(evalsData);
    let res: Item[] = Array();
    for (const [text, value] of Object.entries(wordCounts)) {
      res.push({
        label: text as string,
        value: value as number,
      });
    }
    return res.sort((a: Item, b: Item) => b.value - a.value).slice(0, numWords);
  };

  const wordStyles = {
    margin: "0px 3px",
    verticalAlign: "middle",
    display: "inline-block",
  };

  const wordRenderer = (tag: Word, size: number, color: string) => {
    const { className, style, ...props } = tag.props || {};
    const fontSize = size + "px";
    const key = tag.key || tag.value;
    const tagStyle = { ...wordStyles, color, fontSize, ...style };

    let tagClassName = "tag-cloud-tag";
    if (className) {
      tagClassName += " " + className;
    }

    return (
      <span className={tagClassName} style={tagStyle} key={key} {...props}>
        {tag.value}
      </span>
    );
  };

  const donutChartWidth = (width: number) => {
    if (width >= 900) return 500;
    if (width >= 600) return 370;
    return 280;
  };

  const donutChartHeight = (width: number) => {
    if (width >= 900) return 370;
    return donutChartWidth(width);
  };

  if (props.isLoading)
    return <Skeleton variant="rectangular" animation="wave" height="193px" />;

  return (
    <>
      <Tooltip title="Sentiment Histogram" placement="top" arrow>
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
                <ChartTooltip />
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
      </Tooltip>
      <Tooltip title="Word Cloud" placement="top" arrow>
        <Box sx={{ m: 0, p: 0 }}>
          <HoverCard sx={{ mb: 4, p: 2.5 }}>
            <TagCloud
              tags={generateTagCloudCounts(props.evalsData, 30)}
              minSize={20}
              maxSize={width >= 800 ? 70 : 40}
              colorOptions={{
                luminosity: "bright",
                hue: "random",
                format: "hsla",
                alpha: 0.8,
              }}
              style={{
                fontWeight: "bold",
              }}
              renderer={wordRenderer}
              randomSeed={42}
            />
          </HoverCard>
        </Box>
      </Tooltip>
      <Tooltip title="Donut Chart" placement="top" arrow>
        <Box sx={{ m: 0, p: 0 }}>
          <HoverCard sx={{ p: 2.5 }}>
            <DonutChart
              data={generateDonutCounts(props.evalsData, 15)}
              width={donutChartWidth(width)}
              height={donutChartHeight(width)}
              formatValues={(values, total) =>
                `${((values / total) * 100).toFixed(1)}%`
              }
              legend={width >= 900}
            />
          </HoverCard>
        </Box>
      </Tooltip>
    </>
  );
}
