import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ChildProgress = () => {
  const data = [
    { name: "Accuracy", value: 92, color: "#3b82f6" },
    { name: "Speed", value: 78, color: "#10b981" },
    { name: "Attendance", value: 95, color: "#f59e0b" },
    { name: "Completion", value: 88, color: "#8b5cf6" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Child Progress Analysis
        </h2>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
          Current Level: C1
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 font-display">
            Performance Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 20, right: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 13, fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <h3 className="text-xl font-bold mb-4">Teacher's Note</h3>
          <p className="text-blue-100 leading-relaxed mb-6">
            "Your child is showing exceptional progress in mental math accuracy.
            We recommend focusing slightly more on completion speed for the next
            week to bridge the gap."
          </p>
          <div className="pt-6 border-t border-blue-400 capitalize">
            <div className="text-sm text-blue-200">Last Assessment</div>
            <div className="text-lg font-semibold">February 24, 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProgress;
