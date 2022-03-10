import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import HoverCard from "../HoverCard";

export default function ScaleChart(props: {
  data: Object[];
  title: string;
  width: number;
}) {
  const [chartType, setChartType] = useState("Bar");

  const values: number[] = Array<number>();
  props.data.forEach((sample) => {
    values.push(sample["value"]);
  });

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {props.title}
          <br />
          <i>Slider / Rating</i>
        </Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="scale-chart-selector"
            name="controlled-radio-buttons-group"
            value={chartType}
            onChange={(_, value: string) => {
              setChartType(value);
            }}
          >
            <FormControlLabel value="Bar" control={<Radio />} label="Bar" />
            <FormControlLabel value="Web" control={<Radio />} label="Web" />
          </RadioGroup>
        </FormControl>
        <ResponsiveContainer width="99%" aspect={1.78}>
          {chartType == "Bar" ? (
            <BarChart
              data={props.data}
              layout="horizontal"
              margin={{ left: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" type="category" />
              <YAxis type="number" hide />
              <Tooltip />
              <Bar
                dataKey="value"
                fill={green[400]}
                fillOpacity={0.6}
                animationDuration={1000}
              />
            </BarChart>
          ) : (
            <RadarChart outerRadius={110} data={props.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis
                angle={30}
                orientation="left"
                tick={false}
                domain={[0, Math.max(...values) + 1]}
              />
              <Radar
                animationDuration={1000}
                dataKey="value"
                fill={green[400]}
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </HoverCard>
    </Box>
  );
}
