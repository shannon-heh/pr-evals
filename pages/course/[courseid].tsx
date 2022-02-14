import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { blue, grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import useSWR from "swr";
import CustomHead from "../../components/CustomHead";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import pluralize from "pluralize";
import useCAS from "../../hooks/useCAS";
import { courseData, classData, instructorData } from "../api/course-page-data";

export default function Course() {
  const { isLoading, netID } = useCAS();

  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { courseid } = router.query;
  const { data, error } = useSWR(
    courseid ? `/api/course-page-data?courseid=${courseid}` : null,
    fetcher
  );
  const courseData = data as courseData;

  if (error) return <Error text={"Error fetching course!"} />;
  if (isLoading || !data) return <Loading text={"Loading course..."} />;

  let countUniqueSections = (classes: classData[]): Object[] => {
    let counts = {};
    for (let { classType, weeklyMeetingsCount } of classes) {
      classType = classType == "Unknown" ? "Other" : classType;
      if (
        classType in counts &&
        counts[classType]["weeklyMeetingsCount"] > weeklyMeetingsCount
      ) {
        weeklyMeetingsCount = counts[classType]["weeklyMeetingsCount"];
      }
      counts[classType] = {
        classType,
        weeklyMeetingsCount,
      };
    }
    return Object.values(counts);
  };

  const commonHeaderBoxStyles = {
    m: 2,
    background: blue[200],
    borderRadius: 3,
    boxShadow: 7,
    alignItems: "center",
    color: grey[800],
  };

  return (
    <>
      <CustomHead
        pageTitle={`${courseData.catalogTitle}: ${courseData.courseTitle}`}
      />
      <Grid container spacing={2} sx={{ textAlign: "center" }}>
        <Grid item container md={8} direction="column">
          <Box sx={{ ...commonHeaderBoxStyles, p: 5, mb: 0, height: "100%" }}>
            <Typography variant="h3" color="white" fontWeight="bold">
              {courseData.catalogTitle}
            </Typography>
            <Typography variant="subtitle1" fontWeight="medium">
              {pluralize(
                "Crosslisting",
                courseData.crosslistingCatalogTitles.length
              )}
              : {courseData.crosslistingCatalogTitles.join(" • ")}
            </Typography>
            <Typography variant="h5" fontWeight="bolder">
              {courseData.courseTitle}
            </Typography>
          </Box>
        </Grid>
        <Grid item container md={4} direction="column">
          <Box sx={{ ...commonHeaderBoxStyles, p: 5, mb: 0, height: "100%" }}>
            <Typography variant="h5" color="white" fontWeight="bold">
              Quick Facts
            </Typography>
            <Typography variant="subtitle1" fontWeight="medium">
              # Instructors:{" "}
              <Typography display="inline" fontWeight="normal">
                {courseData.instructors.length}
              </Typography>
            </Typography>
            <Typography variant="subtitle1" fontWeight="medium">
              Meetings per week:{" "}
              <Typography
                display="inline"
                variant="subtitle1"
                fontWeight="normal"
              >
                {countUniqueSections(courseData.classes)
                  .map((class_) => {
                    return class_["weeklyMeetingsCount"] == 0 &&
                      class_["classType"] == "Lecture"
                      ? "Pre-Recorded Lectures"
                      : pluralize(
                          class_["classType"],
                          class_["weeklyMeetingsCount"],
                          true
                        );
                  })
                  .join(" • ")}
              </Typography>
            </Typography>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Box sx={{ ...commonHeaderBoxStyles, m: 2, p: 1.2 }}>
            <Typography variant="h6" color="white" fontWeight="bold">
              {pluralize("Instructor", courseData.instructors.length)}:{" "}
              <Typography
                display="inline"
                variant="subtitle1"
                fontWeight="medium"
                color={grey[800]}
              >
                {courseData.instructors
                  .map((instr: instructorData) => {
                    return instr["instructor_name"];
                  })
                  .join(" • ")}
              </Typography>
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          md={12}
          sx={{
            backgroundColor: blue[900],
            minHeight: "50vh",
            color: "white",
            mt: 2,
          }}
        >
          Main content!
        </Grid>
      </Grid>
    </>
  );
}
