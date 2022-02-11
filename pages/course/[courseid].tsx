import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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

  return (
    <>
      <CustomHead
        pageTitle={`${courseData.catalogTitle}: ${courseData.courseTitle}`}
      />
      <Grid
        container
        spacing={2}
        sx={{ textAlign: "center", borderStyle: "dashed" }}
      >
        <Grid
          item
          container
          xs={8}
          direction="column"
          display="flex"
          justifyContent="center"
          sx={{ my: 3 }}
        >
          <Box>{courseData.catalogTitle}</Box>
          <Box>
            {pluralize(
              "Crosslisting",
              courseData.crosslistingCatalogTitles.length
            )}
            : {courseData.crosslistingCatalogTitles.join(" • ")}
          </Box>
          <Box>{courseData.courseTitle}</Box>
        </Grid>
        <Grid item xs={4} sx={{ my: 3 }}>
          <Box>Quick Facts</Box>
          <Box># Instructors: {courseData.instructors.length}</Box>
          <Box>Meetings per week:</Box>
          {countUniqueSections(courseData.classes).map((class_) => {
            return (
              <Box key={class_["classType"]}>
                {class_["weeklyMeetingsCount"] == 0 &&
                class_["classType"] == "Lecture"
                  ? "Pre-Recorded Lectures"
                  : pluralize(
                      class_["classType"],
                      class_["weeklyMeetingsCount"],
                      true
                    )}
              </Box>
            );
          })}
        </Grid>
        <Grid item xs={12} sx={{ my: 3 }}>
          <Box>
            {pluralize("Instructor", courseData.instructors.length)}:{" "}
            {courseData.instructors
              .map((instr: instructorData) => {
                return instr["instructor_name"];
              })
              .join(" • ")}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
