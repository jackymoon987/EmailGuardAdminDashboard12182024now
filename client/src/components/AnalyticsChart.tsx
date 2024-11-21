import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsChartProps {
  data: any[];
  type: 'activity' | 'ratio';
}

export function AnalyticsChart({ data, type }: AnalyticsChartProps) {
  if (type === 'activity') {
    const chartData = data.reduce((acc: any[], log) => {
      const date = new Date(log.timestamp).toLocaleDateString();
      const existingEntry = acc.find(entry => entry.date === date);
      
      if (existingEntry) {
        existingEntry.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      
      return acc;
    }, []);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#96BDA1" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  const blockedCount = data.filter(log => log.action === 'blocked').length;
  const allowedCount = data.filter(log => log.action === 'allowed').length;
  const pieData = [
    { name: 'Blocked', value: blockedCount },
    { name: 'Allowed', value: allowedCount }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
        >
          <Cell fill="#D5E5DA" />
          <Cell fill="#FFE4D4" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
