import { green, grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import pluralize from "pluralize";
import { ClassData, CourseData, InstructorData } from "../../src/Types";
import HoverCard from "./HoverCard";

export default function CourseHead(props: { data: CourseData }) {
  const commonHeaderBoxStyles = {
    background: green[200],
    borderColor: grey[400],
    alignItems: "center",
    color: grey[800],
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

  // TO-DO: @nicholaspad, add number of students as a quick fact
  return (
    <>
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
            color="white"
            fontWeight="bold"
          >
            {props.data.catalog_title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            fontWeight="medium"
            fontSize="1.1em"
          >
            {pluralize(
              "Crosslisting",
              props.data.crosslisting_catalog_titles.length
            )}
            : {props.data.crosslisting_catalog_titles.join(" • ")}
          </Typography>
          <Typography variant="h5" component="div" fontWeight="bolder">
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
            color="white"
            fontWeight="bold"
          >
            Quick Facts
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            fontWeight="medium"
            fontSize="1.1em"
          >
            # Instructors:{" "}
            <Typography display="inline" fontWeight="normal">
              {props.data.instructors.length}
            </Typography>
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            fontWeight="medium"
            fontSize="1.1em"
          >
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
            variant="h6"
            component="div"
            color="white"
            fontWeight="bold"
          >
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
        </HoverCard>
      </Grid>
    </>
  );
}
