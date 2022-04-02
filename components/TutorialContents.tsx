import YesSubmit from "../assets/student-forms/yes-submit.png";
import NoSubmitPub from "../assets/student-forms/no-submit-pub.png";
import NoSubmitRel from "../assets/student-forms/no-submit-rel.png";
import Created from "../assets/instr-forms/created.png";
import Published from "../assets/instr-forms/published.png";
import Released from "../assets/instr-forms/released.png";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

// Slightly bold inline text (less bold than MUI-defined "bold")
function LessBold(props: { children: React.ReactNode }) {
  return (
    <Typography display="inline" fontWeight={500} fontSize="inherit">
      {props.children}
    </Typography>
  );
}
// Wrapper div, optional line break
function Wrapper(props: { children: React.ReactNode; break?: boolean }) {
  return (
    <>
      <Typography component="div">{props.children}</Typography>
      {props.break ? <br /> : null}
    </>
  );
}

// Tutorial on Course page for students
export function StudentCourseTutorial(props) {
  const createData = (color: string, status: string, image: string) => {
    return { color, status, image };
  };

  const rows = [
    createData("Green", "if you submitted a response", YesSubmit.src),
    createData(
      "Red",
      "if you haven’t submitted a response, but still can",
      NoSubmitPub.src
    ),
    createData(
      "Gray",
      "if you haven’t submitted a response, and no longer can",
      NoSubmitRel.src
    ),
  ];

  return (
    <>
      <Wrapper break>
        Welcome to the course page for {props.title}! On this page, you can
        browse course evaluations submitted by current and previous students,
        supported by intuitive data visualizations and helpful context
        information.
      </Wrapper>
      <LessBold>If you’re enrolled in this course, continue on: </LessBold>
      <br />
      <Wrapper break>
        As a student in this course, under the Forms tab, you can view all forms
        published by your instructor and submit a response for each.{" "}
      </Wrapper>
      <Typography fontWeight="bold">Introducing the Forms Tab</Typography>
      <Typography>Each form can be in one of two stages:</Typography>
      <List>
        <ListItem>
          <Wrapper>
            <LessBold>Pub. (Published)</LessBold> means the instructor made the
            form available for you to submit a response. Click on the form card
            to submit your response. You can only submit one response per form.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            <LessBold>Rel. (Released) </LessBold> means the instructor has
            released student responses to that form. At this stage, you can no
            longer submit a response. The anonymized responses are now available
            for the Princeton community to view in the Responses, Charts, or
            Reviews tab.
          </Wrapper>
        </ListItem>
      </List>
      <Typography>
        Each form is presented as card. A form card is colored:
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Example</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  <Typography component="div" fontSize={15}>
                    <LessBold>{row.color}</LessBold> {row.status}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <img src={row.image} width="260" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Typography>
        Note that your form responses are <LessBold>anonymized</LessBold>{" "}
        (unless you willingly provide identifying information) and instructors
        cannot modify or delete student responses. Please do not abuse this
        right and do provide constructive feedback for instructors and
        thoughtful advice for future students.
      </Typography>
    </>
  );
}

