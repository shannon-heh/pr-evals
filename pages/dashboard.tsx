import useSWR from "swr";
import useCAS from "../hooks/useCAS";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import HoverCard from "../components/course/HoverCard";
import CustomHead from "../components/CustomHead";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { blue, grey } from "@mui/material/colors";
import CourseSearch from "../components/dashboard/SearchCourses";
import MyCourses from "../components/dashboard/MyCourses";
import { fetcher } from "../src/Helpers";

export default function Dashboard() {
  const { netID, isInstructor } = useCAS();
  const [modifyFlag, setFlag] = useState(0); // stores dummy flag to update URl
  const [myCourses, setMyCourses] = useState([]); // stores user's courses

  // handler used by child components to set flag
  function flagHandler() {
    setFlag(modifyFlag + 1);
  }

  // get user's courses from DB
  const url = netID
    ? `/api/get-user-data?netid=${netID}&flag=${modifyFlag}`
    : "";
  let { data: userData, error: userError } = useSWR(url, fetcher);
  if (userError) return <div>Failed to load Dashboard page.</div>;

  // update user's courses
  useEffect(() => {
    if (userData)
      setMyCourses(
        isInstructor ? userData.instructor_courses : userData.student_courses
      );
  }, [userData]);

  return (
    <>
      <CustomHead pageTitle="Dashboard" />
      <Grid container sx={{ height: "100vh" }}>
        <CourseSearch
          netID={netID}
          setFlag={flagHandler}
          myCourses={myCourses}
          isInstructor={isInstructor}
        />
        <MyCourses
          netID={netID}
          setFlag={flagHandler}
          myCourses={myCourses}
          isInstructor={isInstructor}
        />
      </Grid>
    </>
  );
}
