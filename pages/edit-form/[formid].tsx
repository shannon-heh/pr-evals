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
import useCAS from "../../hooks/useCAS";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

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
  const { isInstructor } = useCAS();

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
        publish: true,
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

  // get existing form metadata
  const { data: formData, error: formError } = useSWR(
    formid ? `/api/get-form-metadata?formid=${formid}` : null,
    fetcher
  );

  // get course data to display
  const { data: courseData_, error: courseError } = useSWR(
    courseid ? `/api/course-page-data?courseids=${courseid}` : null,
    fetcher
  );
  const courseData = courseData_ ? (courseData_[0] as CourseData) : null;

  // when instructor adds a new question
  const addQuestion = (newQuestion: QuestionMetadata) => {
    newQuestion["q_id"] = qid;
    setQid(qid + 1);
    setQuestions([...questions, newQuestion]);
  };

  // when instructor deletes a question
  const deleteQuestion = (qId: number) => {
    const newQuestions = questions.filter((q) => {
      return q.q_id != qId;
    });
    setQuestions(newQuestions);
  };

  // set state to existing questions from DB, if any
  useEffect(() => {
    setQuestions(formData?.questions ?? []);
    let maxId: number = 0;
    if (formData?.questions) {
      maxId = Math.max.apply(
        Math,
        formData.questions.map(function (q) {
          return q.q_id;
        })
      );
    }
    setQid(maxId + 1);
  }, [formData]);

  // handle error & loading
  if (!isInstructor) return <Error text="Students cannot access this page." />;
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
          lg={6}
          md={8}
          sx={{ py: 3, px: 5, backgroundColor: blue[100] }}
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
            justifyContent="center"
            spacing={1}
          >
            <Grid item container sm={4} justifyContent="center">
              <Button
                variant="contained"
                onClick={openAddDialog}
                sx={{ px: 4, width: "90%" }}
              >
                Add Question
              </Button>
            </Grid>
            <Grid item container sm={4} justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                onClick={openEditDialog}
                sx={{ px: 4, width: "90%" }}
              >
                Done Editing
              </Button>
            </Grid>
            <Grid item container sm={4} justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                onClick={openPublishDialog}
                sx={{ px: 4, width: "90%" }}
              >
                Publish Form
              </Button>
            </Grid>
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
              Click 'Cancel' to continue editing.
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
              Click 'Cancel' to continue editing.
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
                  <Grid
                    container
                    item
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ flexWrap: "nowrap" }}
                  >
                    <Typography variant="body1" sx={{ overflow: "auto" }}>
                      {q.question}
                    </Typography>
                    <Tooltip title="Delete Question" arrow>
                      <IconButton
                        onClick={() => {
                          deleteQuestion(q.q_id);
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  {q.description != "" ? (
                    <Typography
                      variant="caption"
                      mb={1}
                      sx={{ width: "100%", overflow: "auto" }}
                    >
                      {q.description}
                    </Typography>
                  ) : null}
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