// Tutorial on Course page for instructors
export function InstructorCourseTutorial(props) {
  return (
    <>
      <Wrapper break>
        Welcome to the course page for {props.title}! On this page, you can
        browse course evaluations submitted by current and previous students,
        supported by intuitive data visualizations and helpful context
        information.
      </Wrapper>
      <LessBold>If you’re an instructor for this course, read on:</LessBold>
      <Typography>
        As an instructor of this course, under the Forms tab, you can view all
        created forms and perform some form actions.
      </Typography>
      <br />
      <Typography fontWeight="bold">Introducing the Forms Tab</Typography>
      <Typography component="div">
        Click the <LessBold>Publish New Form</LessBold> button to create a new
        feedback form. You’ll be asked to enter a title and description. In your
        form description, it is incredibly important to{" "}
        <LessBold>specify the purpose of this form</LessBold> and how student
        feedback will be used. Studies have shown that clarifying this will
        increase response rates and encourage students to provide more
        constructive feedback.
      </Typography>
      <br />
      <Wrapper break>A form can be in one of three stages:</Wrapper>
      <Wrapper>
        <LessBold>Stage 1: Cr. (Created)</LessBold> means you have started a
        form, but have not made it available (published it) to your students
        yet. You may modify your form responses until you publish it. Click on
        the <LessBold>pencil icon</LessBold> to edit your form.
      </Wrapper>
      <Box component="img" src={Created.src} sx={{ my: 2 }} />
      <Wrapper>
        <LessBold>Stage 2: Pub. (Published)</LessBold> means you have made the
        form available to your students to submit responses. You can no longer
        modify your form.
      </Wrapper>
      <Box component="img" src={Published.src} sx={{ my: 2 }} />
      <Wrapper break>
        You can monitor the response rate as students fill out the form. To send
        an email reminder to students about filling out a form, click on the{" "}
        <LessBold>mail icon</LessBold> and copy and paste student emails and a
        sample message into your email client.
      </Wrapper>
      <Wrapper break>
        The responses are not public to the Princeton community until you
        release them. Click on the <LessBold>arrow icon</LessBold> to release
        student responses and confirm.
      </Wrapper>
      <Wrapper>
        <LessBold>Stage 3: Rel. (Released)</LessBold> means student responses
        have been released to the Princeton community to view in the Responses,
        Charts, or Reviews tab. Click on the <LessBold>eye icon</LessBold> to
        export student responses as a CSV
      </Wrapper>
      <Box component="img" src={Released.src} sx={{ my: 2 }} />
      <Typography>
        On the Forms tab, you can sort the forms by its release date, publish
        date, or creation date (in reverse chronological order). At any time,
        you can click on the form card to preview your form.
      </Typography>
    </>
  );
}

// Tutorial on Submit Form page for students
export function SubmitFormTutorial() {
  return (
    <>
      <Wrapper break>
        You're now in the submit form page. It's simple -- answer the questions
        and click <LessBold>Submit Form</LessBold> at the top! All questions are
        optional. If you want to leave a question unanswered, you must click the{" "}
        <LessBold>Clear Response</LessBold> button (it is disabled once you
        clear your answer).
      </Wrapper>

      <Wrapper break>
        Reminder that all your responses are <LessBold>anonymized</LessBold>{" "}
        (unless you willingly provide identifying information) and instructors
        cannot modify or delete student responses at all. Please do not abuse
        this right and do provide constructive feedback for instructors and
        thoughtful advice for future students.
      </Wrapper>

      <Wrapper>
        Keep in mind that once you submit your response, you will no longer be
        able to edit it or submit a new one.
      </Wrapper>
    </>
  );
}

// Tutorial on Edit Form page for instructors
export function EditFormTutorial() {
  return (
    <>
      <Wrapper break>
        You’re now in the Edit Form page. At this point, you have already
        specified a title and description for your form. Now, you can modify the
        form questions.
      </Wrapper>

      <Wrapper break>
        Click the <LessBold>Add Question</LessBold> button. This opens a pop-up
        where you can enter a question and a description of it. In the Question
        Type drop-down, select from{" "}
        <LessBold>one of six question types</LessBold>. Excluding the text
        types, you are able to customize the question options to your needs. For
        example, you can customize the tick values and labels for a Slider.
        Click Done to add your question to the form.
      </Wrapper>

      <Wrapper break>
        Click the <LessBold>trash icon</LessBold> if you want to delete a
        question from the form.
      </Wrapper>

      <Wrapper break>
        To view examples of questions you could include in your form and get
        introduced to the interface, click{" "}
        <LessBold>View Sample Questions</LessBold>. Expand a category to see its
        sample questions. Click the <LessBold>plus icon</LessBold> to add a
        question to your form. This again opens a pop-up where you can modify
        the sample question to your needs.
      </Wrapper>

      <Wrapper break>
        When you’re done modifying the form, click the{" "}
        <LessBold>Done Editing</LessBold> button. This saves your changes
        without publishing the form. Do not close the tab without saving your
        changes!
      </Wrapper>

      <Wrapper>
        When you’re ready to publish your form, click the{" "}
        <LessBold>Publish Form</LessBold> button. After you confirm, you will no
        longer be able to edit the form.
      </Wrapper>
    </>
  );
}
