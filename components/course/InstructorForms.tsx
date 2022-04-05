import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { dateToString, fetcher, prEvalsTheme } from "../../src/Helpers";
import Grid from "@mui/material/Grid";
import { amber, deepOrange, green, grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import pluralize from "pluralize";
import { CourseFormData } from "../../src/Types";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EmailIcon from "@mui/icons-material/Email";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import ConfirmationDialog from "../forms/ConfirmationDialog";
import { useRouter } from "next/router";
import useSWR from "swr";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";

type ExportFormData = {
  title: string;
  csvLink: string;
};

type ReleaseFormData = {
  title: string;
  formid: string;
  courseid: string;
};

// Form cards shown to instructors
export default function InstructorForms(props: {
  forms: CourseFormData[];
  numStudents: number;
  courseID: string;
}) {
  const { forms } = props;

  // store reference to hidden CSV anchor link
  const inputRef = React.useRef(null);
  // page router
  const router = useRouter();

  /* EXPORT FORM LOGIC */
  // openExport is true when Export dialog is open
  const [openExport, setOpenExport] = useState(false);
  // store title & CSV download link for exported form
  const [exportForm, setExportForm] = useState({ title: "", csvLink: "" });

  // to open/close Export Dialog
  const handleOpenExport = () => {
    setOpenExport(true);
  };
  const handleCloseExport = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    handleButtonCloseExport();
  };
  const handleButtonCloseExport = () => {
    setOpenExport(false);
    setExportForm({ title: "", csvLink: "" });
  };
  // store new data about form to export
  const handleSetExportForm = (form: ExportFormData) => {
    setExportForm(form);
  };
  /* END OF EXPORT FORM LOGIC */

  /*  RELEASE FORM LOGIC */
  // openRelease is true when Release dialog is open
  const [openRelease, setOpenRelease] = useState(false);
  const [releaseForm, setReleaseForm] = useState({
    title: "",
    formid: "",
    courseid: "",
  });

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
        alert(
          `ERROR in releasing responses for this form. Unable to proceed with requested action.`
        );
      }
    });
  };
  // store data about form to release
  const handleSetReleaseForm = (form: ReleaseFormData) => {
    setReleaseForm(form);
  };
  /* END OF RELEASE FORM LOGIC */

  /* EMAIL STUDENTS LOGIC */
  // openEmail is true when Email dialog is open
  const [openEmail, setOpenEmail] = useState(false);
  const [emailForm, setEmailForm] = useState(null);
  const [sampleEmail, setSampleEmail] = useState("");

  // to open/close Email Dialog
  const handleOpenEmail = () => {
    setOpenEmail(true);
  };
  const handleCloseEmail = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    handleButtonCloseEmail();
  };
  const handleButtonCloseEmail = () => {
    setOpenEmail(false);
    setExportForm({ title: "", csvLink: "" });
  };
  const { data: students, error: studentsError } = useSWR(
    `/api/get-students?courseid=${props.courseID}`,
    fetcher
  );
  // construct student emails as csv
  const studentEmails: string = studentsError
    ? "Cannot retrieve student emails."
    : students
        ?.map((name) => {
          return `${name}@princeton.edu`;
        })
        .join(", ");

  // store new data about form to export
  const handleSetEmailForm = (form) => {
    setEmailForm(form);
  };
  useEffect(() => {
    const sampleEmail = emailForm
      ? `Hi students!\n\nIf you haven't already, please fill out the feedback form, titled "${
          emailForm.title
        }". The form is due [DATE] and can be found on on the Forms tab of our course page on pr.evals.\n\nHere's some information about the form, including why your feedback is important to us and how we plan to use it:\n${
          emailForm.description != ""
            ? emailForm.description
            : "[INSERT DESCRIPTION]"
        }\n\nYou can submit only one response and all responses are anonymized. Once released, the responses will be available on the ${
          emailForm.standardized ? "Charts" : "Responses"
        } tab of our course page on pr.evals.\n\nWe appreciate the time you're putting in to provide constructive feedback and help improve our course!`
      : "";
    setSampleEmail(sampleEmail);
  }, [emailForm]);
  /* END OF EMAIL STUDENTS LOGIC */

  // detect requests to export
  useEffect(() => {
    // download valid csv
    if (exportForm.csvLink) {
      inputRef.current?.click();
      URL.revokeObjectURL(exportForm.csvLink);
    }
  }, [exportForm]);

  // construct each form card
  const formCards = forms?.map((form: CourseFormData, i: number) => {
    // text for # and % of responses
    const responseStats = form.published
      ? `${pluralize("Responses", form.num_responses)}: ${
          form.num_responses
        } (${
          props.numStudents !== 0
            ? (form.num_responses / props.numStudents) * 100
            : 0
        }%)`
      : "";

    // text for form created, publish, and released date
    const createdDate = `Cr. ${dateToString(new Date(form.time_created))}`;
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
        <Card
          variant="outlined"
          onClick={() => {
            window.open(`/submit-form/${form.form_id}`, "_blank");
          }}
          sx={{
            transition: "transform .25s",
            borderRadius: 2,
            border: `1px solid ${grey[300]}`,
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
              backgroundColor: prEvalsTheme.palette.secondary.dark,
              padding: 0,
            }}
          >
            <InstructorActions
              handleSetExportForm={handleSetExportForm}
              handleOpenExport={handleOpenExport}
              handleSetReleaseForm={handleSetReleaseForm}
              handleOpenRelease={handleOpenRelease}
              handleOpenEmail={handleOpenEmail}
              handleSetEmailForm={handleSetEmailForm}
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
            {form.released ? (
              <>
                <Typography color="text.secondary" sx={subtextStyles}>
                  {releasedDate}
                </Typography>
                <Typography color="text.secondary" sx={subtextStyles}>
                  {publishedDate}
                </Typography>
              </>
            ) : form.published ? (
              <Typography color="text.secondary" sx={subtextStyles}>
                {publishedDate}
              </Typography>
            ) : (
              <Typography color="text.secondary" sx={subtextStyles}>
                {createdDate}
              </Typography>
            )}
            <Typography
              color="text.secondary"
              sx={{ ...subtextStyles, fontWeight: "bold" }}
            >
              {responseStats}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  });

  return (
    <>
      <a
        download={`${props.courseID}-${new Date().toUTCString()}`}
        href={exportForm.csvLink}
        ref={inputRef}
        hidden
      />
      {formCards}
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
        available to all members of the Princeton community. Student identities
        will remain anonymous. You will also be able to export this form's
        responses. Releasing responses is irreversible.
      </ConfirmationDialog>
      <EmailDialog
        openEmail={openEmail}
        handleCloseEmail={handleCloseEmail}
        handleButtonCloseEmail={handleButtonCloseEmail}
        studentEmails={studentEmails}
        sampleEmail={sampleEmail}
      />
    </>
  );
}

