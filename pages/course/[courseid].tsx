import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import useSWR from "swr";
import CustomHead from "../../components/CustomHead";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import useCAS from "../../hooks/useCAS";
import { CourseData } from "../../src/Types";
import CourseHead from "../../components/course/CourseHead";
import CourseMainContent from "../../components/course/CourseMainContent";
import Container from "@mui/material/Container";
import { fetcher } from "../../src/Helpers";

export default function Course() {
  const { isLoading, netID } = useCAS();

  const router = useRouter();
  const { courseid } = router.query;
  const { data, error } = useSWR(
    courseid ? `/api/course-page-data?courseids=${courseid}` : null,
    fetcher
  );
  const courseData = data ? (data[0] as CourseData) : null;

  if (error) return <Error text={"Error fetching course!"} />;
  if (isLoading || !data || !netID)
    return <Loading text={"Loading course..."} />;

  return (
    <>
      <CustomHead
        pageTitle={`${courseData?.catalog_title}: ${courseData?.course_title}`}
      />
      <Container maxWidth="lg">
        <Grid container spacing={1} sx={{ textAlign: "center" }}>
          {/* Top of course page */}
          <CourseHead data={courseData} />
          {/* Main content of course page */}
          <CourseMainContent
            courseID={courseid as string}
            numStudents={courseData.num_students}
          />
        </Grid>
      </Container>
    </>
  );
}
