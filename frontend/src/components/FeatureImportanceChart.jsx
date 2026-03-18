import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const GRADIENT_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#818cf8',
  '#7c3aed',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-3 py-2 !rounded-lg text-sm">
        <p className="font-medium text-gray-800 dark:text-gray-200">{payload[0].payload.feature}</p>
        <p className="text-primary-500 font-semibold">{payload[0].value}% contribution</p>
      </div>
    );
  }
  return null;
};

export default function FeatureImportanceChart({ data = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = data.length > 0 ? data : [
    { feature: 'FICO Score', importance: 35 },
    { feature: 'DTI Ratio', importance: 20 },
    { feature: 'Income Ratio', importance: 20 },
    { feature: 'Interest Rate', importance: 15 },
    { feature: 'Loan Term', importance: 10 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke={isDark ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            type="number"
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            width={90}
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }} />
          <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={24}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
