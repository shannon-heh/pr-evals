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

export default function CourseForms(props: { courseid: string }) {
  return (
    <>
      <CreateFormDialog courseid={props.courseid} />
    </>
  );
}

function CreateFormDialog(props: { courseid: string }) {
  const { netID }: { netID: string } = useCAS();
  const router = useRouter();

  // for open/close dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
  };
  const handleButtonClose = () => {
    setOpen(false);
  };

  // validate input fields
  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .required("Required field")
      .max(100, "Max 100 characters"),
    description: yup.string().max(1000, "Max 1000 characters"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { title, description } = values;

      // create new form with given title & description
      fetch("/api/create-form", {
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
          router.push(`/new-form/${formid}`);
        }
      });
    },
  });

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Form
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Feedback Form</DialogTitle>
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
            fullWidth
            variant="standard"
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : null
            }
            FormHelperTextProps={{
              style: { color: "red" },
            }}
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
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
