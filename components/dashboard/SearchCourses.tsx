import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { blue } from "@mui/material/colors";
import HoverCard from "../course/HoverCard";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import useSWR from "swr";
import { CourseData } from "../../src/Types";
import { fetcher, getFullTitle } from "../../src/Helpers";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import Error from "../../components/Error";
import Link from "next/link";
import Box from "@mui/material/Box";

// Component to display Course Search on Dashboard
export default function CourseSearch(props) {
  const [url, setUrl] = useState(null); // stores search query URL

  // define initial search value
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: () => {},
  });

  // get user's inputted query
  const query: string = formik.values.search;

  // wait 1.5s for user to finish typing before making request
  // search was previously slow due to too many requeests
  useEffect(() => {
    const timerId: NodeJS.Timeout = setTimeout(() => {
      setUrl(`/api/search-courses?q=${query}`);
    }, 1500);
    return () => clearTimeout(timerId);
  }, [query]);

  // search for courses
  let { data: courseData, error: courseError } = useSWR(url, fetcher);
  if (courseError) return <Error text="Failed to load Dashboard!" />;

  // handler when user clicks add course
  const handleAddCourse = (courseID: string) => {
    fetch(`/api/modify-my-courses?courseid=${courseID}&action=add`);
    props.setFlag();
  };

  // construct cards for each search result
  const searchRes = courseData?.map((course: CourseData) => {
    const catalogTitle: string = getFullTitle(
      course.catalog_title,
      course.crosslisting_catalog_titles
    );
    const courseID: string = course.course_id;

    // show Checked button if user has course, Add button otherwise
    let button = null;
    if (!props.isInstructor) {
      const isMyCourse = props.myCourses.includes(courseID);
      button = isMyCourse ? (
        <Tooltip title="Added" arrow>
          <Button
            variant="contained"
            sx={{
              borderRadius: 8,
              backgroundColor: "gray",
              "&:hover": {
                backgroundColor: "gray",
                boxShadow: "none",
                cursor: "default",
              },
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <CheckIcon sx={{ fontSize: 24 }} />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="Add Course" arrow>
          <Button
            color="success"
            variant="contained"
            sx={{ borderRadius: 8 }}
            onClick={(e) => {
              e.preventDefault();
              handleAddCourse(courseID);
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
          </Button>
        </Tooltip>
      );
    }

    return (
      <Link href={`/course/${courseID}`} key={`search-${courseID}`}>
        <a id={`search-${courseID}`} style={{ textDecoration: "none" }}>
          <Box sx={{ m: 0.75, color: "black" }}>
            <HoverCard sx={{ p: 1.25 }}>
              <Grid
                container
                item
                direction="row"
                xs={12}
                sx={{
                  justifyContent: "space-between",
                  flexWrap: "nowrap",
                }}
              >
                <Grid item>
                  <Typography fontWeight="bold" sx={{ textDecoration: "none" }}>
                    {catalogTitle}
                  </Typography>
                  <Typography>{course.course_title}</Typography>
                  <Typography fontStyle="italic">5 Forms Active</Typography>
                </Grid>
                <Grid item>{button}</Grid>
              </Grid>
            </HoverCard>
          </Box>
        </a>
      </Link>
    );
  });

  return (
    <Grid
      item
      xs={6}
      direction="row"
      sx={{
        p: 2,
        pt: 2.8,
        height: "90vh",
        overflow: "scroll",
        borderRight: 1,
        borderWidth: 3,
        borderColor: blue[600],
      }}
    >
      <TextField
        id="search"
        label="Search for courses"
        variant="outlined"
        name="search"
        onChange={formik.handleChange}
        value={formik.values.search}
        sx={{
          width: "100%",
          color: "black",
        }}
      />
      <Box sx={{ overflow: "scroll", pt: 1, height: "90%" }}>{searchRes}</Box>
    </Grid>
  );
}
