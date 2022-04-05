import { fetcher } from "../../../src/Helpers";
import useSWR from "swr";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { Question, QuestionMetadata } from "../../../src/Types";
import ShortTextInput from "../question-types/ShortTextInput";
import LongTextInput from "../question-types/LongTextInput";
import SingleSelectInput from "../question-types/SingleSelectInput";
import MultiSelectInput from "../question-types/MultiSelectInput";
import SliderInput from "../question-types/SliderInput";
import RatingInput from "../question-types/RatingInput";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddBoxIcon from "@mui/icons-material/AddBox";

// Display sample questions in edit-form
export default function SampleQuestions(props) {
  // get sample questions
  const { data: questions, error: questionsError } = useSWR(
    `/api/get-sample-questions`,
    fetcher
  );

  if (questionsError) return <div></div>;

  // question categories
  const categories: string[] = Object.keys(questions?.sample_questions ?? {});

  return (
    <Grid
      container
      item
      justifyContent="center"
      sx={{ width: "100%", borderRadius: 2 }}
    >
      {categories.map((category: string, i: number) => {
        return (
          <Accordion
            key={i}
            sx={{
              backgroundColor: "#fefefe",
              width: "100%",
              boxShadow: 0,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ height: "40px" }}
            >
              <Typography>{category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {questions.sample_questions[category].map(
                (q: QuestionMetadata, i: number) => {
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
                        <Tooltip title="Add Question" arrow>
                          <IconButton
                            onClick={() => {
                              props.openEditSampleDialog(q);
                            }}
                          >
                            <AddBoxIcon />
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
                }
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Grid>
  );
}
