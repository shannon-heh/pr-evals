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
import { red, green, amber, grey, blue } from "@mui/material/colors";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import pluralize from "pluralize";
import FormsActions from "./FormsActions";
import { CourseFormData, FormMetadata, FormStatus } from "../../src/Types";
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

  // stores data for displayed forms
  const [forms, setForms] = useState([]);

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

  // get current time for csv file name
  const currTime: string = new Date().toUTCString();

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
            <>
              <a
                download={`${props.courseID}-${currTime}`}
                href={exportForm.csvLink}
                ref={inputRef}
                hidden
              />
              <InstructorForms
                forms={forms}
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
                available to all members of the Princeton community. Student
                identities will remain anonymous. You will also be able to
                export this form's responses, but will no longer be able to edit
                its questions.
              </ConfirmationDialog>
            </>
          ) : (
            <StudentForms forms={forms} />
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

  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="space-evenly"
      sx={{
        fontSize: 16,
        backgroundColor: form.released
          ? green[300]
          : form.published
          ? amber[300]
          : red[300],
        padding: 0.25,
      }}
    >
      {form.released ? (
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
      ) : form.published ? (
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

  const formCards = forms?.map((form: CourseFormData, i: number) => {
    // text for # and % of responses
    const responseStats = form.published
      ? `${pluralize("Responses", form.num_responses)}: ${
          form.num_responses
        } (${(form.num_responses / props.numStudents) * 100}%)`
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
            boxShadow:
              "rgba(0, 0, 0, 0.03) 0px 0px 16px, rgba(0, 0, 0, 0.03) 0px 0px 16px;",
            "&:hover": {
              transform: "scale3d(1.05, 1.05, 1)",
              cursor: "pointer",
            },
          }}
        >
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

  return <>{formCards}</>;
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
