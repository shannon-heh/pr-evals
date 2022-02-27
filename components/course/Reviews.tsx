import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import useWindowDimensions from "../../hooks/windowDimensions";
import { fetcher } from "../../src/Helpers";
import { EvalsData } from "../../src/Types";
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
        <Typography variant="subtitle1" fontWeight="medium">
          This course has no written reviews yet. Check back later!
        </Typography>
      </Box>
    );

  return (
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
  );
}
