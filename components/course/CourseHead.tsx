import { Grid, ThemeProvider, Tooltip, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import pluralize from "pluralize";
import { prEvalsTheme } from "../../src/Helpers";
import { ClassData, CourseData, InstructorData } from "../../src/Types";
import HoverCard from "./HoverCard";

export default function CourseHead(props: { data: CourseData }) {
  const commonHeaderBoxStyles = {
    background: prEvalsTheme.palette.secondary.dark,
    borderColor: grey[300],
    alignItems: "center",
    color: "black",
    p: 5,
  };

  let countUniqueSections = (classes: ClassData[]): Object[] => {
    let counts = {};
    for (let { class_type, weekly_meetings_count } of classes) {
      class_type = class_type == "Unknown" ? "Other" : class_type;
      if (class_type != "Lecture" && weekly_meetings_count == 0) continue;
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
    <ThemeProvider theme={prEvalsTheme}>
      <Grid item container md={8} direction="column" sx={{ mt: 2 }}>
        <HoverCard
          sx={{
            ...commonHeaderBoxStyles,
            justifyContent: "center",
          }}
          specialCourseHeaderFlex
        >
          <Typography
            variant="h3"
            component="div"
            fontWeight="bold"
            color="secondary"
          >
            {props.data.catalog_title}
          </Typography>
          {props.data.crosslisting_catalog_titles.length > 0 ? (
            <Typography variant="subtitle1" component="div">
              {pluralize(
                "Crosslisting",
                props.data.crosslisting_catalog_titles.length
              )}
              : {props.data.crosslisting_catalog_titles.join(" • ")}
            </Typography>
          ) : null}
          <Typography variant="h5" component="div" mt={1}>
            {props.data.course_title}
          </Typography>
        </HoverCard>
      </Grid>
      <Grid item container md={4} direction="column" sx={{ mt: 2 }}>
        <HoverCard
          sx={{ ...commonHeaderBoxStyles, justifyContent: "center" }}
          specialCourseHeaderFlex
        >
          <Typography
            variant="h4"
            component="div"
            fontWeight="bold"
            color="secondary"
          >
            Quick Facts
          </Typography>
          <Typography variant="subtitle1" component="div" fontWeight="medium">
            # Instructors:{" "}
            <Typography display="inline" fontWeight="normal">
              {props.data.instructors.length}
            </Typography>
          </Typography>
          <Tooltip
            title="# of students who added this course to their My Courses list"
            placement="left"
            arrow
          >
            <Typography variant="subtitle1" component="div" fontWeight="medium">
              # Students:{" "}
              <Typography display="inline" fontWeight="normal">
                {props.data.num_students}
              </Typography>
            </Typography>
          </Tooltip>
          <Typography variant="subtitle1" component="div" fontWeight="medium">
            Meetings per week:{" "}
            <Typography
              display="inline"
              variant="subtitle1"
              component="div"
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
        </HoverCard>
      </Grid>
      <Grid item container md={12} direction="column" sx={{ my: 2 }}>
        <HoverCard
          sx={{
            ...commonHeaderBoxStyles,
            py: 1.2,
            px: 5,
            justifyContent: "center",
          }}
          specialCourseHeaderFlex
        >
          <Typography
            variant="subtitle1"
            component="div"
            fontWeight="bold"
            color="secondary"
          >
            {pluralize("Instructor", props.data.instructors.length)}:{" "}
            <Typography display="inline" variant="subtitle1" color="black">
              {props.data.instructors
                .map((instr: InstructorData) => {
                  return instr["instructor_name"];
                })
                .join(" • ")}
            </Typography>
          </Typography>
        </HoverCard>
      </Grid>
    </ThemeProvider>
  );
}
