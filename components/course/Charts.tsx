import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { useState } from "react";
import useSWR from "swr";
import useWindowDimensions from "../../hooks/windowDimensions";
import { COLORS, fetcher } from "../../src/Helpers";
import { ChartData, ResponseData } from "../../src/Types";
import MultiChoiceChart from "./charts/MultiChoiceChart";
import ScaleChart from "./charts/ScaleChart";
import SingleChoiceChart from "./charts/SingleChoiceChart";
import TextChart from "./charts/TextChart";
import HoverCard from "./HoverCard";
import Filters from "./Filters";
import WordCloudChart from "./charts/WordCloudChart";

export default function Charts(props: {
  courseID?: string;
  formID?: string;
  isStandard: boolean;
  isDemographics?: boolean;
  hideResponseRate?: boolean;
}) {
  const [concentrationFilter, setConcentrationFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const { width } = useWindowDimensions();
  const { data: chartData_, error } = useSWR(
    props.courseID
      ? `/api/response-data?courseid=${props.courseID}${
          props.isDemographics ? "&demographics" : ""
        }${
          concentrationFilter !== ""
            ? `&concentration=${concentrationFilter}`
            : ""
        }${yearFilter !== "" ? `&year=${yearFilter}` : ""}`
      : `/api/response-data?formid=${props.formID}${
          concentrationFilter !== ""
            ? `&concentration=${concentrationFilter}`
            : ""
        }${yearFilter !== "" ? `&year=${yearFilter}` : ""}`,
    fetcher
  );
  const { data: extraDemographicsData_, error: extraDemographicsError } =
    useSWR(
      props.isDemographics
        ? `/api/response-data?courseid=${props.courseID}`
        : null
    );
  const chartData = props.isDemographics
    ? (chartData_ as ResponseData)?.responses.concat(
        (extraDemographicsData_ as ResponseData)?.responses.slice(-3, -1)
      )
    : (chartData_ as ResponseData)?.responses;

  const makeChart = (data: ChartData, i: number) => {
    if (data.data.length == 0 && !props.isStandard)
      return (
        <ChartWrapper>
          <HoverCard sx={{ mt: 2, p: 2.5 }}>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              color={red[500]}
            >
              The question "{data.question}" has been omitted because it has 0
              responses.
            </Typography>
          </HoverCard>
        </ChartWrapper>
      );

    let numResponses = 0;
    data.data.forEach((sample) => {
      if (data.type === "TEXT") numResponses++;
      else numResponses += sample["value"];
    });

    switch (data.type) {
      case "SINGLE_SEL":
        return (
          <ChartWrapper key={i}>
            <SingleChoiceChart
              data={data.data}
              title={data.question}
              width={width}
              totalResponses={
                props.hideResponseRate
                  ? null
                  : chartData_["meta"]["num_responses"]
              }
              numResponses={props.hideResponseRate ? null : numResponses}
              omitQuestionType={props.isDemographics}
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
              color={COLORS[i % COLORS.length]}
              omitQuestionType={props.isDemographics}
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
              color={COLORS[i % COLORS.length]}
              totalResponses={
                props.hideResponseRate
                  ? null
                  : chartData_["meta"]["num_responses"]
              }
              numResponses={props.hideResponseRate ? null : numResponses}
              omitQuestionType={props.isDemographics}
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
              width={width}
              color={COLORS[i % COLORS.length]}
              totalResponses={
                props.hideResponseRate
                  ? null
                  : chartData_["meta"]["num_responses"]
              }
              numResponses={props.hideResponseRate ? null : numResponses}
            />
          </ChartWrapper>
        );
      case "TEXT":
        if (props.isStandard) return null;
        return (
          <ChartWrapper key={i}>
            <TextChart
              data={data.data}
              title={data.question}
              width={width}
              totalResponses={
                props.hideResponseRate
                  ? null
                  : chartData_["meta"]["num_responses"]
              }
              numResponses={props.hideResponseRate ? null : numResponses}
            />
          </ChartWrapper>
        );
    }
  };

  const processChartData = (allData: ChartData[]) => {
    return allData.map((data, i) => makeChart(data, i));
  };

  const convertToWordCloudData = (chartData: ChartData[]) => {
    return chartData
      .map((sample: ChartData) => {
        return { data: sample.data };
      })
      .map((sample: Object) => {
        return sample["data"];
      })
      .flat()
      .map((sample: Object) => {
        const res = [];
        for (let i = 0; i < sample["value"]; i++)
          res.push({ text: sample["name"] });
        return res;
      })
      .flat();
  };

  if (!chartData || error || extraDemographicsError)
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
      {props.isStandard ? (
        <HoverCard sx={{ mt: 2, p: 2.5, background: blue[300] }}>
          <Typography variant="subtitle1" fontWeight="medium" color="white">
            These charts visualize responses submitted to the standardized
            evaluations form.
          </Typography>
        </HoverCard>
      ) : null}
      {props.isDemographics ? (
        <HoverCard sx={{ mt: 2, p: 2.5, background: blue[300] }}>
          <Typography variant="subtitle1" fontWeight="medium" color="white">
            These charts visualize demographics about the students who completed
            this course's standardized evaluations form.
          </Typography>
        </HoverCard>
      ) : null}
      {!props.isDemographics && (props.formID || props.courseID) ? (
        <Filters
          setConcentrationFilter={setConcentrationFilter}
          concentrationFilter={concentrationFilter}
          setYearFilter={setYearFilter}
          yearFilter={yearFilter}
        />
      ) : null}
      {chartData.length == 0 || chartData[0].data.length == 0 ? (
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          mt={2}
          color={red[500]}
        >
          {props.isStandard
            ? "This course doesn't have any responses to its standardized form (yet)!"
            : props.isDemographics
            ? "This course's student demographics will become available as students fill out its standardized form!"
            : "No responses (yet)!"}
        </Typography>
      ) : (
        <Grid container sx={{ textAlign: "center", mb: 2 }}>
          {/* Move the last two standardized form questions to the Demographics tab */}
          {processChartData(chartData)}
          {props.isDemographics ? (
            <>
              <ChartWrapper key={-1}>
                <WordCloudChart
                  width={width}
                  evalsData={convertToWordCloudData(chartData.slice(0, 1))}
                />
              </ChartWrapper>
              <ChartWrapper key={-2}>
                <WordCloudChart
                  width={width}
                  evalsData={convertToWordCloudData(chartData.slice(1, 2))}
                />
              </ChartWrapper>
            </>
          ) : null}
        </Grid>
      )}
    </>
  );
}

function ChartWrapper(props: { children?: React.ReactNode }) {
  return (
    <Grid item container lg={6} direction="column">
      <Box sx={{ p: 2 }}>{props.children}</Box>
    </Grid>
  );
}
