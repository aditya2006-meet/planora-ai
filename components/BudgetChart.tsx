"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BudgetBreakdown {
  accommodation?: number;
  food?: number;
  transport?: number;
  activities?: number;
  misc?: number;
}

const COLORS = ["#00d4ff", "#9b59ff", "#ff8c42", "#00c864", "#ff6b9d"];
const LABELS = ["Accommodation", "Food", "Transport", "Activities", "Misc"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(5,8,17,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.75rem",
          padding: "0.5rem 0.875rem",
          fontSize: "0.8rem",
          color: "var(--text-primary)",
        }}
      >
        <strong>{payload[0].name}</strong>: {payload[0].value}%
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
    {payload.map((entry: any, i: number) => (
      <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: entry.color }}
        />
        {entry.value}
      </div>
    ))}
  </div>
);

export default function BudgetChart({
  breakdown,
  totalBudget,
}: {
  breakdown: BudgetBreakdown;
  totalBudget: string;
}) {
  const raw = [
    breakdown.accommodation ?? 35,
    breakdown.food ?? 25,
    breakdown.transport ?? 20,
    breakdown.activities ?? 15,
    breakdown.misc ?? 5,
  ];

  const data = LABELS.map((name, i) => ({ name, value: raw[i] })).filter(
    (d) => d.value > 0
  );

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(155,89,255,0.06)",
        border: "1px solid rgba(155,89,255,0.2)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span>📊</span>
        <span className="font-space text-sm font-semibold" style={{ color: "#9b59ff" }}>
          Budget Breakdown
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        Total: {totalBudget}
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