// Actions that instructor can perform on a form
function InstructorActions(props: {
  handleSetExportForm: (form: ExportFormData) => void;
  handleOpenExport: () => void;
  handleSetReleaseForm: (form: ReleaseFormData) => void;
  handleOpenRelease: () => void;
  handleOpenEmail: () => void;
  handleSetEmailForm: (form) => void;
  form: CourseFormData;
  courseID: string;
}) {
  const { form, courseID } = props;

  // handler for when form responses are exported
  const handleExport = () => {
    fetch(`/api/export-responses?formid=${form.form_id}&courseid=${courseID}`)
      .then((res) => {
        if (res.status == 200) {
          return res.text();
        } else {
          throw `ERROR in exporting responses for this form. Unable to proceed with requested action.`;
        }
      })
      .then((csv: string) => {
        // open Export dialog
        props.handleOpenExport();
        // create URL representing file
        const csvFile = new Blob([csv], { type: "text/csv" });
        const newCsvLink = URL.createObjectURL(csvFile);
        props.handleSetExportForm({ title: form.title, csvLink: newCsvLink });
      })
      .catch((err) => {
        alert(err);
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

  const handleEmail = () => {
    props.handleOpenEmail();
    props.handleSetEmailForm({
      title: form.title,
      description: form.description,
      courseid: courseID,
      standardized: form.standardized,
    });
  };

  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="space-evenly"
      sx={{
        fontSize: 16,
        backgroundColor: form.released
          ? green[600]
          : form.published
          ? amber[600]
          : deepOrange[800],
        padding: 0.25,
      }}
    >
      {form.released ? (
        <>
          <Tooltip title="Export Responses" arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleExport();
              }}
            >
              <VisibilityIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </>
      ) : form.published ? (
        <Grid container item flexDirection="row" justifyContent="space-evenly">
          <Grid>
            <Tooltip title="Release Responses" arrow>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRelease();
                }}
              >
                <PublishIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid>
            <Tooltip title="Email Reminder" arrow>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmail();
                }}
              >
                <EmailIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      ) : (
        <Tooltip title="Edit Form" arrow>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/edit-form/${form.form_id}`, "_blank");
            }}
          >
            <EditIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </Grid>
  );
}

function EmailDialog(props: {
  openEmail: boolean;
  studentEmails: string;
  sampleEmail: string;
  handleCloseEmail: (e, reason) => void;
  handleButtonCloseEmail: () => void;
}) {
  return (
    <Dialog
      open={props.openEmail}
      onClose={props.handleCloseEmail}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Email Reminder to Students</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography sx={{ fontWeight: "bold" }}>
            Student Emails &nbsp;
          </Typography>
          <CopyToClipboard text={props.studentEmails}>
            <Tooltip title="Copy Emails" arrow>
              <IconButton>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        </Box>
        <Typography sx={{ fontStyle: "italic" }}>
          {props.studentEmails}
        </Typography>
        <br />
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography sx={{ fontWeight: "bold" }}>
            Sample Message&nbsp;
          </Typography>
          <CopyToClipboard text={props.sampleEmail}>
            <Tooltip title="Copy Message" arrow>
              <IconButton>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        </Box>
        <Typography sx={{ whiteSpace: "pre-line" }}>
          {props.sampleEmail}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleButtonCloseEmail} autoFocus>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Dialog shown when form responses are exported
function ExportDialog(props: {
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
        <DialogContentText>
          Downloading responses for form: {props.formTitle}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleButtonCloseExport}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
