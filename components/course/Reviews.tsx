import { Box, Grid, Skeleton, Tooltip, Typography } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import useSWR from "swr";
import useWindowDimensions from "../../hooks/windowDimensions";
import { fetcher } from "../../src/Helpers";
import { EvalsData, ResponseData } from "../../src/Types";
import WordCloudChart from "./charts/WordCloudChart";
import WordDonutChart from "./charts/WordDonutChart";
import WordSentimentChart from "./charts/WordSentimentChart";
import Evaluation from "./charts/Evaluation";
import HoverCard from "./HoverCard";

export default function Reviews(props: { courseID?: string }) {
  const { data: evalsData_, error: evalsError } = useSWR(
    `/api/response-data?courseid=${props.courseID}`,
    fetcher
  );
  const evalsData = (evalsData_ as ResponseData).responses.filter(
    (response) => response.type === "TEXT"
  )[0].data;

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

function WordVisualizations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  const { width } = useWindowDimensions();

  if (props.isLoading)
    return (
      <Skeleton
        variant="rectangular"
        sx={{ mt: 2, borderRadius: 2 }}
        animation="wave"
        height="193px"
      />
    );

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

function TextualEvaluations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  if (props.isLoading)
    return (
      <>
        <Skeleton sx={{ mt: 2 }} animation="wave" />
        <Skeleton animation="wave" width="50%" />
        <br />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="50%" />
        <br />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="50%" />
      </>
    );

  return (
    <>
      {props.evalsData.map((evalDoc: EvalsData, i) => (
        <Evaluation key={i} evalDoc={evalDoc} />
      ))}
    </>
  );
}
