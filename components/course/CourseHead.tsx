import Box from "@mui/material/Box";
import { blue, grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import pluralize from "pluralize";
import { ClassData, CourseData, InstructorData } from "../../src/Types";

export default function CourseHead(props: { data: CourseData }) {
  const commonHeaderBoxStyles = {
    m: 2,
    background: blue[200],
    borderRadius: 1,
    borderColor: grey[800],
    borderStyle: "solid",
    alignItems: "center",
    color: grey[800],
  };

  let countUniqueSections = (classes: ClassData[]): Object[] => {
    let counts = {};
    for (let { class_type, weekly_meetings_count } of classes) {
      class_type = class_type == "Unknown" ? "Other" : class_type;
      if (
        class_type in counts &&
        counts[class_type]["weekly_meetings_count"] > weekly_meetings_count
      )
        weekly_meetings_count = counts[class_type]["weekly_meetings_count"];
      counts[class_type] = {
        class_type,
        weekly_meetings_count,
      };
    }
    return Object.values(counts);
  };

  return (
    <>
      <Grid item container md={8} direction="column">
        <Box
          sx={{
            ...commonHeaderBoxStyles,
            p: 5,
            mb: 0,
            height: "100%",
          }}
        >
          <Typography variant="h3" color="white" fontWeight="bold">
            {props.data.catalog_title}
          </Typography>
          <Typography variant="subtitle1" fontWeight="medium" fontSize="1.1em">
            {pluralize(
              "Crosslisting",
              props.data.crosslisting_catalog_titles.length
            )}
            : {props.data.crosslisting_catalog_titles.join(" • ")}
          </Typography>
          <Typography variant="h5" fontWeight="bolder">
            {props.data.course_title}
          </Typography>
        </Box>
      </Grid>
      <Grid item container md={4} direction="column">
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
          <Typography variant="subtitle1" fontWeight="medium" fontSize="1.1em">
            Meetings per week:{" "}
            <Typography
              display="inline"
              variant="subtitle1"
              fontWeight="normal"
            >
              {countUniqueSections(props.data.classes)
                .map((class_) => {
                  return class_["weekly_meetings_count"] == 0 &&
                    class_["class_type"] == "Lecture"
                    ? "Pre-Recorded Lectures"
                    : pluralize(
                        class_["class_type"],
                        class_["weekly_meetings_count"],
                        true
                      );
                })
                .join(" • ")}
            </Typography>
          </Typography>
        </Box>
      </Grid>
      <Grid item container md={12} direction="column">
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
                .map((instr: InstructorData) => {
                  return instr["instructor_name"];
                })
                .join(" • ")}
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </>
  );
}
