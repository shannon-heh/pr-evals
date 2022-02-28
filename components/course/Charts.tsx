import { Box, Grid, Skeleton } from "@mui/material";
import useSWR from "swr";
import useWindowDimensions from "../../hooks/windowDimensions";
import { fetcher } from "../../src/Helpers";
import { ChartData } from "../../src/Types";
import MultiChoiceChart from "./charts/MultiChoiceChart";
import SingleChoiceChart from "./charts/SingleChoiceChart";

export default function Charts() {
  const { width } = useWindowDimensions();
  const { data: chartData_, error } = useSWR("/api/chart-data", fetcher);
  const chartData = chartData_ as ChartData[];

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
    <Grid container sx={{ textAlign: "center" }}>
      <Grid item container lg={6} direction="column">
        <Box sx={{ p: 2 }}>
          <SingleChoiceChart
            data={chartData[0].data}
            title={chartData[0].question}
            width={width}
          />
        </Box>
      </Grid>
      <Grid item container lg={6} direction="column">
        <Box sx={{ p: 2 }}>
          <MultiChoiceChart
            data={chartData[0].data}
            title={chartData[0].question}
            width={width}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
