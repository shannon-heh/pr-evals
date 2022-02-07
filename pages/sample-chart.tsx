import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import useCAS from "../hooks/useCAS";
const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 200, pv: 1500, amt: 1000 },
  { name: "Page C", uv: 50, pv: 3000, amt: 800 },
];

export default function renderLineChart() {
  const { isLoading, netID } = useCAS();

  return (
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
    </LineChart>
  );
}
