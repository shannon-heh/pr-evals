import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useFormik } from "formik";
import useCAS from "../../hooks/useCAS";
import * as yup from "yup";
import { useRouter } from "next/router";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormStatus } from "../../src/Types";
import Grid from "@mui/material/Grid";

// Actions on course page for instructor to start a new form
export default function FormsActions(props: {
  courseid: string;
  handleSortForms?: (status: FormStatus) => void;
}) {
  const { netID } = useCAS();
  const router = useRouter();

  // for open/close dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    resetFormFields();
    setOpen(false);
  };
  const handleButtonClose = () => {
    resetFormFields();
    setOpen(false);
  };

  // reset title & description fields
  const resetFormFields = () => {
    formik.setFieldValue("title", "");
    formik.setFieldValue("description", "");
  };

  // validate input fields
  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .required("Required field")
      .max(100, "Max 100 characters"),
    description: yup
      .string()
      .trim()
      .required("Required field")
      .max(2000, "Max 2000 characters"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      sort: FormStatus.Released,
    },
    validationSchema,
    onSubmit: (values) => {
      const { title, description } = values;

      // create new form with given title & description
      fetch("/api/start-form", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseid: props.courseid,
          netid: netID,
          title: title,
          description: description,
        }),
      }).then(async (res: Response) => {
        if (res.status == 200) {
          const data: { formid: string } = await res.json();
          const formid: string = data.formid;

          // route to new form page
          router.push(`/edit-form/${formid}`);
        } else {
          alert(
            `ERROR in starting a new form. Unable to proceed with requested action.`
          );
        }
      });
    },
  });

  return (
    <>
      <Grid
        container
        item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Grid item sm={4} xs={2}></Grid>
        <Grid item sm={4} xs={8}>
          <Button
            color="info"
            type="submit"
            variant="contained"
            onClick={handleClickOpen}
            sx={{
              px: 4,
              width: "100%",
              height: "50px",
            }}
          >
            Publish New Form
          </Button>
        </Grid>
        <Grid
          container
          item
          sm={4}
          xs={2}
          flexDirection="row"
          justifyContent="end"
        >
          <FormControl sx={{ height: "50px" }}>
            <InputLabel id="select-label">Sort By (Desc.)</InputLabel>
            <Select
              color="secondary"
              labelId="select-label"
              name="sort"
              value={formik.values.sort}
              label="Sort By (Desc.)"
              onChange={(e) => {
                formik.handleChange(e);
                props.handleSortForms(e.target.value as FormStatus);
              }}
            >
              <MenuItem value={FormStatus.Released}>Released</MenuItem>
              <MenuItem value={FormStatus.Published}>Published</MenuItem>
              <MenuItem value={FormStatus.Created}>Created</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Publish Feedback Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set a title and description for your feedback form.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="form-title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            type="text"
            fullWidth
            variant="standard"
            autoComplete="off"
            helperText={
              formik.touched.title && formik.errors.title
                ? formik.errors.title
                : null
            }
            FormHelperTextProps={{
              style: { color: "red" },
            }}
            required
          />
          <TextField
            margin="dense"
            id="form-description"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            type="text"
            multiline
            minRows="2"
            maxRows="6"
            fullWidth
            variant="standard"
            autoComplete="off"
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : "Please specify the purpose of this form & how student feedback will be used. Studies have shown that clarifying this will increase response rates and encourage students to provide more constructive feedback."
            }
            FormHelperTextProps={{
              style: {
                color:
                  formik.touched.description && formik.errors.description
                    ? "red"
                    : "black",
                marginTop: "0.5em",
                lineHeight: "1.25em",
              },
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleButtonClose}>Cancel</Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
