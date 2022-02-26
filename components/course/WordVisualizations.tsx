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

  const generateWordCounts = (evalsData: EvalsData[]): Object => {
    let wordCounts = {};
    evalsData.forEach((evalsDoc: EvalsData) => {
      let rawLowercaseText = evalsDoc.text
        .split(" ")
        .map((word) => word.toLowerCase());
      const noPunctuationText: string[] = rawLowercaseText.map((word) =>
        removePunctuation(word)
      );
      const noStopwordsText: string[] = sw.removeStopwords(
        noPunctuationText,
        stopwords.en
      );
      noStopwordsText.forEach((word: string) => {
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
      <Tooltip title="Word Cloud" placement="top" arrow>
        <Box sx={{ m: 0, p: 0 }}>
          <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
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
