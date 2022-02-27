import { ChartWord, EvalsData } from "../../../src/Types";
import HoverCard from "../HoverCard";
import { TagCloud } from "react-tagcloud";
import { generateWordCounts } from "../../../src/Helpers";
import { Box } from "@mui/material";

export default function WordCloudChart(props: {
  evalsData: EvalsData[];
  width: number;
}) {
  const wordStyles = {
    margin: "0px 3px",
    verticalAlign: "middle",
    display: "inline-block",
  };

  const generateTagCloudCounts = (
    evalsData: EvalsData[],
    numWords: number
  ): ChartWord[] => {
    let wordCounts = generateWordCounts(evalsData);
    let res: ChartWord[] = Array();
    for (const [text, value] of Object.entries(wordCounts)) {
      res.push({
        value: text as string,
        count: value as number,
      });
    }
    return res
      .sort((a: ChartWord, b: ChartWord) => b.count - a.count)
      .slice(0, numWords);
  };

  const wordRenderer = (tag: ChartWord, size: number, color: string) => {
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
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mb: 4, p: 2.5 }}>
        <TagCloud
          tags={generateTagCloudCounts(props.evalsData, 30)}
          minSize={20}
          maxSize={props.width >= 800 ? 70 : 40}
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
  );
}
