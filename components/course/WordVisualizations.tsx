import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import useWindowDimensions from "../../hooks/windowDimensions";
import { EvalsData } from "../../src/Types";
import WordDonutChart from "./charts/WordDonutChart";
import WordCloudChart from "./charts/WordCloudChart";
import WordSentimentChart from "./charts/WordSentimentChart";

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
        <WordSentimentChart evalsData={props.evalsData} />
      </Tooltip>
      <Tooltip title="Word Cloud" placement="top" arrow>
        <WordCloudChart evalsData={props.evalsData} width={width} />
      </Tooltip>
      <Tooltip title="Donut Chart" placement="top" arrow>
        <WordDonutChart evalsData={props.evalsData} width={width} />
      </Tooltip>
    </>
  );
}
