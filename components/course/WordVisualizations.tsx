import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { TagCloud } from "react-tagcloud";
import removePunctuation from "remove-punctuation";
import sw from "stopword";
import DonutChart from "../../src/donut/DonutChart";
import { EvalsData } from "../../src/Types";
import HoverCard from "./HoverCard";

export default function WordVisualizations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
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

  const generateWordCounts = (evalsData: EvalsData[]): Word[] => {
    let wordCounts = {};
    // const wordCounts: Word[] = Array();
    evalsData.forEach((evalsDoc: EvalsData) => {
      let rawLowercaseText = evalsDoc.text
        .split(" ")
        .map((word) => word.toLowerCase());
      const noPunctuationText: string[] = rawLowercaseText.map((word) =>
        removePunctuation(word)
      );
      const noStopwordsText: string[] = sw.removeStopwords(noPunctuationText);
      noStopwordsText.forEach((word: string) => {
        wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
      });
    });

    let res: Word[] = Array();
    for (const [text, value] of Object.entries(wordCounts)) {
      res.push({
        value: text as string,
        count: value as number,
      });
    }

    return res.sort((a: Word, b: Word) => b.count - a.count).slice(0, 30);
  };

  const generateDonutCounts = (evalsData: EvalsData[]): Item[] => {
    let wordCounts = {};
    // const wordCounts: Word[] = Array();
    evalsData.forEach((evalsDoc: EvalsData) => {
      let rawLowercaseText = evalsDoc.text
        .split(" ")
        .map((word) => word.toLowerCase());
      const noPunctuationText: string[] = rawLowercaseText.map((word) =>
        removePunctuation(word)
      );
      const noStopwordsText: string[] = sw.removeStopwords(noPunctuationText);
      noStopwordsText.forEach((word: string) => {
        wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
      });
    });

    let res: Item[] = Array();
    for (const [text, value] of Object.entries(wordCounts)) {
      res.push({
        label: text as string,
        value: value as number,
      });
    }

    return res.sort((a: Item, b: Item) => b.value - a.value).slice(0, 15);
  };

  if (props.isLoading)
    return <Skeleton variant="rectangular" animation="wave" height="193px" />;

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

  return (
    <>
      <Tooltip title="Word Cloud" placement="top" arrow>
        <Box sx={{ m: 0, p: 0 }}>
          <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
            <TagCloud
              tags={generateWordCounts(props.evalsData)}
              minSize={20}
              maxSize={70}
              colorOptions={{
                luminosity: "bright",
                hue: "random",
                format: "hsla",
                alpha: 0.8,
              }}
              style={{
                fontWeight: "bold",
              }}
              randomSeed={7}
              renderer={wordRenderer}
            />
          </HoverCard>
        </Box>
      </Tooltip>
      <Tooltip title="Donut Chart" placement="top" arrow>
        <Box sx={{ m: 0, p: 0 }}>
          <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
            <DonutChart
              data={generateDonutCounts(props.evalsData)}
              width={500}
              height={370}
              formatValues={(values, total) =>
                `${((values / total) * 100).toFixed(1)}%`
              }
            />
          </HoverCard>
        </Box>
      </Tooltip>
    </>
  );
}
