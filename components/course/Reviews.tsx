import { Box, Grid, Typography } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import useSWR from "swr";
import useWindowDimensions from "../../hooks/windowDimensions";
import { fetcher } from "../../src/Helpers";
import { EvalsData } from "../../src/Types";
import HoverCard from "./HoverCard";
import TextualEvaluations from "./TextualEvaluations";
import WordVisualizations from "./WordVisualizations";

export default function Reviews() {
  const { data: evalsData, error: evalsError } = useSWR(
    "/api/textual-evaluations",
    fetcher
  );

  const { width } = useWindowDimensions();

  if (evalsData && (evalsData as EvalsData[]).length == 0)
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium" color={red[500]}>
          This course has no written reviews yet. Check back later!
        </Typography>
      </Box>
    );

  return (
    <>
      <HoverCard sx={{ mt: 2, p: 2.5, background: blue[300] }}>
        <Typography variant="subtitle1" fontWeight="medium" color="white">
          These written responses were submitted to the standardized evaluations
          form.
        </Typography>
      </HoverCard>
      <Grid container sx={{ textAlign: "center" }}>
        <Grid item container lg={6} direction="column">
          <Box sx={{ p: 2 }}>
            <WordVisualizations
              evalsData={evalsData as EvalsData[]}
              isLoading={!evalsData || evalsError}
            />
          </Box>
        </Grid>
        <Grid item container lg={6} direction="column">
          <Box
            sx={{
              p: 2,
              mb: 2,
              height: width <= 900 ? 600 : 1000,
              overflowX: "auto",
              overflowY: "scroll",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <TextualEvaluations
              evalsData={evalsData as EvalsData[]}
              isLoading={!evalsData || evalsError}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
