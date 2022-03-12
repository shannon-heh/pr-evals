import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import useCAS from "../../hooks/useCAS";
import { fetcher } from "../../src/Helpers";
import Grid from "@mui/material/Grid";
import { red, green, blue, grey } from "@mui/material/colors";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import { Tooltip } from "@mui/material";
import pluralize from "pluralize";
import NewFormActions from "./NewFormActions";
import { CourseFormData } from "../../src/Types";

export default function Forms(props: {
  courseID: string;
  numStudents: number;
}) {
  const { netID, isInstructor } = useCAS();

  // get data about each course form
  const formsUrl = `/api/get-course-forms?courseid=${props.courseID}&netid=${netID}`;
  let { data: formsData, error: formsError } = useSWR(formsUrl, fetcher);
  if (formsError) return <div>Failed to load Forms.</div>;

  if (formsData) formsData.reverse();

  return (
    <Grid container flexDirection="column" alignItems="center" py={2}>
      {isInstructor ? <NewFormActions courseid={props.courseID} /> : null}
      <Grid container flexDirection="row" spacing={2}>
        {formsData ? (
          isInstructor ? (
            <InstructorForms
              forms={formsData}
              numStudents={props.numStudents}
            />
          ) : (
            <StudentForms forms={formsData} />
          )
        ) : null}
      </Grid>
    </Grid>
  );
}

// converts date object to MM/DD/YYYY
function dateToString(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// Form cards shown to instructors
function InstructorForms(props: {
  forms: CourseFormData[];
  numStudents: number;
}) {
  const { forms } = props;
  const formCards = forms.map((form: CourseFormData, i: number) => {
    // text for # and % of responses
    const responseStats = `${form.num_responses} (${
      (form.num_responses / props.numStudents) * 100
    }%) ${pluralize("Responses", form.num_responses)}`;

    // text for form publish date
    const publishedDate = ` Published ${dateToString(
      new Date(form.time_published)
    )}`;

    const hoverStyles = {
      transition: "transform .25s",
      "&:hover": {
        transform: "scale3d(1.15, 1.15, 1)",
        cursor: "pointer",
      },
    };

    return (
      <Grid item key={i} xs={6} sm={4} md={3}>
        <Card variant="outlined">
          <CardContent sx={{ backgroundColor: grey[200], padding: 0 }}>
            <Grid
              container
              flexDirection="row"
              justifyContent="space-evenly"
              sx={{
                fontSize: 16,
                backgroundColor: blue[300],
                padding: 1,
              }}
            >
              <Tooltip title="Edit Form" arrow>
                <EditIcon fontSize="large" sx={hoverStyles} />
              </Tooltip>
              <Tooltip title="View Responses" arrow>
                <VisibilityIcon fontSize="large" sx={hoverStyles} />
              </Tooltip>
              <Tooltip title="Release Responses" arrow>
                <PublishIcon fontSize="large" sx={hoverStyles} />
              </Tooltip>
            </Grid>
            <Typography
              variant="h4"
              component="div"
              sx={{
                padding: 1.5,
                lineHeight: "1.25em",
                maxHeight: "3.5em",
                overflowY: "hidden",
                overflowX: "hidden",
                textOverflow: "ellipsis",
                marginBottom: 1,
              }}
            >
              {form.title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 16, width: "100%", fontStyle: "italic" }}
            >
              {responseStats}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 16, width: "100%", fontStyle: "italic" }}
            >
              {publishedDate}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  });

  return <>{formCards}</>;
}

// Form cards shown to students
function StudentForms(props: { forms: CourseFormData[] }) {
  const { forms } = props;
  const formCards = forms.map((form: CourseFormData, i: number) => {
    // text for form submit & publish dates
    const submittedDate = form.time_submitted
      ? `Submitted ${dateToString(new Date(form.time_submitted))}`
      : "Not Submitted";
    const publishedDate = ` Published ${dateToString(
      new Date(form.time_published)
    )}`;

    return (
      <Grid item key={i} xs={6} sm={4} md={3}>
        <Link
          href={`/submit-form/${form.form_id}`}
          underline="none"
          target="_blank"
        >
          <Card
            variant="outlined"
            sx={{
              transition: "transform .25s",
              "&:hover": {
                transform: "scale3d(1.05, 1.05, 1)",
                cursor: "pointer",
              },
            }}
          >
            <CardContent sx={{ backgroundColor: grey[200], padding: 0 }}>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 16,
                  backgroundColor: form.completed ? green[300] : red[300],
                  padding: 1,
                }}
                gutterBottom
              >
                {submittedDate}
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  padding: 1.5,
                  lineHeight: "1.25em",
                  maxHeight: "3.5em",
                  overflowY: "hidden",
                  overflowX: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: 1,
                }}
              >
                {form.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 16, width: "100%", fontStyle: "italic" }}
              >
                {publishedDate}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    );
  });
  return <>{formCards}</>;
}
