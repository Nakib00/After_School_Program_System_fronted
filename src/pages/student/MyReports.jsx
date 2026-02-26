import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";
import { useAuthStore } from "../../store/authStore";
import Spinner from "../../components/ui/Spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  GraduationCap,
  Building2,
  AlertCircle,
} from "lucide-react";
import Badge from "../../components/ui/Badge";

const MyReports = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const studentId = user?.student?.id || user?.id;
        if (!studentId) return;

        const response = await studentService.getReports(studentId);
        setReportData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchReports();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">
          Failed to load academic reports.
        </p>
      </div>
    );
  }

  const { student_info, attendance, assignments, progress, performance } =
    reportData;

  const attendanceChartData = [
    { name: "Present", value: attendance.present, color: "#10b981" },
    { name: "Absent", value: attendance.absent, color: "#ef4444" },
    { name: "Late", value: attendance.late, color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Student Info */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-black">
            {student_info.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {student_info.name}
            </h2>
            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2">
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <FileText size={16} className="mr-1.5 text-indigo-500" />
                ID: {student_info.enrollment_no}
              </div>
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <GraduationCap size={16} className="mr-1.5 text-indigo-500" />
                Grade: {student_info.grade}
              </div>
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <Building2 size={16} className="mr-1.5 text-indigo-500" />
                {student_info.center}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center px-6 py-3 bg-green-50 rounded-2xl border border-green-100">
            <div className="text-2xl font-black text-green-600">
              {attendance.attendance_rate}%
            </div>
            <div className="text-[10px] uppercase font-bold text-green-500 tracking-wider">
              Attendance
            </div>
          </div>
          <div className="text-center px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="text-2xl font-black text-indigo-600">
              {assignments.graded}
            </div>
            <div className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
              Graded
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Calendar size={20} className="mr-2 text-indigo-600" />
            Attendance Overview
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  Present
                </div>
                <span className="font-bold">{attendance.present}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                  Absent
                </div>
                <span className="font-bold">{attendance.absent}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                  Late
                </div>
                <span className="font-bold">{attendance.late}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Stats */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FileText size={20} className="mr-2 text-indigo-600" />
            Assignment Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Assigned",
                    count: assignments.assigned,
                    color: "#f59e0b",
                  },
                  {
                    name: "Submitted",
                    count: assignments.submitted,
                    color: "#3b82f6",
                  },
                  {
                    name: "Graded",
                    count: assignments.graded,
                    color: "#10b981",
                  },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {[
                    {
                      name: "Assigned",
                      count: assignments.assigned,
                      fill: "#fbbf24",
                    },
                    {
                      name: "Submitted",
                      count: assignments.submitted,
                      fill: "#60a5fa",
                    },
                    {
                      name: "Graded",
                      count: assignments.graded,
                      fill: "#34d399",
                    },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <TrendingUp size={20} className="mr-2 text-indigo-600" />
            Subject Progress & Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Completed
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Avg Score
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {progress.map((p, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors text-sm"
                >
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {p.subject}
                  </td>
                  <td className="px-6 py-4 text-indigo-600 font-bold">
                    {p.level}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-600">
                    {p.worksheets_completed}
                  </td>
                  <td className="px-6 py-4 text-center font-black text-gray-900">
                    {Math.round(p.average_score)}%
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {p.started_at || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={p.is_level_complete ? "green" : "blue"}>
                      {p.is_level_complete ? "Completed" : "Active"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <CheckCircle2 size={20} className="mr-2 text-indigo-600" />
            Recent Graded Performance
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-50">
          {performance.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">
                    {item.worksheet}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                    Graded on {item.graded_at}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-black ${item.score >= 80 ? "text-green-600" : item.score >= 60 ? "text-indigo-600" : "text-orange-500"}`}
                  >
                    {item.score}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Score
                  </div>
                </div>
              </div>
              {item.feedback && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 italic">
                  "{item.feedback}"
                </div>
              )}
            </div>
          ))}
          {performance.length === 0 && (
            <div className="col-span-2 py-12 text-center text-gray-500 bg-white">
              No recent performance history available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReports;
