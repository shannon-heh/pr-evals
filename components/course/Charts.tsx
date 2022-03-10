import { Box, Grid, Rating, Skeleton, Typography } from "@mui/material";
import useSWR from "swr";
import useWindowDimensions from "../../hooks/windowDimensions";
import { fetcher } from "../../src/Helpers";
import { ChartData } from "../../src/Types";
import MultiChoiceChart from "./charts/MultiChoiceChart";
import ScaleChart from "./charts/ScaleChart";
import SingleChoiceChart from "./charts/SingleChoiceChart";
import TextChart from "./charts/TextChart";

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

  const makeChart = (data: ChartData, i: number) => {
    switch (data.type) {
      case "SINGLE_SEL":
        return (
          <ChartWrapper key={i}>
            <SingleChoiceChart
              data={data.data}
              title={data.question}
              width={width}
            />
          </ChartWrapper>
        );
      case "MULTI_SEL":
        return (
          <ChartWrapper key={i}>
            <MultiChoiceChart
              data={data.data}
              title={data.question}
              width={width}
            />
          </ChartWrapper>
        );
      case "SLIDER":
        return (
          <ChartWrapper key={i}>
            <ScaleChart
              type="Slider"
              data={data.data}
              title={data.question}
              width={width}
            />
          </ChartWrapper>
        );
      case "RATING":
        return (
          <ChartWrapper key={i}>
            <ScaleChart
              type="Rating"
              data={data.data}
              title={data.question}
              precision={data.precision}
              width={width}
            />
          </ChartWrapper>
        );
      case "TEXT":
        return (
          <ChartWrapper>
            <TextChart data={data.data} title={data.question} width={width} />
          </ChartWrapper>
        );
    }
  };

  const processChartData = (allData: ChartData[]) => {
    return allData.map((data, i) => makeChart(data, i));
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
    <>
      <Typography variant="subtitle1" fontWeight="medium" mt={3.2}>
        These charts visualize responses from the standardized evaluations form.
      </Typography>
      <Grid container sx={{ textAlign: "center", mb: 2 }}>
        {processChartData(chartData)}
      </Grid>
    </>
  );
}
