import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Rating,
  Typography,
  Tooltip as HoverTooltip,
} from "@mui/material";
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
import pluralize from "pluralize";

export default function ScaleChart(props: {
  data: Object[];
  title: string;
  width: number;
  type: "Slider" | "Rating";
  color?: string;
  numResponses: number;
}) {
  const [chartType, setChartType] = useState("Bar");

  const computeRatingMean = () => {
    let total = 0;
    let count = 0;
    props.data.forEach((e) => {
      for (let i = 0; i < e["value"]; i++) {
        total += Number(e["name"]);
        count++;
      }
    });
    return Number((total / count).toFixed(2));
  };

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {props.title}
          <br />
          <i>
            Question type: {props.type} ({props.numResponses}{" "}
            {pluralize("response", props.numResponses)})
          </i>
        </Typography>
        {props.type == "Rating" ? (
          <HoverTooltip
            title={`${computeRatingMean()} ${pluralize(
              "star",
              computeRatingMean()
            )}`}
            placement="top"
            arrow
          >
            <div>
              <Rating
                max={Math.max(...props.data.map((e) => e["name"]))}
                value={computeRatingMean()}
                precision={0.25}
                size="large"
                readOnly
              />
            </div>
          </HoverTooltip>
        ) : null}
        <FormControl sx={{ mb: 1 }}>
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
                fill={props.color}
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
                tick={true}
                axisLine={false}
                domain={[
                  0,
                  Math.max(...props.data.map((sample) => sample["value"])) + 1,
                ]}
              />
              <Radar
                animationDuration={1000}
                dataKey="value"
                fill={props.color}
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
