import useSWR from "swr";
import useCAS from "../hooks/useCAS";
import CustomHead from "../components/CustomHead";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import CourseSearch from "../components/dashboard/SearchCourses";
import MyCourses from "../components/dashboard/MyCourses";
import { fetcher } from "../src/Helpers";
import Error from "../components/Error";
import Loading from "../components/Loading";

export default function Dashboard() {
  const { isLoading, netID, isInstructor } = useCAS();
  const [modifyFlag, setFlag] = useState(0); // stores dummy flag to update URl
  const [myCourses, setMyCourses] = useState([]); // stores user's courses

  // handler used by child components to set flag
  function flagHandler() {
    setFlag(modifyFlag + 1);
  }

  // get user's courses from DB
  const url = netID ? `/api/get-user-data?flag=${modifyFlag}` : "";
  let { data: userData, error: userError } = useSWR(url, fetcher);

  // update user's courses
  useEffect(() => {
    if (userData) {
      setMyCourses(
        isInstructor ? userData.instructor_courses : userData.student_courses
      );
    } else {
      setMyCourses([]);
    }
  }, [userData]);

  if (userError) return <Error text="Failed to load Dashboard!" />;
  if (isLoading || !netID) return <Loading text="Loading Dashboard..." />;

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
