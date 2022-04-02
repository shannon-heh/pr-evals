import { useRouter } from "next/router";
import useSWR from "swr";
import CustomHead from "../../components/CustomHead";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import useCAS from "../../hooks/useCAS";
import { CourseData } from "../../src/Types";
import CourseHead from "../../components/course/CourseHead";
import CourseMainContent from "../../components/course/CourseMainContent";
import { fetcher } from "../../src/Helpers";
import { Container, Grid } from "@mui/material";
import TutorialDialog from "../../components/TutorialDialog";
import {
  InstructorCourseTutorial,
  StudentCourseTutorial,
} from "../../components/TutorialContents";

export default function Course() {
  const { isLoading, netID, isInstructor } = useCAS();

  const router = useRouter();
  const { courseid } = router.query;
  const { data, error } = useSWR(
    courseid ? `/api/course-page-data?courseids=${courseid}` : null,
    fetcher
  );
  const courseData = data ? (data[0] as CourseData) : null;

  if ((data && !courseData) || error)
    return <Error text="Error in fetching course!" />;
  if (isLoading || !data || !netID) return <Loading text="Loading course..." />;

  const courseTitle: string = `${courseData.catalog_title}: ${courseData.course_title}`;

  return (
    <>
      <CustomHead pageTitle={courseTitle} />
      <Container maxWidth="lg">
        <Grid container spacing={1} sx={{ textAlign: "center" }}>
          {/* Top of course page */}
          <CourseHead data={courseData} />
          {/* Main content of course page */}
          <CourseMainContent
            courseID={courseid as string}
            numStudents={courseData.num_students}
          />
          <TutorialDialog dialogTitle="Course Page Tutorial">
            {isInstructor ? (
              <InstructorCourseTutorial title={courseTitle} />
            ) : (
              <StudentCourseTutorial title={courseTitle} />
            )}
          </TutorialDialog>
        </Grid>
      </Container>
    </>
  );
}
