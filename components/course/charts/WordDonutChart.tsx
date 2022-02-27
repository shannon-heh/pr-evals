import Box from "@mui/material/Box";
import DonutChart from "../../../src/donut/DonutChart";
import { generateWordCounts } from "../../../src/Helpers";
import { ChartItem, EvalsData } from "../../../src/Types";
import HoverCard from "../HoverCard";

export default function WordDonutChart(props: {
  evalsData: EvalsData[];
  width: number;
}) {
  const donutChartWidth = (width: number) => {
    if (width >= 900) return 500;
    if (width >= 600) return 370;
    return 280;
  };

  const donutChartHeight = (width: number) => {
    if (width >= 900) return 370;
    return donutChartWidth(width);
  };

  const generateDonutCounts = (
    evalsData: EvalsData[],
    numWords: number
  ): ChartItem[] => {
    let wordCounts = generateWordCounts(evalsData);
    let res: ChartItem[] = Array();
    for (const [text, value] of Object.entries(wordCounts)) {
      res.push({
        label: text as string,
        value: value as number,
      });
    }
    return res
      .sort((a: ChartItem, b: ChartItem) => b.value - a.value)
      .slice(0, numWords);
  };

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ p: 2.5 }}>
        <DonutChart
          data={generateDonutCounts(props.evalsData, 15)}
          width={donutChartWidth(props.width)}
          height={donutChartHeight(props.width)}
          formatValues={(values, total) =>
            `${((values / total) * 100).toFixed(1)}%`
          }
          legend={props.width >= 900}
        />
      </HoverCard>
    </Box>
  );
}
