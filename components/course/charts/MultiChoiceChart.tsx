import { Box, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import HoverCard from "../HoverCard";
import pluralize from "pluralize";

export default function MultiChoiceChart(props: {
  data: Object[];
  title: string;
  width: number;
  color?: string;
  omitQuestionType?: boolean;
}) {
  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {props.title}
          {props.omitQuestionType ? null : (
            <>
              <br />
              <i>Question type: Multi Choice</i>
            </>
          )}
        </Typography>
        <ResponsiveContainer width="99%" aspect={1.78}>
          <BarChart data={props.data} layout="vertical" margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={props.color}
              fillOpacity={0.6}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </HoverCard>
    </Box>
  );
}
