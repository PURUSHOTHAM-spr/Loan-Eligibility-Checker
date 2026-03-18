import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = {
  low: '#22c55e',     // green
  medium: '#eab308',  // yellow
  high: '#ef4444',    // red
};

export default function GaugeChart({ value = 0, size = 200 }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  // Create gauge data: filled portion + remaining
  const data = [
    { value: clampedValue },
    { value: 100 - clampedValue },
  ];

  // Determine color based on risk level
  const getColor = (val) => {
    if (val <= 40) return COLORS.low;
    if (val <= 70) return COLORS.medium;
    return COLORS.high;
  };

  const getRiskLabel = (val) => {
    if (val <= 40) return 'Low Risk';
    if (val <= 70) return 'Medium Risk';
    return 'High Risk';
  };

  const activeColor = getColor(clampedValue);
  const riskLabel = getRiskLabel(clampedValue);

  return (
    <div className="gauge-container flex flex-col items-center">
      <div style={{ width: size, height: size * 0.6 }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="65%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              <Cell fill={activeColor} />
              <Cell fill="currentColor" className="text-gray-200 dark:text-gray-700" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-3xl font-bold" style={{ color: activeColor }}>
            {clampedValue}
          </span>
        </div>
      </div>
      <span
        className="text-sm font-semibold mt-2 px-3 py-1 rounded-full"
        style={{
          color: activeColor,
          backgroundColor: `${activeColor}15`,
        }}
      >
        {riskLabel}
      </span>
    </div>
  );
}
