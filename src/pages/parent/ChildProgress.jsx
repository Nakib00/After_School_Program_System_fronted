import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar,
  MessageSquare,
  ChevronRight,
  GraduationCap,
  Building2,
  User,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";

const ChildProgress = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await reportService.getChildrenReports();
        const data = res.data.data;
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch children reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Children Progress Analysis
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Deep dive into academic performance and attendance for each child.
          </p>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-10">
          {/* Child Selection Header */}
          <div className="flex flex-wrap gap-4 p-2 bg-gray-50/50 rounded-[2rem] border border-gray-100">
            {reports.map((report) => (
              <button
                key={report.student_info.id}
                onClick={() => setSelectedReport(report)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-3xl transition-all duration-300 ${
                  selectedReport?.student_info.id === report.student_info.id
                    ? "bg-white shadow-xl shadow-indigo-100 border-indigo-100 border text-indigo-700 active-tab scale-[1.02]"
                    : "bg-transparent text-gray-500 hover:bg-white/60 border border-transparent"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedReport?.student_info.id === report.student_info.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <User size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">
                    Child
                  </p>
                  <p className="text-sm font-bold truncate max-w-[120px]">
                    {report.student_info.name}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Report for Selected Child */}
          {selectedReport && (
            <div
              key={selectedReport.student_info.id}
              className="space-y-8 bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              {/* Header section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-50">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
                    <GraduationCap size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">
                      {selectedReport.student_info.name}
                    </h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 font-bold gap-y-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                        {selectedReport.student_info.enrollment_no}
                      </span>
                      <span className="mx-2 text-gray-300 hidden sm:inline">
                        •
                      </span>
                      <span className="px-3 py-1 bg-gray-50 rounded-lg">
                        Grade {selectedReport.student_info.grade}
                      </span>
                      <span className="mx-2 text-gray-300 hidden sm:inline">
                        •
                      </span>
                      <div className="flex items-center px-3 py-1 bg-gray-50 rounded-lg">
                        <Building2 size={14} className="mr-1.5 text-gray-400" />
                        {selectedReport.student_info.center}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-4 bg-green-50 rounded-[1.5rem] border border-green-100 text-center shadow-lg shadow-green-50/50">
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mb-1.5">
                      Attendance Rate
                    </p>
                    <p className="text-2xl font-black text-green-700">
                      {selectedReport.attendance.attendance_rate}%
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-blue-50 rounded-[1.5rem] border border-blue-100 text-center shadow-lg shadow-blue-50/50">
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1.5">
                      Graded Tasks
                    </p>
                    <p className="text-2xl font-black text-blue-700">
                      {selectedReport.assignments.graded}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Analytics */}
                <div className="lg:col-span-2 space-y-10">
                  {/* Subject Progress */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-gray-900 flex items-center">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mr-4">
                        <BookOpen size={20} />
                      </div>
                      Subject Progress & Completion
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {selectedReport.progress.length > 0 ? (
                        selectedReport.progress.map((prog, idx) => (
                          <div
                            key={idx}
                            className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all group"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <p className="text-lg font-black text-gray-900 mb-1">
                                  {prog.subject}
                                </p>
                                <Badge variant="indigo">
                                  Level {prog.level}
                                </Badge>
                              </div>
                              <div
                                className={`p-3 rounded-2xl ${prog.is_level_complete ? "bg-green-100 text-green-600 shadow-lg shadow-green-100/50" : "bg-orange-100 text-orange-600 shadow-lg shadow-orange-100/50"}`}
                              >
                                {prog.is_level_complete ? (
                                  <CheckCircle2 size={18} />
                                ) : (
                                  <TrendingUp size={18} />
                                )}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between text-xs font-black">
                                <span className="text-gray-400 uppercase tracking-widest">
                                  Progress Tracker
                                </span>
                                <span className="text-indigo-600">
                                  {prog.worksheets_completed} Worksheets
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-1000"
                                  style={{
                                    width: `${Math.min(prog.worksheets_completed * 10, 100)}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                  <Clock size={12} className="mr-1.5" />
                                  Since: {prog.started_at}
                                </div>
                                <div className="text-base font-black text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-100">
                                  {prog.average_score}%{" "}
                                  <span className="text-[10px] text-gray-400 ml-1">
                                    Avg
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full p-12 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400 font-medium">
                          No progress data available for this child yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Performance History */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-gray-900 flex items-center">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mr-4">
                        <TrendingUp size={20} />
                      </div>
                      Performance Detailed Breakdown
                    </h4>
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50">
                            <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                              Worksheet / Task
                            </th>
                            <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                              Proficiency
                            </th>
                            <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                              Graded On
                            </th>
                            <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                              Feedback
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedReport.performance.length > 0 ? (
                            selectedReport.performance.map((perf, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-gray-50 transition-colors group"
                              >
                                <td className="px-8 py-6">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                      <FileText size={20} />
                                    </div>
                                    <span className="text-sm font-black text-gray-700">
                                      {perf.worksheet}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-fit">
                                    <div className="flex flex-col">
                                      <span
                                        className={`text-base font-black ${perf.score >= 80 ? "text-green-600" : perf.score >= 60 ? "text-yellow-600" : "text-red-600"}`}
                                      >
                                        {perf.score}%
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-bold tracking-tight">
                                        {perf.errors} Errors Found
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-gray-500 font-bold">
                                  {new Date(perf.graded_at).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-start max-w-xs bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50">
                                    <MessageSquare
                                      size={16}
                                      className="text-indigo-300 mr-3 mt-1 shrink-0"
                                    />
                                    <span className="text-[11px] leading-relaxed text-gray-600 font-medium italic">
                                      "{perf.feedback}"
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-8 py-20 text-center text-gray-400 italic font-medium"
                              >
                                No performance records found for this period.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column: Summaries */}
                <div className="space-y-10">
                  {/* Attendance Chart */}
                  <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center">
                      <Calendar size={14} className="mr-2 text-indigo-500" />
                      Attendance Stats
                    </h4>
                    <div className="h-56 relative mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Present",
                                value: selectedReport.attendance.present,
                              },
                              {
                                name: "Absent",
                                value: selectedReport.attendance.absent,
                              },
                              {
                                name: "Late",
                                value: selectedReport.attendance.late,
                              },
                            ]}
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill="#6366f1" className="drop-shadow-sm" />
                            <Cell fill="#f43f5e" className="drop-shadow-sm" />
                            <Cell fill="#f59e0b" className="drop-shadow-sm" />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: "20px",
                              border: "none",
                              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                              fontWeight: "bold",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-indigo-700 tracking-tighter">
                          {selectedReport.attendance.attendance_rate}%
                        </span>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">
                          Consistency
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                        <span className="text-xs font-bold text-gray-500">
                          Present
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-center border-l border-gray-100 pl-4 pr-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <span className="text-xs font-bold text-gray-500">
                          Absent
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <span className="text-xs font-bold text-gray-500">
                          Late
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Status */}
                  <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-2xl shadow-indigo-200">
                    <div className="flex items-center justify-between mb-10">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-200">
                        Tasks Completed
                      </h4>
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <CheckCircle2 size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-end mb-3">
                          <span className="text-5xl font-black tracking-tighter tabular-nums leading-none">
                            {selectedReport.assignments.graded}
                          </span>
                          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest border-b border-indigo-500/50 pb-1">
                            Graded Tasks
                          </span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out"
                            style={{
                              width: `${(selectedReport.assignments.graded / Math.max(selectedReport.assignments.total, 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                        <div className="group">
                          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">
                            Submitted
                          </p>
                          <p className="text-2xl font-black">
                            {selectedReport.assignments.submitted}
                          </p>
                        </div>
                        <div className="group">
                          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">
                            Pending
                          </p>
                          <p className="text-2xl font-black">
                            {selectedReport.assignments.assigned}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teacher's Note */}
                  <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex flex-col">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm">
                        <MessageSquare size={20} />
                      </div>
                      <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                        Latest Insight
                      </h4>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed font-bold italic mb-8">
                      {selectedReport.performance.length > 0
                        ? `"${selectedReport.performance[0].feedback}"`
                        : "Keep up the consistent effort! No specific feedback for the current tasks yet."}
                    </p>
                    <div className="mt-auto flex items-center p-4 bg-white/60 rounded-2xl border border-indigo-100/50">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4 shadow-lg shadow-indigo-100">
                        <Users size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-wider">
                          Teacher Feedback
                        </p>
                        <p className="text-[10px] text-indigo-400 font-bold">
                          Academic Success Department
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[4rem] border border-dashed border-gray-200 text-center shadow-inner">
          <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center mx-auto mb-8 border border-gray-100">
            <Users size={48} className="text-gray-300" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
            No report data found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
            We couldn't find any progress or performance records for your
            children at this time. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChildProgress;
