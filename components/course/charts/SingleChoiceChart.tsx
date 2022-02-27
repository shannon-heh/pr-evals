import { Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import HoverCard from "../HoverCard";

export default function SingleChoiceChart(props: {
  data: Object[];
  title: string;
}) {
  return (
    <Box sx={{ m: 0, p: 0 }}>
      <HoverCard sx={{ mt: 2, mb: 4, p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {props.title}
        </Typography>
        <ResponsiveContainer width="99%" aspect={1.78}>
          <PieChart>
            <Pie
              data={props.data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill={blue[400]}
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </HoverCard>
    </Box>
  );
}
