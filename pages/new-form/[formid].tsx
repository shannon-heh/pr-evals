import { fetcher, getFullTitle } from "../../src/Helpers";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { blue, grey } from "@mui/material/colors";
import CustomHead from "../../components/CustomHead";
import { CourseData } from "../../src/Types";
import AddQuestionDialog from "../../components/forms/add-question/AddQuestionDialog";
import { useState } from "react";
import ShortTextInput from "../../components/forms/question-types/ShortTextInput";
import LongTextInput from "../../components/forms/question-types/LongTextInput";
import SingleSelectInput from "../../components/forms/question-types/SingleSelectInput";
import MultiSelectInput from "../../components/forms/question-types/MultiSelectInput";
import SliderInput from "../../components/forms/question-types/SliderInput";
import RatingInput from "../../components/forms/question-types/RatingInput";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function NewForm() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [qid, setQid] = useState(0);

  // open / close Add Question dialog
  const openDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  const router = useRouter();
  const formid: string = router.query.formid as string;

  // get course data to display
  const courseid: string = formid ? formid.split("-")[0].slice(4) : "";
  const { data: courseData_, error: courseError } = useSWR(
    courseid ? `/api/course-page-data?courseids=${courseid}` : null,
    fetcher
  );
  const courseData = courseData_ ? (courseData_[0] as CourseData) : null;

  // updates question metadata in DB when instructor adds new question
  const addQuestion = (newQuestion: Object) => {
    newQuestion["q_id"] = qid;
    setQid(qid + 1);
    setQuestions([...questions, newQuestion]);
  };

  // updates form metadata in DB when instructor finishes form
  const handleSubmit = () => {
    fetch("/api/submit-form", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formid: formid,
        questions: questions,
      }),
    }).then((res: Response) => {
      if (res.status == 200) {
        // redirect to course page when done
        router.push(`/course/${courseid}`);
      }
    });
  };

  // get existing form metadata
  const url: string = formid ? `/api/get-form-metadata?formid=${formid}` : null;
  const { data: formData, error: formError } = useSWR(url, fetcher);

  if (formError || courseError) return <Error />;
  if (!formData || !courseData_) return <Loading />;

  return (
    <>
      <CustomHead pageTitle="Create Form" />
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
            <Button variant="contained" onClick={openDialog} sx={{ px: 4 }}>
              Add Question
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              sx={{ px: 4 }}
            >
              Finish Form
            </Button>
            <AddQuestionDialog
              addQuestion={addQuestion}
              isOpen={open}
              closeDialog={closeDialog}
            />
          </Grid>
          <Grid item container flexDirection="column" sx={{ pb: 2 }}>
            {questions.map((q, i) => {
              let input = null;
              if (q.type == "SHORT_TEXT") {
                input = <ShortTextInput />;
              } else if (q.type == "LONG_TEXT") {
                input = <LongTextInput />;
              } else if (q.type == "SINGLE_SEL") {
                input = <SingleSelectInput options={q.options} />;
              } else if (q.type == "MULTI_SEL") {
                input = <MultiSelectInput options={q.options} />;
              } else if (q.type == "SLIDER") {
                input = (
                  <SliderInput
                    min={q.min}
                    max={q.max}
                    step={q.step}
                    marks={q.marks}
                  />
                );
              } else if (q.type == "RATING") {
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
                    pb: q.type == "SLIDER" ? 4.5 : 1.5,
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
