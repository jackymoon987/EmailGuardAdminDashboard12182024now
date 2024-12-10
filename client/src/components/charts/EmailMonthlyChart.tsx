import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type MonthlyData = {
  name: string;
  approved: number;
  evaluating: number;
  blocked: number;
};

interface EmailMonthlyChartProps {
  data: MonthlyData[];
}

export function EmailMonthlyChart({ data }: EmailMonthlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="approved" fill="#16A34A" stackId="a" />
        <Bar dataKey="evaluating" fill="#FDB022" stackId="a" />
        <Bar dataKey="blocked" fill="#DC2626" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
