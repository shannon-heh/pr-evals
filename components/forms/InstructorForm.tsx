import { fetcher, getFullTitle } from "../../src/Helpers";
import { NextRouter, useRouter } from "next/router";
import useSWR from "swr";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { blue, grey } from "@mui/material/colors";
import CustomHead from "../../components/CustomHead";
import { CourseData, Question, QuestionMetadata } from "../../src/Types";
import AddQuestionDialog from "../../components/forms/add-question/AddQuestionDialog";
import { useEffect, useState } from "react";
import ShortTextInput from "../../components/forms/question-types/ShortTextInput";
import LongTextInput from "../../components/forms/question-types/LongTextInput";
import SingleSelectInput from "../../components/forms/question-types/SingleSelectInput";
import MultiSelectInput from "../../components/forms/question-types/MultiSelectInput";
import SliderInput from "../../components/forms/question-types/SliderInput";
import RatingInput from "../../components/forms/question-types/RatingInput";
import Button from "@mui/material/Button";
import ConfirmationDialog from "../../components/forms/ConfirmationDialog";
import BlockAction from "../../components/BlockAction";

// Page for instructor to edit a form
export default function InstructorForm(props) {
  const {
    router,
    formid,
    questions,
    setQuestions,
    qid,
    setQid,
    formData,
    formError,
    editMode,
  } = props;
  // open is true when Add/Confirm dialog is open
  const [openAdd, setOpenAdd] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  ("");
  // open / close Add Question dialog
  const openAddDialog = () => {
    setOpenAdd(true);
  };
  const closeAddDialog = () => {
    setOpenAdd(false);
  };

  // open / close Confirmation dialog
  const openConfirmDialog = () => {
    setOpenConfirm(true);
  };
  const closeConfirmDialog = () => {
    setOpenConfirm(false);
  };

  const courseid: string = formid ? formid.split("-")[0].slice(4) : "";

  // updates form metadata in DB when instructor publishes form
  const handleSubmit = () => {
    closeConfirmDialog();
    fetch("/api/create-form", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formid: formid,
        questions: questions,
        courseid: courseid,
      }),
    }).then((res: Response) => {
      if (res.status == 200) {
        // redirect to course page when done
        router.push(`/course/${courseid}`);
      } else {
        alert(
          `ERROR in publishing this form. Unable to proceed with requested action.`
        );
      }
    });
  };

  // get course data to display
  const { data: courseData_, error: courseError } = useSWR(
    courseid ? `/api/course-page-data?courseids=${courseid}` : null,
    fetcher
  );
  const courseData = courseData_ ? (courseData_[0] as CourseData) : null;

  // updates question metadata in DB when instructor adds new question
  const addQuestion = (newQuestion: QuestionMetadata) => {
    newQuestion["q_id"] = qid;
    setQid(qid + 1);
    setQuestions([...questions, newQuestion]);
  };

  if ((courseData_ && !courseData) || formError || courseError)
    return <Error text="Failed to load form editing page!" />;
  if (!formData || !courseData_) return <Loading />;

  return (
    <>
      <CustomHead pageTitle={editMode ? "Edit Form" : "Publish Form"} />
      <Grid
        container
        flexDirection="row"
        height="100vh"
        justifyContent="center"
      >
        <Grid
          item
          container
          flexDirection="column"
          sx={{ width: "60%", py: 3, px: 5, backgroundColor: blue[100] }}
        >
          <Grid>
            <Typography variant="h5" fontWeight="500">
              {getFullTitle(
                courseData.catalog_title,
                courseData.crosslisting_catalog_titles
              )}
              : {courseData.course_title}
            </Typography>
          </Grid>
          <Grid item container flexDirection="column" sx={{ py: 1 }}>
            <Typography variant="h2">{formData.title}</Typography>
            <Typography>{formData.description}</Typography>
          </Grid>
          <Grid
            item
            container
            flexDirection="row"
            sx={{ py: 2 }}
            justifyContent="space-evenly"
          >
            <Button
              variant="contained"
              onClick={openAddDialog}
              sx={{ px: 4, width: "40%" }}
            >
              Add Question
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={openConfirmDialog}
              sx={{ px: 4, width: "40%" }}
            >
              {editMode ? "Done Editing" : "Publish Form"}
            </Button>
            <AddQuestionDialog
              addQuestion={addQuestion}
              isOpen={openAdd}
              closeDialog={closeAddDialog}
            />
            <ConfirmationDialog
              title={"Are you ready to publish your form?"}
              isOpen={openConfirm}
              closeDialog={closeConfirmDialog}
              handleSubmit={handleSubmit}
            >
              Click Cancel to continue editing your form.
            </ConfirmationDialog>
          </Grid>
          <Grid item container flexDirection="column" sx={{ pb: 2 }}>
            {questions.map((q: QuestionMetadata, i: number) => {
              let input = null;
              if (q.type == Question.ShortText) {
                input = <ShortTextInput />;
              } else if (q.type == Question.LongText) {
                input = <LongTextInput />;
              } else if (q.type == Question.SingleSelect) {
                input = <SingleSelectInput options={q.options} />;
              } else if (q.type == Question.MultiSelect) {
                input = <MultiSelectInput options={q.options} />;
              } else if (q.type == Question.Slider) {
                input = (
                  <SliderInput
                    min={q.min}
                    max={q.max}
                    step={q.step}
                    marks={q.marks}
                  />
                );
              } else if (q.type == Question.Rating) {
                input = <RatingInput max={q.max} precision={q.precision} />;
              }
              return (
                <Grid
                  item
                  container
                  key={i}
                  sx={{
                    my: 1.5,
                    p: 1.5,
                    backgroundColor: grey[50],
                    borderRadius: "8px",
                    flexDirection: "column",
                    pb: q.type == Question.Slider ? 4.5 : 1.5,
                  }}
                >
                  <Typography variant="body1">{q.question}</Typography>
                  <Typography variant="caption">{q.description}</Typography>
                  {input}
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
