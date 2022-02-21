import BarChart from "@mui/icons-material/BarChart";
import ReviewsIcon from "@mui/icons-material/Reviews";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../src/Helpers";
import { EvalsData } from "../../src/Types";
import TextualEvaluations from "./TextualEvaluations";

export default function CourseMainContent(props: { courseID: string }) {
  const commonMainContentBoxStyles = {
    m: 2,
  };

  type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
  };

  const { data: evalsData, error: evalsError } = useSWR(
    "/api/textual-evaluations",
    fetcher
  );

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
      <Grid item container md={12} direction="column">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: -2 }}>
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
            Charts and Diagrams
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={1} sx={{ textAlign: "center" }}>
            <Grid item container md={6} direction="column">
              hi
            </Grid>
            <Grid item container md={6} direction="column">
              <Box
                sx={{
                  ...commonMainContentBoxStyles,
                }}
              >
                <TextualEvaluations
                  evalsData={evalsData as EvalsData[]}
                  isLoading={!evalsData || evalsError}
                />
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Grid>
    </>
  );
}
