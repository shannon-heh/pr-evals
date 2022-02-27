import { Box, Grid, Skeleton } from "@mui/material";
import useSWR from "swr";
import { fetcher } from "../../src/Helpers";
import { ChartData } from "../../src/Types";
import SingleChoiceChart from "./charts/SingleChoiceChart";

export default function Charts() {
  const { data: chartData_, error } = useSWR("/api/chart-data", fetcher);
  const chartData = chartData_ as ChartData[];

  if (!chartData || error)
    return (
      <Grid container sx={{ textAlign: "center" }}>
        <Grid item container lg={6} direction="column">
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" animation="wave" height="193px" />
            <br />
            <Skeleton variant="rectangular" animation="wave" height="193px" />
          </Box>
        </Grid>
        <Grid item container lg={6} direction="column">
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" animation="wave" height="193px" />
            <br />
            <Skeleton variant="rectangular" animation="wave" height="193px" />
          </Box>
        </Grid>
      </Grid>
    );

  return (
    <Grid container sx={{ textAlign: "center" }}>
      <Grid item container lg={6} direction="column">
        <SingleChoiceChart
          data={chartData[0].data}
          title={chartData[0].question}
        />
      </Grid>
      <Grid item container lg={6} direction="column">
        col2
      </Grid>
    </Grid>
  );
}
