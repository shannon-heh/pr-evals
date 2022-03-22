import { fetcher, getFullTitle } from "../../src/Helpers";
import { NextRouter, useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
import BlockAction from "../../components/BlockAction";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { blue, grey } from "@mui/material/colors";
import CustomHead from "../../components/CustomHead";
import { CourseData, Question, QuestionMetadata } from "../../src/Types";
import AddQuestionDialog from "../../components/forms/add-question/AddQuestionDialog";
import ShortTextInput from "../../components/forms/question-types/ShortTextInput";
import LongTextInput from "../../components/forms/question-types/LongTextInput";
import SingleSelectInput from "../../components/forms/question-types/SingleSelectInput";
import MultiSelectInput from "../../components/forms/question-types/MultiSelectInput";
import SliderInput from "../../components/forms/question-types/SliderInput";
import RatingInput from "../../components/forms/question-types/RatingInput";
import Button from "@mui/material/Button";
import ConfirmationDialog from "../../components/forms/ConfirmationDialog";

// Page for instructor to edit a form
export default function EditForm() {
  // stores list of questions & their metadata
  const [questions, setQuestions] = useState([]);
  // keep track of question ID
  const [qid, setQid] = useState(0);

  // open is true when corresponding dialog is open
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);

  // open / close Add Question dialog
  const openAddDialog = () => {
    setOpenAdd(true);
  };
  const closeAddDialog = () => {
    setOpenAdd(false);
  };

  // open / close Edit Confirmation dialog
  const openEditDialog = () => {
    setOpenEdit(true);
  };
  const closeEditDialog = () => {
    setOpenEdit(false);
  };

  // open / close Publish Confirmation dialog
  const openPublishDialog = () => {
    setOpenPublish(true);
  };
  const closePublishDialog = () => {
    setOpenPublish(false);
  };

  const router: NextRouter = useRouter();
  const formid: string = router.query.formid as string;
  const courseid: string = formid ? formid.split("-")[0].slice(4) : "";

  // updates form metadata in DB
  const handleSubmit = () => {
    closeEditDialog();
    fetch("/api/edit-form", {
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
          `ERROR in editing this form. Unable to proceed with requested action.`
        );
      }
    });
  };

  // sets form as published
  const handlePublish = () => {
    closePublishDialog();
    fetch(`/api/publish-form?formid=${formid}&courseid=${courseid}`).then(
      (res: Response) => {
        if (res.status == 200) {
          // redirect to course page when done
          router.push(`/course/${courseid}`);
        } else {
          alert(
            `ERROR in publishing this form. Unable to proceed with requested action.`
          );
        }
      }
    );
  };

  // get existing form metadata
  const url: string = formid ? `/api/get-form-metadata?formid=${formid}` : null;
  const { data: formData, error: formError } = useSWR(url, fetcher);

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

  // set state to existing questions
  useEffect(() => {
    setQuestions(formData?.questions ?? []);
    setQid(formData?.questions.length ?? 0);
  }, [formData]);

  // handle error & loading
  if ((courseData_ && !courseData) || formError || courseError)
    return <Error text="Failed to load form editing page!" />;
  if (!formData || !courseData_) return <Loading />;

  // cannot edit form if already published
  if (formData?.published) {
    return (
      <BlockAction pageTitle="Edit Form">
        You have already published this form. You can no longer edit its
        questions.
      </BlockAction>
    );
  }

  return (
    <>
      <CustomHead pageTitle={"Edit Form"} />
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
              sx={{ px: 4, width: "30%" }}
            >
              Add Question
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={openEditDialog}
              sx={{ px: 4, width: "30%" }}
            >
              Done Editing
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={openPublishDialog}
              sx={{ px: 4, width: "30%" }}
            >
              Publish Form
            </Button>
            <AddQuestionDialog
              addQuestion={addQuestion}
              isOpen={openAdd}
              closeDialog={closeAddDialog}
            />
            <ConfirmationDialog
              title={"Are you done editing your form?"}
              isOpen={openEdit}
              closeDialog={closeEditDialog}
              handleSubmit={handleSubmit}
            >
              Click Cancel to continue editing.
            </ConfirmationDialog>
            <ConfirmationDialog
              title={"Are you ready to publish your form?"}
              isOpen={openPublish}
              closeDialog={closePublishDialog}
              handleSubmit={handlePublish}
            >
              By clicking 'Confirm', you will be publishing this form, opening
              it for submission from students in your course. You will no longer
              be able to edit the form. <br />
              <br />
              Click Cancel to continue editing.
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
