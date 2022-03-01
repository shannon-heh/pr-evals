import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Charts() {
  const data = [
    { name: "Page A", uv: 400 },
    { name: "Page B", uv: 500 },
    { name: "Page B", uv: 400 },
    { name: "Page B", uv: 300 },
    { name: "Page B", uv: 400 },
    { name: "Page B", uv: 200 },
  ];

  return (
    <Grid container sx={{ textAlign: "center" }}>
      <Grid item container lg={6} direction="column">
        <Box sx={{ p: 2 }}>
          <ResponsiveContainer width="99%" aspect={1.78}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item container lg={6} direction="column">
        col2
      </Grid>
    </Grid>
  );
}
