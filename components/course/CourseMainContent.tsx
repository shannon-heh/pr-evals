import BarChart from "@mui/icons-material/BarChart";
import ReviewsIcon from "@mui/icons-material/Reviews";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import { Box, createTheme, Grid, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import Charts from "./Charts";
import Reviews from "./Reviews";
import Responses from "./Responses";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Forms from "./Forms";
import useCAS from "../../hooks/useCAS";
import useSWR from "swr";
import { fetcher } from "../../src/Helpers";
import Students from "./Students";
import { blue, red } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { palette } from "@mui/system";

export default function CourseMainContent(props: {
  courseID: string;
  numStudents: number;
}) {
  const { netID, isInstructor } = useCAS();

  // first check if user has this course
  const url = netID ? `/api/get-user-data?netid=${netID}` : null;
  const { data: userData, error: userError } = useSWR(url, fetcher);
  const isUsersCourse: boolean = !userError
    ? isInstructor
      ? userData?.instructor_courses.includes(props.courseID)
      : userData?.student_courses.includes(props.courseID)
    : false;

  type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography component="div">{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider
      theme={createTheme({ palette: { secondary: { main: blue[900] } } })}
    >
      <Grid item container md={12} direction="column">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: -2 }}>
          {isUsersCourse ? (
            <Tabs
              textColor="secondary"
              TabIndicatorProps={{
                style: { color: red[100], backgroundColor: blue[900] },
              }}
              value={value}
              onChange={handleChange}
              centered
            >
              <Tab icon={<RateReviewIcon />} label="Forms" {...a11yProps(0)} />
              <Tab
                icon={<DriveFileRenameOutlineIcon />}
                label="Responses"
                {...a11yProps(1)}
              />
              <Tab icon={<BarChart />} label="Charts" {...a11yProps(2)} />
              <Tab icon={<ReviewsIcon />} label="Reviews" {...a11yProps(3)} />
              <Tab icon={<GroupsIcon />} label="Students" {...a11yProps(4)} />
            </Tabs>
          ) : (
            <Tabs value={value} onChange={handleChange} centered>
              <Tab
                icon={<DriveFileRenameOutlineIcon />}
                label="Responses"
                {...a11yProps(0)}
              />
              <Tab icon={<BarChart />} label="Charts" {...a11yProps(1)} />
              <Tab icon={<ReviewsIcon />} label="Reviews" {...a11yProps(2)} />
              <Tab icon={<GroupsIcon />} label="Students" {...a11yProps(3)} />
            </Tabs>
          )}
        </Box>
        {isUsersCourse ? (
          <>
            <TabPanel value={value} index={0}>
              <Forms
                courseID={props.courseID}
                numStudents={props.numStudents}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Responses courseID={props.courseID} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Charts courseID={props.courseID} isStandard={true} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Reviews courseID={props.courseID} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Students courseID={props.courseID} />
            </TabPanel>
          </>
        ) : (
          <>
            <TabPanel value={value} index={0}>
              <Responses courseID={props.courseID} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Charts courseID={props.courseID} isStandard={true} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Reviews courseID={props.courseID} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Students courseID={props.courseID} />
            </TabPanel>
          </>
        )}
      </Grid>
    </ThemeProvider>
  );
}
