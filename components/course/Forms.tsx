import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import useCAS from "../../hooks/useCAS";
import {
  dateToString,
  fetcher,
  sortByCreated,
  sortByPublished,
  sortByReleased,
} from "../../src/Helpers";
import Grid from "@mui/material/Grid";
import { red, green, grey, blue } from "@mui/material/colors";
import Link from "@mui/material/Link";
import FormsActions from "./FormsActions";
import { CourseFormData, FormStatus } from "../../src/Types";
import { useEffect, useState } from "react";
import InstructorForms from "./InstructorForms";

export default function Forms(props: {
  courseID: string;
  numStudents: number;
}) {
  const { netID, isInstructor } = useCAS();

  // stores data for displayed forms
  const [forms, setForms] = useState([]);

  // get data about each course form
  const formsUrl = `/api/get-course-forms?courseid=${props.courseID}&netid=${netID}`;
  let { data: formsData, error: formsError } = useSWR(formsUrl, fetcher);

  useEffect(() => {
    setForms(formsData);
  }, [formsData]);

  if (formsError)
    return <Typography my={2}>Failed to load this course's forms.</Typography>;

  // sort forms on course page based on status selected
  const handleSortForms = (status: FormStatus) => {
    let newForms = forms;
    if (status == FormStatus.Created) {
      // reverse chron created order
      newForms = [...forms].sort(sortByCreated);
    } else if (status == FormStatus.Published) {
      // reverse chron published order
      newForms = [...forms].sort(sortByPublished);
    } else if (status == FormStatus.Released) {
      // reverse chron released order
      newForms = [...forms].sort(sortByReleased);
    }
    setForms(newForms);
  };

  return (
    <Grid container flexDirection="column" alignItems="center" py={2}>
      {isInstructor ? (
        <FormsActions
          courseid={props.courseID}
          handleSortForms={handleSortForms}
        />
      ) : null}
      <Grid container flexDirection="row" spacing={2}>
        {formsData ? (
          isInstructor ? (
            <InstructorForms
              forms={forms}
              courseID={props.courseID}
              numStudents={props.numStudents}
            />
          ) : (
            <StudentForms forms={forms} />
          )
        ) : null}
      </Grid>
    </Grid>
  );
}

// Form cards shown to students
function StudentForms(props: { forms: CourseFormData[] }) {
  const { forms } = props;
  const formCards = forms?.map((form: CourseFormData, i: number) => {
    if (!form.published) return;

    // text for form submit, publish, & release dates
    const submittedDate = form.time_submitted
      ? `Submitted ${dateToString(new Date(form.time_submitted))}`
      : "Not Submitted";
    const publishedDate = form.published
      ? `Pub. ${dateToString(new Date(form.time_published))}`
      : "";
    const releasedDate = form.released
      ? `Rel. ${dateToString(new Date(form.time_released))}`
      : "";

    // for subtext below title name
    const subtextStyles = { fontSize: 16, width: "100%" };

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
              boxShadow:
                "rgba(0, 0, 0, 0.03) 0px 0px 16px, rgba(0, 0, 0, 0.03) 0px 0px 16px;",
              "&:hover": {
                transform: "scale3d(1.05, 1.05, 1)",
                cursor: "pointer",
              },
            }}
          >
            <CardContent
              sx={{
                backgroundColor: form.standardized ? blue[100] : grey[200],
                padding: 0,
              }}
            >
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 16,
                  backgroundColor: form.completed
                    ? green[300]
                    : form.released
                    ? grey[500]
                    : red[300],
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
              {form.released ? (
                <Typography color="text.secondary" sx={subtextStyles}>
                  {releasedDate}
                </Typography>
              ) : (
                <Typography color="text.secondary" sx={subtextStyles}>
                  {publishedDate}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Link>
      </Grid>
    );
  });
  return (
    <>
      {forms?.some((form) => form.published) ? (
        formCards
      ) : (
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          mt={2}
          mx="auto"
          color={red[500]}
        >
          This course doesn't have any released forms (yet)!
        </Typography>
      )}
    </>
  );
}
