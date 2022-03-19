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
import { useEffect, useState } from "react";
import ShortTextInput from "../../components/forms/question-types/ShortTextInput";
import LongTextInput from "../../components/forms/question-types/LongTextInput";
import SingleSelectInput from "../../components/forms/question-types/SingleSelectInput";
import MultiSelectInput from "../../components/forms/question-types/MultiSelectInput";
import SliderInput from "../../components/forms/question-types/SliderInput";
import RatingInput from "../../components/forms/question-types/RatingInput";
import Button from "@mui/material/Button";
import ConfirmationDialog from "../../components/forms/ConfirmationDialog";
import { useFormik } from "formik";
import useCAS from "../../hooks/useCAS";

// Page for student to submit a form response
export default function SubmitForm() {
  // open is true when Add/Confirm dialog is open
  const [openConfirm, setOpenConfirm] = useState(false);

  // open / close Confirmation dialog
  const openConfirmDialog = () => {
    setOpenConfirm(true);
  };
  const closeConfirmDialog = () => {
    setOpenConfirm(false);
  };

  const { netID } = useCAS();
  const router: NextRouter = useRouter();
  const formid: string = router.query.formid as string;

  // get course data to display
  const courseid: string = formid ? formid.split("-")[0].slice(4) : "";
  const { data: courseData_, error: courseError } = useSWR(
    courseid ? `/api/course-page-data?courseids=${courseid}` : null,
    fetcher
  );
  const courseData: CourseData | null = courseData_
    ? (courseData_[0] as CourseData)
    : null;

  // get form metadata
  const url: string = formid ? `/api/get-form-metadata?formid=${formid}` : null;
  const { data: formData, error: formError } = useSWR(url, fetcher);

  // get form questions
  const questions: QuestionMetadata[] = formData?.questions;

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      const responses: { q_id: number; response: any }[] = Object.keys(
        values
      ).map((q_id: string) => {
        return { q_id: Number(q_id), response: values[q_id] };
      });

      // update student's form response in DB
      fetch("/api/submit-form", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formid: formid,
          responses: responses,
          netid: netID,
          courseid: courseid,
        }),
      }).then((res: Response) => {
        if (res.status == 200) {
          // redirect to course page when done
          router.push(`/course/${courseid}`);
        }
      });
    },
  });

  // set default field values
  useEffect(() => {
    questions?.forEach((q: QuestionMetadata) => {
      const id = String(q.q_id);
      if (q.type == Question.ShortText || q.type == Question.LongText) {
        formik.setFieldValue(id, "");
      } else if (q.type == Question.MultiSelect) {
        formik.setFieldValue(id, []);
      } else if (q.type == Question.SingleSelect) {
        formik.setFieldValue(id, null);
      } else if (q.type == Question.Rating) {
        formik.setFieldValue(id, 0);
      } else if (q.type == Question.Slider) {
        formik.setFieldValue(id, formData?.standardized ? 3 : q.min);
      }
    });
  }, [questions]);

  // updates form response in DB when student finishes form
  const handleSubmit = () => {
    closeConfirmDialog();
    formik.handleSubmit();
  };

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
            justifyContent="center"
          >
            <Button
              type="submit"
              variant="contained"
              onClick={openConfirmDialog}
              sx={{ px: 4, width: "100%" }}
            >
              Submit Form
            </Button>
            <ConfirmationDialog
              title={"Are you ready to submit your form?"}
              description={"Click Cancel to continue editing your response."}
              isOpen={openConfirm}
              closeDialog={closeConfirmDialog}
              handleSubmit={handleSubmit}
            />
          </Grid>
          <Grid item container flexDirection="column" sx={{ pb: 2 }}>
            {questions.map((q: QuestionMetadata, i: number) => {
              let input = null;
              const name: string = String(q.q_id);
              if (q.type == Question.ShortText) {
                input = <ShortTextInput name={name} formik={formik} />;
              } else if (q.type == Question.LongText) {
                input = <LongTextInput name={name} formik={formik} />;
              } else if (q.type == Question.SingleSelect) {
                input = (
                  <SingleSelectInput
                    options={q.options}
                    name={name}
                    formik={formik}
                  />
                );
              } else if (q.type == Question.MultiSelect) {
                input = (
                  <MultiSelectInput
                    options={q.options}
                    name={name}
                    formik={formik}
                  />
                );
              } else if (q.type == Question.Slider) {
                input = (
                  <SliderInput
                    min={q.min}
                    max={q.max}
                    step={q.step}
                    marks={q.marks}
                    name={name}
                    formik={formik}
                  />
                );
              } else if (q.type == Question.Rating) {
                input = (
                  <RatingInput
                    max={q.max}
                    precision={q.precision}
                    name={name}
                    formik={formik}
                  />
                );
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
