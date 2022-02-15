import BarChart from "@mui/icons-material/BarChart";
import ReviewsIcon from "@mui/icons-material/Reviews";
import Box from "@mui/material/Box";
import { blue, grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useState } from "react";

export default function CourseMainContent() {
  const commonMainContentBoxStyles = {
    m: 2,
    p: 3,
    background: blue[400],
    borderRadius: 1,
    borderColor: grey[800],
    borderStyle: "solid",
    height: 400, // temporary
  };

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
            <Typography>{children}</Typography>
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
    <>
      <Grid item container lg={12} direction="column">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab icon={<BarChart />} label="Charts" {...a11yProps(0)} />
            <Tab icon={<ReviewsIcon />} label="Reviews" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Box
            sx={{
              ...commonMainContentBoxStyles,
            }}
          >
            Textual Evaluations
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box
            sx={{
              ...commonMainContentBoxStyles,
            }}
          >
            Charts and Diagrams
          </Box>
        </TabPanel>
      </Grid>
    </>
  );
}
