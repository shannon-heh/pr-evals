import { Box, Typography } from "@mui/material";
import { blue, green, orange, purple, red } from "@mui/material/colors";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import HoverCard from "../HoverCard";

export default function SingleChoiceChart(props: {
  data: Object[];
  title: string;
  width: number;
}) {
  const COLORS = [blue[400], orange[400], green[400], red[400], purple[400]];

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {props.title}
          <br />
          <i>Question type: Single Choice</i>
        </Typography>
        <ResponsiveContainer width="99%" aspect={1.78}>
          <PieChart>
            <Pie
              data={props.data}
              dataKey="value"
              outerRadius={100}
              fill={blue[400]}
              animationDuration={1000}
              animationBegin={0}
              legendType="circle"
              label
            >
              {props.data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {props.width >= 600 ? (
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            ) : null}
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </HoverCard>
    </Box>
  );
}
