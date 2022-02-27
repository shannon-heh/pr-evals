import BarChart from "@mui/icons-material/BarChart";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import Charts from "./Charts";
import Reviews from "./Reviews";

export default function CourseMainContent(props: { courseID: string }) {
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
    <>
      <Grid item container md={12} direction="column">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: -2 }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab icon={<BarChart />} label="Charts" {...a11yProps(0)} />
            <Tab icon={<ReviewsIcon />} label="Reviews" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Charts />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Reviews />
        </TabPanel>
      </Grid>
    </>
  );
}
