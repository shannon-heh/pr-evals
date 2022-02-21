import Grid from "@mui/material/Grid";
import { blue } from "@mui/material/colors";
import Link from "@mui/material/Link";
import HoverCard from "../course/HoverCard";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { CourseData } from "../../src/Types";
import { fetcher, getFullTitle } from "../../src/Helpers";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

// Component to display "My Courses" on Dashboard
export default function MyCourses(props) {
  const myCourses: string[] = props.myCourses ?? [];

  // get course data given course IDs
  const courseUrl =
    myCourses.length != 0
      ? `/api/course-page-data?courseids=${myCourses.join(",")}`
      : null;
  let { data: courseData, error: courseError } = useSWR(courseUrl, fetcher);
  if (courseError) return <div>Failed to load Dashboard page.</div>;

  // handler when user clicks remove course
  const handleRemoveCourse = (courseID: string) => {
    const url: string = `/api/modify-my-courses?netid=${props.netID}&courseid=${courseID}&action=remove`;
    fetch(url);
    props.setFlag();
  };

  // construct cards for each course
  const courseRes = courseData?.map((course: CourseData) => {
    const catalogTitle: string = getFullTitle(
      course.catalog_title,
      course.crosslisting_catalog_titles
    );
    const courseID: string = course["course_id"];

    return (
      <Link
        href={`/course/${courseID}`}
        target="_blank"
        id={`search-${courseID}`}
        key={`search-${courseID}`}
        underline="none"
        sx={{ m: 0.75, color: "black" }}
      >
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
              <Typography fontStyle="italic">2 / 5 Forms Completed</Typography>
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
