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
import { CourseFormData } from "../../src/Types";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import ConfirmationDialog from "../forms/ConfirmationDialog";
import { useRouter } from "next/router";

type ExportFormData = {
  title: string;
  csvLink: string;
};
type ReleaseFormData = {
  title: string;
  formid: string;
  courseid: string;
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

  // openRelease is true when Release dialog is open
  const [openRelease, setOpenRelease] = useState(false);
  const [releaseForm, setReleaseForm] = useState({
    title: "",
    formid: "",
    courseid: "",
  });

  // store reference to hidden CSV anchor link
  const inputRef = React.useRef(null);
  // flag used to prevent export on mount
  const firstRender = useFirstRender();
  // page router
  const router = useRouter();

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

  // store new data about form to export
  const handleSetExportForm = (form: ExportFormData) => {
    setExportForm(form);
  };

  // when instructor exports responses, click hidden anchor link to trigger csv download
  useEffect(() => {
    // do not download on mount
    if (!firstRender) {
      inputRef.current?.click();
      URL.revokeObjectURL(exportForm.csvLink);
    }
  }, [exportForm]);

  // to open/close Release Dialog
  const handleOpenRelease = () => {
    setOpenRelease(true);
  };
  const handleCloseRelease = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpenRelease(false);
  };
  const handleRelease = () => {
    setOpenRelease(false);
    fetch(
      `/api/release-form?formid=${releaseForm.formid}&courseid=${releaseForm.courseid}`
    ).then((res) => {
      if (res.status == 200) {
        router.reload();
      } else {
        console.log(
          `Failed to release responses for form ${releaseForm.formid} `
        );
      }
    });
  };

  // store data about form to release
  const handleSetReleaseForm = (form: ReleaseFormData) => {
    setReleaseForm(form);
  };

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
                handleSetReleaseForm={handleSetReleaseForm}
                handleOpenRelease={handleOpenRelease}
              />
              <ExportDialog
                openExport={openExport}
                handleCloseExport={handleCloseExport}
                handleButtonCloseExport={handleButtonCloseExport}
                formTitle={exportForm.title}
              />
              <ConfirmationDialog
                title="Confirm Form Release"
                isOpen={openRelease}
                closeDialog={handleCloseRelease}
                handleSubmit={handleRelease}
              >
                Releasing responses for form: {` ${releaseForm.title}`}.
                <br />
                <br />
                By clicking 'Confirm', you will be making this form's responses
                available for all members of the Princeton community. You will
                also be able to export the responses. You will no longer be able
                to edit this form.
              </ConfirmationDialog>
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
          Downloading responses for form: {props.formTitle}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleButtonCloseExport}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

// Actions that instructor can perform on a form
function InstructorActions(props: {
  handleSetExportForm: (form: ExportFormData) => void;
  handleOpenExport: () => void;
  handleSetReleaseForm: (form: ReleaseFormData) => void;
  handleOpenRelease: () => void;
  form: CourseFormData;
  courseID: string;
}) {
  const { form, courseID } = props;
  // handler for when form responses are exported
  const handleExport = () => {
    fetch(`/api/export-responses?formid=${form.form_id}&courseid=${courseID}`)
      .then((res) => {
        return res.status == 200 ? res.text() : null;
        if (res.status == 200) {
          return res.text();
        } else {
          throw `Failed to export responses for form ${form.form_id}`;
        }
      })
      .then((csv) => {
        // open Export dialog
        props.handleOpenExport();
        // create URL representing file
        const csvFile = new Blob([csv], { type: "text/csv" });
        const newCsvLink = URL.createObjectURL(csvFile);
        props.handleSetExportForm({ title: form.title, csvLink: newCsvLink });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRelease = () => {
    props.handleOpenRelease();
    props.handleSetReleaseForm({
      title: form.title,
      formid: form.form_id,
      courseid: courseID,
    });
  };

  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="space-evenly"
      sx={{
        fontSize: 16,
        backgroundColor: form.released ? green[300] : red[300],
        padding: 0.25,
      }}
    >
      {!form.released ? (
        <Tooltip title="Edit Form" arrow>
          <IconButton>
            <EditIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      ) : null}
      {!form.released ? (
        <Tooltip title="Release Responses" arrow>
          <IconButton onClick={handleRelease}>
            <PublishIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      ) : null}
      {form.released ? (
        <Tooltip title="Export Responses" arrow>
          <span>
            <IconButton disabled={!form.released} onClick={handleExport}>
              <VisibilityIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
    </Grid>
  );
}

// Form cards shown to instructors
function InstructorForms(props: {
  forms: CourseFormData[];
  numStudents: number;
  courseID: string;
  handleSetExportForm: (form: ExportFormData) => void;
  handleOpenExport: () => void;
  handleSetReleaseForm: (form: ReleaseFormData) => void;
  handleOpenRelease: () => void;
}) {
  const { forms } = props;
  const formCards = forms.map((form: CourseFormData, i: number) => {
    // text for # and % of responses
    const responseStats = `${form.num_responses} (${
      (form.num_responses / props.numStudents) * 100
    }%) ${pluralize("Responses", form.num_responses)}`;

    // text for form publish & release date
    const publishedDate = `Published ${dateToString(
      new Date(form.time_published)
    )}`;
    const releasedDate = form.time_released
      ? `Released ${dateToString(new Date(form.time_released))}`
      : "";

    return (
      <Grid item key={i} xs={6} sm={4} md={3}>
        <Card variant="outlined">
          <CardContent sx={{ backgroundColor: grey[200], padding: 0 }}>
            <InstructorActions
              handleSetExportForm={props.handleSetExportForm}
              handleOpenExport={props.handleOpenExport}
              handleSetReleaseForm={props.handleSetReleaseForm}
              handleOpenRelease={props.handleOpenRelease}
              form={form}
              courseID={props.courseID}
            />
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
            <Typography
              color="text.secondary"
              sx={{ fontSize: 16, width: "100%", fontStyle: "italic" }}
            >
              {releasedDate}
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
    // text for form submit, publish, & release dates
    const submittedDate = form.time_submitted
      ? `Submitted ${dateToString(new Date(form.time_submitted))}`
      : "Not Submitted";
    const publishedDate = `Published ${dateToString(
      new Date(form.time_published)
    )}`;
    const releasedDate = form.time_released
      ? `Released ${dateToString(new Date(form.time_released))}`
      : "";

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
              <Typography
                color="text.secondary"
                sx={{ fontSize: 16, width: "100%", fontStyle: "italic" }}
              >
                {releasedDate}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    );
  });
  return <>{formCards}</>;
}
