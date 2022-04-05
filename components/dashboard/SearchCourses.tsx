import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { grey } from "@mui/material/colors";
import HoverCard from "../course/HoverCard";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import useSWR from "swr";
import { CourseData } from "../../src/Types";
import { fetcher, getFullTitle, prEvalsTheme } from "../../src/Helpers";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import Error from "../../components/Error";
import Link from "next/link";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

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
  const query: string = formik.values.search?.trim();

  // wait for user to enter 3 characters before querying
  useEffect(() => {
    if (query.length >= 3) {
      const sanitizedQuery = query.replace(/[^a-z0-9-,?!]/gi, "");
      if (sanitizedQuery.length < 3) setUrl(null);
      else setUrl(`/api/search-courses?q=${sanitizedQuery}`);
    } else {
      setUrl(null);
    }
  }, [query]);

  // search for courses
  const { data: courseData, error: courseError } = useSWR(url, fetcher);
  if (courseError) return <Error text="Failed to load Dashboard!" />;

  // handler when user clicks add course
  const handleAddCourse = (courseID: string) => {
    fetch(`/api/modify-my-courses?courseid=${courseID}&action=add`).then(() => {
      props.setFlag();
    });
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
      const isMyCourse = props.myCourses?.includes(courseID);
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
        <a
          id={`search-${courseID}`}
          style={{ textDecoration: "none" }}
          target="_blank"
        >
          <Box sx={{ m: 1.25, color: "black" }}>
            <HoverCard
              sx={{
                p: 1.25,
                background: prEvalsTheme.palette.secondary.dark,
                borderColor: grey[300],
              }}
            >
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
    <>
      <Grid
        container
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
          borderColor: prEvalsTheme.palette.secondary.main,
        }}
      >
        <TextField
          id="search"
          label="Search for courses"
          variant="outlined"
          color="secondary"
          name="search"
          onChange={formik.handleChange}
          value={formik.values.search}
          sx={{
            mx: 1.25,
            width: "100%",
            color: "black",
          }}
        />
        <Box sx={{ overflow: "scroll", pt: 1, height: "90%", width: "100%" }}>
          {url != null ? (
            searchRes && searchRes.length == 0 ? (
              <Typography>No courses found.</Typography>
            ) : searchRes === undefined ? (
              <>
                <CircularProgress size={16} />
                <Typography ml={1} display="inline">
                  Loading results...
                </Typography>
              </>
            ) : (
              searchRes
            )
          ) : (
            <Typography px={1.25}>
              Enter 3+ characters to start finding courses.
            </Typography>
          )}
        </Box>
      </Grid>
    </>
  );
}
