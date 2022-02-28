import useWindowDimensions from "../../hooks/windowDimensions";
import { EvalsData } from "../../src/Types";
import WordDonutChart from "./charts/WordDonutChart";
import WordCloudChart from "./charts/WordCloudChart";
import WordSentimentChart from "./charts/WordSentimentChart";
import { Skeleton, Tooltip } from "@mui/material";

export default function WordVisualizations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  const { width } = useWindowDimensions();

  if (props.isLoading)
    return <Skeleton variant="rectangular" animation="wave" height="193px" />;

  return (
    <>
      <Tooltip title="Sentiment Histogram" placement="top" arrow>
        <div>
          <WordSentimentChart evalsData={props.evalsData} />
        </div>
      </Tooltip>
      <Tooltip title="Word Cloud" placement="top" arrow>
        <div>
          <WordCloudChart evalsData={props.evalsData} width={width} />
        </div>
      </Tooltip>
      <Tooltip title="Donut Chart" placement="top" arrow>
        <div>
          <WordDonutChart evalsData={props.evalsData} width={width} />
        </div>
      </Tooltip>
    </>
  );
}
