import Grid from "@mui/material/Grid";
import { blue } from "@mui/material/colors";
import HoverCard from "../course/HoverCard";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { CourseData } from "../../src/Types";
import { fetcher, getFullTitle } from "../../src/Helpers";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import useCAS from "../../hooks/useCAS";
import Link from "next/link";
import Box from "@mui/material/Box";

// Component to display "My Courses" on Dashboard
export default function MyCourses(props) {
  const { isInstructor } = useCAS();
  const myCourses: string[] = props.myCourses ?? [];

  // get course data given course IDs
  const courseUrl =
    myCourses.length != 0
      ? `/api/course-page-data?courseids=${myCourses.join(",")}`
      : null;
  let { data: courseData, error: courseError } = useSWR(courseUrl, fetcher);

  // get stats for each course's forms
  const formsUrl =
    myCourses.length != 0
      ? `/api/course-forms-data?courseids=${myCourses.join(",")}`
      : null;
  let { data: formsData, error: formsError } = useSWR(formsUrl, fetcher);

  if (courseError || formsError)
    return <Typography>Failed to retrieve your courses!</Typography>;

  // handler when user clicks remove course
  const handleRemoveCourse = (courseID: string) => {
    fetch(`/api/modify-my-courses?courseid=${courseID}&action=remove`);
    props.setFlag();
  };

  // construct cards for each course
  const courseRes = courseData?.map((course: CourseData) => {
    const catalogTitle: string = getFullTitle(
      course.catalog_title,
      course.crosslisting_catalog_titles
    );
    const courseID: string = course["course_id"];

    let stats = { numForms: 0, numSubmitted: 0 };
    if (formsData && courseID in formsData) {
      stats = formsData[courseID];
    }

    return (
      <Link href={`/course/${courseID}`} key={`search-${courseID}`}>
        <a id={`search-${courseID}`} style={{ textDecoration: "none" }}>
          <Box sx={{ m: 0.75, color: "black" }}>
            <HoverCard sx={{ p: 1.25, borderColor: blue[200] }}>
              <Grid
                container
                item
                direction="row"
                xs={12}
                sx={{ justifyContent: "space-between", flexWrap: "nowrap" }}
              >
                <Grid item>
                  <Typography fontWeight="bold">{catalogTitle}</Typography>
                  <Typography>{course.course_title}</Typography>
                  <Typography fontStyle="italic">
                    {isInstructor
                      ? `${stats.numForms} Forms Published`
                      : `${stats.numSubmitted}/${stats.numForms} Forms Submitted`}
                  </Typography>
                </Grid>
                {!props.isInstructor ? (
                  <Grid item>
                    <Tooltip title="Remove Course" arrow>
                      <Button
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: 8 }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveCourse(courseID);
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 24 }} />
                      </Button>
                    </Tooltip>
                  </Grid>
                ) : null}
              </Grid>
            </HoverCard>
          </Box>
        </a>
      </Link>
    );
  });

  return (
    <Grid
      container
      item
      xs={6}
      direction="column"
      sx={{
        padding: 2,
      }}
    >
      <Typography variant="h5" sx={{ px: 1.25, mb: 0.25, color: "black" }}>
        My Courses
      </Typography>
      {courseRes}
    </Grid>
  );
}
