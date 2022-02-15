import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import useSWR from "swr";
import CustomHead from "../../components/CustomHead";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import useCAS from "../../hooks/useCAS";
import { courseData } from "../api/course-page-data";
import CourseHead from "../../components/course/CourseHead";
import CourseMainContent from "../../components/course/CourseMainContent";

export default function Course() {
  const { isLoading, netID } = useCAS();

  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { courseid } = router.query;
  const { data, error } = useSWR(
    courseid ? `/api/course-page-data?courseid=${courseid}` : null,
    fetcher
  );
  const courseData = data as courseData;

  if (error) return <Error text={"Error fetching course!"} />;
  if (isLoading || !data || !netID)
    return <Loading text={"Loading course..."} />;

  return (
    <>
      <CustomHead
        pageTitle={`${courseData.catalogTitle}: ${courseData.courseTitle}`}
      />
      <Grid container spacing={2} sx={{ textAlign: "center" }}>
        {/* Top of course page */}
        <CourseHead data={courseData} />
        {/* Main content of course page */}
        <CourseMainContent />
      </Grid>
    </>
  );
}
