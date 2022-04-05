import YesSubmit from "../assets/student-forms/yes-submit.png";
import NoSubmitPub from "../assets/student-forms/no-submit-pub.png";
import NoSubmitRel from "../assets/student-forms/no-submit-rel.png";
import Created from "../assets/instr-forms/created.png";
import Published from "../assets/instr-forms/published.png";
import Released from "../assets/instr-forms/released.png";
import DashboardSearch from "../assets/dashboard/search.png";
import InstructorPreaddedCourses from "../assets/dashboard/instructor-preadded.png";
import DashboardAddCourse from "../assets/dashboard/add-button.png";
import DashboardAddedCourse from "../assets/dashboard/added-button.png";
import DashboardRemoveCourse from "../assets/dashboard/remove-button.png";
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
import { Grid } from "@mui/material";

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

// Tutorial on dashboard for instructors
export function InstructorDashboardTutorial() {
  return (
    <>
      <Wrapper break>Welcome to your pr.evals dashboard!</Wrapper>
      <Wrapper break>
        On the left, search for courses by their title, number, or crosslisting.
        Click on any result to view a course's unique webpage.
      </Wrapper>
      <img src={DashboardSearch.src} width="100%" />
      <br />
      <Wrapper break>
        The courses in which you're listed as an instructor have been
        automatically added to your <LessBold>My Courses</LessBold> section on
        the right. For example, logging in as Professor Robert Fish displays
        these courses:
      </Wrapper>
      <img src={InstructorPreaddedCourses.src} width="100%" />
      <br />
      <Wrapper break>
        The My Courses section is always visible on the dashboard, so you can
        use it to quickly access your courses' webpages!
      </Wrapper>
      <Wrapper break>
        On the webpages for your courses, you will find a comprehensive
        interface in the Forms tab for creating, editing, publishing, and
        releasing evaluations forms, as well as a way to export anonymized
        student responses.
      </Wrapper>
      <Wrapper>
        You may also view visualizations of responses to any forms you have
        released. Note that only students who add your courses to their My
        Courses list can fill out their evaluations forms!
      </Wrapper>
    </>
  );
}

// Tutorial on dashboard for students
export function StudentDashboardTutorial() {
  return (
    <>
      <Wrapper break>Welcome to your pr.evals dashboard!</Wrapper>
      <Wrapper break>
        On the left, search for courses by their title, number, or crosslisting.
        Click on any result to view a course's unique webpage.
      </Wrapper>
      <img src={DashboardSearch.src} width="100%" />
      <br />
      <Wrapper break>
        If you're enrolled in a course and wish to participate in its
        evaluations forms, click the green (+) button in its search result. The
        button will change to a gray checkmark.
      </Wrapper>
      <Grid container>
        <Grid container item md={6} justifyContent="center">
          <img src={DashboardAddCourse.src} width="40%" />
        </Grid>
        <Grid container item md={6} justifyContent="center">
          <img src={DashboardAddedCourse.src} width="40%" />
        </Grid>
      </Grid>
      <br />
      <Wrapper break>
        This will add the course to your <LessBold>My Courses</LessBold> section
        on the right and enable the <LessBold>Forms</LessBold> tab on the
        course's webpage, giving you permission to complete any of its
        evaluations forms.
      </Wrapper>
      <Wrapper break>
        To remove a course from your My Courses section, simply click the red
        (x) button in its card.
      </Wrapper>
      <img src={DashboardRemoveCourse.src} width="100%" />
      <br />
      <Wrapper>
        The My Courses section is always visible on the dashboard, so you can
        use it to quickly access your enrolled courses' webpages!
      </Wrapper>
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
      "if you haven't submitted a response, but still can",
      NoSubmitPub.src
    ),
    createData(
      "Gray",
      "if you haven't submitted a response, and no longer can",
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
      <LessBold>If you're enrolled in this course, continue on: </LessBold>
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
      <LessBold>If you're an instructor for this course, read on:</LessBold>
      <Typography>
        As an instructor of this course, under the Forms tab, you can view all
        created forms and perform some form actions.
      </Typography>
      <br />
      <Typography fontWeight="bold">Introducing the Forms Tab</Typography>
      <Typography component="div">
        Click the <LessBold>Publish New Form</LessBold> button to create a new
        feedback form. You'll be asked to enter a title and description. In your
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
        You're now in the Edit Form page. At this point, you have already
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
        When you're done modifying the form, click the{" "}
        <LessBold>Done Editing</LessBold> button. This saves your changes
        without publishing the form. Do not close the tab without saving your
        changes!
      </Wrapper>

      <Wrapper>
        When you're ready to publish your form, click the{" "}
        <LessBold>Publish Form</LessBold> button. After you confirm, you will no
        longer be able to edit the form.
      </Wrapper>
    </>
  );
}

