import Box from "@mui/material/Box";
import { blue, grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import pluralize from "pluralize";
import {
  classData,
  courseData,
  instructorData,
} from "../../pages/api/course-page-data";

export default function CourseHead(props: { data: courseData }) {
  const commonHeaderBoxStyles = {
    m: 2,
    background: blue[200],
    borderRadius: 1,
    borderColor: grey[800],
    borderStyle: "solid",
    alignItems: "center",
    color: grey[800],
  };

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
      <Grid item container lg={8} direction="column">
        <Box
          sx={{
            ...commonHeaderBoxStyles,
            p: 5,
            mb: 0,
            height: "100%",
          }}
        >
          <Typography variant="h3" color="white" fontWeight="bold">
            {props.data.catalogTitle}
          </Typography>
          <Typography variant="subtitle1" fontWeight="medium" fontSize="1.1em">
            {pluralize(
              "Crosslisting",
              props.data.crosslistingCatalogTitles.length
            )}
            : {props.data.crosslistingCatalogTitles.join(" • ")}
          </Typography>
          <Typography variant="h5" fontWeight="bolder">
            {props.data.courseTitle}
          </Typography>
        </Box>
      </Grid>
      <Grid item container lg={4} direction="column">
        <Box
          sx={{
            ...commonHeaderBoxStyles,
            p: 5,
            mb: 0,
            height: "100%",
          }}
        >
          <Typography variant="h4" color="white" fontWeight="bold">
            Quick Facts
          </Typography>
          <Typography variant="subtitle1" fontWeight="medium" fontSize="1.1em">
            # Instructors:{" "}
            <Typography display="inline" fontWeight="normal">
              {props.data.instructors.length}
            </Typography>
          </Typography>
          <Typography variant="subtitle1" fontWeight="medium">
            Meetings per week:{" "}
            <Typography
              display="inline"
              variant="subtitle1"
              fontWeight="normal"
              fontSize="1.1em"
            >
              {countUniqueSections(props.data.classes)
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
      <Grid item container lg={12} direction="column">
        <Box sx={{ ...commonHeaderBoxStyles, p: 1.2 }}>
          <Typography variant="h6" color="white" fontWeight="bold">
            {pluralize("Instructor", props.data.instructors.length)}:{" "}
            <Typography
              display="inline"
              variant="subtitle1"
              fontWeight="medium"
              color={grey[800]}
            >
              {props.data.instructors
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
        container
        lg={12}
        direction="column"
        sx={{
          backgroundColor: grey[800],
          mt: 2,
        }}
      ></Grid>
    </>
  );
}
