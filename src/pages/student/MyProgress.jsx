import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const MyProgress = () => {
  const data = [
    { name: "W1", score: 85 },
    { name: "W2", score: 88 },
    { name: "W3", score: 82 },
    { name: "W4", score: 90 },
    { name: "W5", score: 87 },
    { name: "W6", score: 95 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Progress</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Score History
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Level Progression
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Level B Progress</span>
              <span>145 / 200 Worksheets</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div className="bg-blue-600 h-full w-[72.5%] rounded-full shadow-inner animate-pulse transition-all"></div>
            </div>
            <p className="text-xs text-gray-500 text-center italic">
              Keep going! You're 55 worksheets away from Level C!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProgress;
