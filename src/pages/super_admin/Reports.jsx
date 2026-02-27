import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Building2,
  GraduationCap,
  DollarSign,
  ClipboardList,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Wallet,
  PieChart,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import { feeService } from "../../services/feeService";
import Spinner from "../../components/ui/Spinner";
import { toast } from "react-hot-toast";

const SuperAdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [performanceData, setPerformanceData] = useState([]);
  const [feeStatusReport, setFeeStatusReport] = useState([]);
  const [fetchingPerformance, setFetchingPerformance] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data } = await reportService.getFullSystemReport();
        setReportData(data.data);
      } catch (error) {
        console.error("Failed to fetch system report:", error);
        toast.error("Failed to load system reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const fetchPerformance = async () => {
    try {
      setFetchingPerformance(true);
      const [perfRes, feeStatusRes] = await Promise.all([
        reportService.getTeacherPerformance(),
        feeService.getReport(),
      ]);
      setPerformanceData(perfRes.data.data);
      setFeeStatusReport(feeStatusRes.data.data);
    } catch (error) {
      console.error("Failed to fetch performance data:", error);
      toast.error("Failed to load performance metrics");
    } finally {
      setFetchingPerformance(false);
    }
  };

  useEffect(() => {
    if (activeTab === "performance" && performanceData.length === 0) {
      fetchPerformance();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!reportData) return null;

  const {
    financial_summary,
    academic_summary,
    operational_summary,
    attendance_summary,
  } = reportData;

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DollarSign size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              Financials
            </span>
          </div>
          <h4 className="text-blue-50 opacity-90 text-sm font-medium">
            Total Revenue
          </h4>
          <div className="text-2xl font-bold mt-1">
            ৳{Number(financial_summary.total_revenue).toLocaleString()}
          </div>
          <div className="mt-4 flex items-center text-xs">
            <TrendingUp size={12} className="mr-1" />
            <span>{financial_summary.collection_rate}% Collection Rate</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Users size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              Academic
            </span>
          </div>
          <h4 className="text-indigo-50 opacity-90 text-sm font-medium">
            Avg System Score
          </h4>
          <div className="text-2xl font-bold mt-1">
            {Number(academic_summary.avg_system_score).toFixed(1)}%
          </div>
          <div className="mt-4 flex items-center text-xs">
            <CheckCircle2 size={12} className="mr-1" />
            <span>{academic_summary.total_submissions} Submissions</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg shadow-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <ClipboardList size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              Operations
            </span>
          </div>
          <h4 className="text-purple-50 opacity-90 text-sm font-medium">
            Students/Center
          </h4>
          <div className="text-2xl font-bold mt-1">
            {Number(operational_summary.avg_students_per_center).toFixed(1)}
          </div>
          <div className="mt-4 flex items-center text-xs">
            <Building2 size={12} className="mr-1" />
            <span>{operational_summary.total_centers} Active Centers</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-6 rounded-2xl text-white shadow-lg shadow-teal-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Clock size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              Attendance
            </span>
          </div>
          <h4 className="text-teal-50 opacity-90 text-sm font-medium">
            Overall Rate
          </h4>
          <div className="text-2xl font-bold mt-1">
            {attendance_summary.overall_attendance_rate}%
          </div>
          <div className="mt-4 flex items-center text-xs">
            <Users size={12} className="mr-1" />
            <span>{attendance_summary.today_attendance} Present Today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="mr-2 text-blue-600" size={20} />
            Monthly Collection Summary
          </h3>
          <div className="space-y-4">
            {financial_summary.monthly_collection.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {item.month}
                  </span>
                  <span className="text-gray-500 font-medium">
                    ৳{Number(item.total_collected).toLocaleString()} / ৳
                    {Number(item.total_expected).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(Number(item.total_collected) / Number(item.total_expected)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Wise Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <PieChart className="mr-2 text-indigo-600" size={20} />
            Student Distribution by Center
          </h3>
          <div className="space-y-4">
            {operational_summary.center_wise_distribution.map((center, idx) => {
              const percentage =
                (center.students / operational_summary.total_students) * 100;
              return (
                <div key={idx} className="group">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {center.name}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {center.students} Students ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${idx % 2 === 0 ? "bg-indigo-600" : "bg-indigo-400"}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <GraduationCap className="mr-2 text-purple-600" size={20} />
            Teacher Performance Metrics
          </h3>
          <button
            onClick={fetchPerformance}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {fetchingPerformance ? (
          <div className="p-12 text-center">
            <Spinner size="md" />
            <p className="text-sm text-gray-500 mt-2">
              Loading teacher metrics...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Teacher Name</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Submissions Graded</th>
                  <th className="px-6 py-4">Feedback Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {performanceData.map((teacher, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs mr-3">
                          {teacher.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {teacher.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                        {teacher.student_count} Students
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold">
                        {teacher.graded_count} Graded
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">
                      {teacher.avg_feedback_time === "N/A"
                        ? "Not Tracked"
                        : teacher.avg_feedback_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Wallet className="mr-2 text-indigo-600" size={20} />
              Fee Collection Status
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {feeStatusReport.map((item, idx) => {
              const statusColor =
                item.status === "paid"
                  ? "bg-green-500"
                  : item.status === "overdue"
                    ? "bg-red-500"
                    : "bg-amber-500";
              const percentage =
                (Number(item.total_amount) /
                  feeStatusReport.reduce(
                    (acc, curr) => acc + Number(curr.total_amount),
                    0,
                  )) *
                100;

              return (
                <div key={idx}>
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="font-bold text-gray-700 capitalize">
                      {item.status} ({item.count})
                    </span>
                    <span className="font-bold text-gray-900">
                      ৳{Number(item.total_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${statusColor} h-full transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center">
              <BookOpen size={16} className="mr-2" />
              System Academic Health
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              The system currently maintains an average academic score of{" "}
              <strong>
                {Number(academic_summary.avg_system_score).toFixed(1)}%
              </strong>{" "}
              across all centers. Graduation rates and level progression are
              within target parameters.
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100">
            <h4 className="font-bold text-amber-900 mb-2 flex items-center">
              <TrendingUp size={16} className="mr-2" />
              Operational Efficiency
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Center performance is monitored via student retention and fee
              collection rates. Overall system collection rate is{" "}
              <strong>{financial_summary.collection_rate}%</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Advanced System Reports
          </h2>
          <p className="text-sm text-gray-500 mt-1 italic font-medium">
            Comprehensive multi-dimensional analytics for the entire system
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === "performance"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Efficiency Metrics
          </button>
        </div>
      </div>

      {activeTab === "overview" ? renderOverview() : renderPerformance()}
    </div>
  );
};

export default SuperAdminReports;
