import React, { useState } from "react";
import { TrendingUp, BookOpen, Clock, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";

const ChildProgress = () => {
  const data = [
    { name: "Jan", score: 75 },
    { name: "Feb", score: 82 },
    { name: "Mar", score: 80 },
    { name: "Apr", score: 88 },
    { name: "May", score: 85 },
    { name: "Jun", score: 92 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Child Progress Report
        </h2>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-500">Subject:</span>
          <select className="text-sm font-bold text-blue-600 outline-none">
            <option>Mathematics</option>
            <option>English</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Score"
          value="86%"
          icon={TrendingUp}
          color="green"
          trend={5}
        />
        <StatCard
          title="Worksheets Done"
          value="45"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Last Score"
          value="92/100"
          icon={Activity}
          color="purple"
        />
        <StatCard title="Study Hours" value="12h" icon={Clock} color="orange" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Performance Trend
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Worksheet Results</h3>
          <button className="text-sm text-blue-600 font-medium">
            View Full History
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Worksheet</th>
              <th className="px-6 py-4 text-center">Score</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            <tr>
              <td className="px-6 py-4 font-medium">B-10: Multiplication</td>
              <td className="px-6 py-4 text-center text-green-600 font-bold">
                92
              </td>
              <td className="px-6 py-4 text-gray-500">Feb 22, 2024</td>
              <td className="px-6 py-4 text-gray-500">
                <Badge variant="green">Graded</Badge>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium">B-09: Division Intro</td>
              <td className="px-6 py-4 text-center text-green-600 font-bold">
                85
              </td>
              <td className="px-6 py-4 text-gray-500">Feb 18, 2024</td>
              <td className="px-6 py-4 text-gray-500">
                <Badge variant="green">Graded</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChildProgress;