// Presents best practices for instructors creating feedback forms
// and analyzing student responses
export function InstructorBestPractices() {
  return (
    <>
      <Wrapper break>
        Instructors, we understand that getting feedback from all your
        students--let alone constructive feedback--is a difficult task, and we
        are here to help you. Increasing response rate on feedback forms is
        important in improving the generalizability of feedback and countering
        biases towards polarized responses.
      </Wrapper>
      <Wrapper>
        <LessBold>Read through the following tips</LessBold>, inspired by
        recommendations in Nulty (2008), to help improve the number and quality
        of student responses:
      </Wrapper>
      <List>
        <ListItem>
          <Wrapper>
            1. Ask for feedback <LessBold>throughout the semester</LessBold>.
            Students are more likely to provide constructive feedback if they
            know that they will personally benefit from it.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            2. Make it easy for students to access your feedback surveys, i.e.{" "}
            <LessBold>keep your surveys centralized</LessBold> on this one
            platform.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            3. Persuade students that their responses will be used to good
            effect. In the form description and in reminder emails,{" "}
            <LessBold>explain why you value their feedback</LessBold> and how
            you plan to use their input for future improvement.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            4. <LessBold>Frequently remind</LessBold> students to fill out the
            surveys. For published forms, we provide a ready-made reminder
            message you can simply email to your students.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            5. Assure students of <LessBold>confidentiality</LessBold>. In this
            app, anonymous responses are the default, so do not add questions
            that may compromise a student’s identity.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            6. Keep the questionnaire brief and avoid repetitive questions.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            7. Consider providing rewards for survey completion, such as a small
            grade boost or a lottery for a prize.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            8. Create surveys that seek constructive criticism.{" "}
            <LessBold>Mix and match</LessBold>
            between numerical questions that are easy to respond to, and written
            questions that allow students to freely express their priorities and
            concerns.
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            9. Make sure you give students enough time to complete the survey.
          </Wrapper>
        </ListItem>
      </List>

      <Wrapper break>
        If you need some inspiration on questions to include in your survey,
        check out the <LessBold>“View Sample Questions”</LessBold> button on the
        edit form page. Clicking on it will show you a variety of pre-created
        questions you can easily add to your form. Also, you can reach out to
        the <LessBold>McGraw Center for Teaching and Learning</LessBold> and
        reference their sample list of midterm questions:
        https://mcgraw.princeton.edu/mid-term-evaluation-questions.
      </Wrapper>

      <Wrapper break>
        Once you have finished gathering feedback, it is immediately time to
        read through the responses. According to Kember et al. (2008), there are
        four stages of self-reflection that you may encounter as you take in the
        feedback. Quoting Benton and Cashin (2012),
      </Wrapper>
      <List>
        <ListItem>
          <Wrapper>
            1. <LessBold>Nonreflection</LessBold>: “an instructor simply looks
            through the ratings without giving them much thought”
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            2. <LessBold>Understanding</LessBold>: “the instructor attempts to
            grasp what the ratings mean but does not relate them to his or her
            own experiences”
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            3. <LessBold>Reflection</LessBold>: “instructors relate the results
            to their own experience teaching the specifi course”
          </Wrapper>
        </ListItem>
        <ListItem>
          <Wrapper>
            4. <LessBold>Critical reflection</LessBold>: “the teacher undergoes
            a transformation in perspective”
          </Wrapper>
        </ListItem>
      </List>

      <Wrapper break>
        Ideally, you would be able to reach this critical reflection phase and
        turn it into actionable changes that can be made to the course. Research
        has also suggested that discussing the ratings with a peer instructor or
        consultant can significantly enhance the usefulness of the feedback
        Benton and Cashin (2012). You could consider reaching out to peer
        instructors in your department or consultants from the McGraw Center to
        help identify ways to act upon student feedback.
      </Wrapper>

      <Wrapper break>
        It's easy to resist critical student feedback -- however, you have to
        remember that college students have been in school for many years and
        house an expert understanding of their preferred teaching style and
        course organization. If you approach student feedback with humility and
        openness, you can explore ways to improve your pedagogical skills, while
        simultaneously building up trust from your students.
      </Wrapper>

      <Typography component="div" fontSize={12}>
        Benton, Stephen L., and William E. Cashin. "Student ratings of teaching:
        A summary of research and literature." IDEA paper 50 (2012): 1-20.
      </Typography>
      <Typography component="div" fontSize={12}>
        Kember, David, et al. "A four‐category scheme for coding and assessing
        the level of reflection in written work." Assessment and evaluation in
        higher education 33.4 (2008): 369-379.
      </Typography>
      <Typography component="div" fontSize={12}>
        Nulty, Duncan D. "The adequacy of response rates to online and paper
        surveys: what can be done?." Assessment and evaluation in higher
        education 33.3 (2008): 301-314.
      </Typography>
    </>
  );
}
