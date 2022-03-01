import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import AddQuestionInput from "./AddQuestionInput";
import Grid from "@mui/material/Grid";
import { Question, QuestionMetadata, QuestionProps } from "../../../src/Types";

/* Add Question Dialog is shown when user clicks the Add Question
button on the New Form page. This dialog is the interface for 
instructors to add a new question to their form. */
export default function AddQuestionDialog(props) {
  // question type code
  const [type, setType] = useState(null);
  // set of options for this question
  const [options, setOptions] = useState({});

  // passed down to children component to
  // set options for current question type
  const handleSetOptions = (newOptions: QuestionProps) => {
    setOptions(newOptions);
  };

  // close dialog when user clicks outside of dialog
  const handleClose = (e, reason: string) => {
    if (reason && (reason == "backdropClick" || reason == "escapeKeyDown"))
      return;
    handleButtonClose();
  };

  // close dialog when user clicks Cancel
  const handleButtonClose = () => {
    props.closeDialog();
    setType(null);
    setOptions({});
    formik.resetForm();
  };

  // when user changes question type
  const handleTypeChange = (e) => {
    const typeCode: number = e.target.value;
    formik.setFieldValue("type", typeCode);
    setType(typeCode);
    setOptions({});
  };

  // input validation
  const validationSchema = yup.object({
    question: yup
      .string()
      .trim()
      .required("Required field")
      .max(500, "Max 500 characters"),
    description: yup.string().max(2000, "Max 2000 characters"),
  });

  const formik = useFormik({
    initialValues: {
      question: "",
      description: "",
      type: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // when user clicks Done to add new question
      delete options["set"];
      const question: QuestionMetadata = {
        type: type,
        question: values.question,
        description: values.description,
        ...options,
      };
      props.addQuestion(question);
      handleButtonClose();
    },
  });

  return (
    <>
      <Dialog open={props.isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Question</DialogTitle>
        <DialogContent>
          <Grid container flexDirection="column">
            <Grid container item flexDirection="column">
              <TextField
                autoFocus
                margin="dense"
                id="new-question"
                name="question"
                label="Question"
                value={formik.values.question}
                onChange={formik.handleChange}
                type="text"
                fullWidth
                variant="filled"
                autoComplete="off"
                helperText={
                  formik.touched.question && formik.errors.question
                    ? formik.errors.question
                    : null
                }
                FormHelperTextProps={{
                  style: { color: "red" },
                }}
                required
              />
              <TextField
                margin="dense"
                id="new-description"
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                type="text"
                multiline
                fullWidth
                maxRows={5}
                variant="filled"
                autoComplete="off"
                helperText={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : null
                }
                FormHelperTextProps={{
                  style: { color: "red" },
                }}
              />
              <InputLabel id="select-type-label" sx={{ mt: 2, mb: 0.5 }}>
                Question Type
              </InputLabel>
              <Select
                labelId="select-type-label"
                id="select-type"
                name="type"
                value={formik.values.type}
                label="Question Type"
                onChange={handleTypeChange}
                fullWidth
              >
                <MenuItem value={Question.ShortText}>Short Text</MenuItem>
                <MenuItem value={Question.LongText}>Long Text</MenuItem>
                <MenuItem value={Question.SingleSelect}>Single-Select</MenuItem>
                <MenuItem value={Question.MultiSelect}>Multi-Select</MenuItem>
                <MenuItem value={Question.Slider}>Slider</MenuItem>
                <MenuItem value={Question.Rating}>Rating</MenuItem>
              </Select>
            </Grid>
            <Grid container item flexDirection="column">
              <AddQuestionInput type={type} setOptions={handleSetOptions} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleButtonClose}>Cancel</Button>
          <Button
            type="submit"
            onClick={(e) => {
              formik.handleSubmit();
            }}
            disabled={
              // diable Done button if no options set
              Object.keys(options).length == 0
            }
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
