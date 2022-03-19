import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import useCAS from "../../hooks/useCAS";
import { dateToString, fetcher } from "../../src/Helpers";
import Grid from "@mui/material/Grid";
import { red, green, blue, grey } from "@mui/material/colors";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import pluralize from "pluralize";
import NewFormActions from "./NewFormActions";
import { CourseFormData, FormMetadata } from "../../src/Types";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

type ExportFormData = {
  title: string;
  csvLink: string;
};

// Result is initially true, then remains false after first render
export function useFirstRender() {
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);
  return firstRender.current;
}

export default function Forms(props: {
  courseID: string;
  numStudents: number;
}) {
  const { netID, isInstructor } = useCAS();

  // openExport is true when Export dialog is open
  const [openExport, setOpenExport] = useState(false);
  // store title & CSV download link for exported form
  const [exportForm, setExportForm] = useState({ title: "", csvLink: "" });

  // store reference to hidden CSV anchor link
  const inputRef = React.useRef(null);
  // flag used to prevent export on mount
  const firstRender = useFirstRender();

  // to open/close Export Dialog
  const handleOpenExport = () => {
    setOpenExport(true);
  };
  const handleCloseExport = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpenExport(false);
  };
  const handleButtonCloseExport = () => {
    setOpenExport(false);
  };

  // store new data about exported form
  const handleSetExportForm = (form: ExportFormData) => {
    setExportForm(form);
  };

  // when instructor exports repsonses, click hidden anchor link to trigger csv download
  useEffect(() => {
    // do not download on mount
    if (!firstRender) {
      inputRef.current?.click();
      URL.revokeObjectURL(exportForm.csvLink);
    }
  }, [exportForm]);

  // get current time for csv file name
  const currTime: string = new Date().toUTCString();

  // get data about each course form
  const formsUrl = `/api/get-course-forms?courseid=${props.courseID}&netid=${netID}`;
  let { data: formsData, error: formsError } = useSWR(formsUrl, fetcher);
  if (formsError) return <div>Failed to load Forms.</div>;

  return (
    <Grid container flexDirection="column" alignItems="center" py={2}>
      {isInstructor ? <NewFormActions courseid={props.courseID} /> : null}
      <Grid container flexDirection="row" spacing={2}>
        {formsData ? (
          isInstructor ? (
            <>
              <a
                download={`${props.courseID}-${currTime}`}
                href={exportForm.csvLink}
                ref={inputRef}
                hidden
              />
              <InstructorForms
                forms={formsData}
                courseID={props.courseID}
                numStudents={props.numStudents}
                handleSetExportForm={handleSetExportForm}
                handleOpenExport={handleOpenExport}
              />
              <ExportDialog
                openExport={openExport}
                handleCloseExport={handleCloseExport}
                handleButtonCloseExport={handleButtonCloseExport}
                formTitle={exportForm.title}
              />
            </>
          ) : (
            <StudentForms forms={formsData} />
          )
        ) : null}
      </Grid>
    </Grid>
  );
}

// Dialog shown when form responses are exported
export function ExportDialog(props: {
  openExport: boolean;
  formTitle: string;
  handleCloseExport: (e, reason) => void;
  handleButtonCloseExport: () => void;
}) {
  return (
    <Dialog
      open={props.openExport}
      onClose={props.handleCloseExport}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Export Responses to CSV</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Downloading responses for form:{" "}
          <Typography sx={{ fontWeight: "bold" }}>{props.formTitle}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleButtonCloseExport}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

// Form cards shown to instructors
function InstructorForms(props: {
  forms: CourseFormData[];
  numStudents: number;
  courseID: string;
  handleSetExportForm: (form: ExportFormData) => void;
  handleOpenExport: () => void;
}) {
  const { forms } = props;

  // handler for when form responses are exported
  const handleExport = (form: CourseFormData) => {
    props.handleOpenExport(); // open Export dialog
    fetch(
      `/api/export-responses?formid=${form.form_id}&courseid=${props.courseID}`
    )
      .then((res) => {
        return res.text();
      })
      .then((csv) => {
        // create URL representing file
        const csvFile = new Blob([csv], { type: "text/csv" });
        const newCsvLink = URL.createObjectURL(csvFile);
        props.handleSetExportForm({ title: form.title, csvLink: newCsvLink });
      });
  };

  const formCards = forms.map((form: CourseFormData, i: number) => {
    // text for # and % of responses
    const responseStats = `${form.num_responses} (${
      (form.num_responses / props.numStudents) * 100
    }%) ${pluralize("Responses", form.num_responses)}`;

    // text for form publish date
    const publishedDate = ` Published ${dateToString(
      new Date(form.time_published)
    )}`;

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
                padding: 0.25,
              }}
            >
              <Tooltip title="Edit Form" arrow>
                <IconButton>
                  <EditIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Responses" arrow>
                <IconButton
                  onClick={() => {
                    // export form responses when button is clicked
                    handleExport(form);
                  }}
                >
                  <VisibilityIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Release Responses" arrow>
                <IconButton>
                  <PublishIcon fontSize="large" />
                </IconButton>
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
