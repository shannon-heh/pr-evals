import { Box, Grid, Skeleton } from "@mui/material";
import useSWR from "swr";
import useWindowDimensions from "../../hooks/windowDimensions";
import { fetcher } from "../../src/Helpers";
import { ChartData } from "../../src/Types";
import MultiChoiceChart from "./charts/MultiChoiceChart";
import ScaleChart from "./charts/ScaleChart";
import SingleChoiceChart from "./charts/SingleChoiceChart";

function ChartWrapper(props: { children?: React.ReactNode }) {
  return (
    <Grid item container lg={6} direction="column">
      <Box sx={{ p: 2 }}>{props.children}</Box>
    </Grid>
  );
}

export default function Charts() {
  const { width } = useWindowDimensions();
  const { data: chartData_, error } = useSWR("/api/chart-data", fetcher);
  const chartData = chartData_ as ChartData[];

  const makeChart = (data: ChartData) => {
    switch (data.type) {
      case "SINGLE_SEL":
        return (
          <ChartWrapper>
            <SingleChoiceChart
              data={data.data}
              title={data.question}
              width={width}
            />
          </ChartWrapper>
        );
      case "MULTI_SEL":
        return (
          <ChartWrapper>
            <MultiChoiceChart
              data={data.data}
              title={data.question}
              width={width}
            />
          </ChartWrapper>
        );
      case "SLIDER":
        return (
          <ChartWrapper>
            <ScaleChart data={data.data} title={data.question} width={width} />
          </ChartWrapper>
        );
      default:
        return <></>;
    }
  };

  const processChartData = (allData: ChartData[]) => {
    const charts = Array();
    allData.forEach((data) => {
      charts.push(makeChart(data));
    });
    return charts;
  };

  if (!chartData || error)
    return (
      <Grid container sx={{ textAlign: "center", mt: 2 }}>
        <Grid item container lg={6} direction="column">
          <Box sx={{ p: 2 }}>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
            <br />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
          </Box>
        </Grid>
        <Grid item container lg={6} direction="column">
          <Box sx={{ p: 2 }}>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
            <br />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 2 }}
              animation="wave"
              height="193px"
            />
          </Box>
        </Grid>
      </Grid>
    );

  return (
    <Grid container sx={{ textAlign: "center", mb: 2 }}>
      {processChartData(chartData)}
    </Grid>
  );
}
