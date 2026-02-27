import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Building2,
  Calendar,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import { toast } from "react-hot-toast";

const ReportModule = ({ centerId }) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (centerId) {
      fetchReport();
    }
  }, [centerId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.getCenterDetailedReport(centerId);
      setReportData(response.data.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to load center report data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          No Report Data Available
        </h3>
        <p className="text-gray-500 mt-2">
          Could not generate the center report at this time.
        </p>
        <button
          onClick={fetchReport}
          className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    center_info,
    financial_summary,
    academic_summary,
    operational_summary,
    attendance_summary,
  } = reportData;

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:bg-${color}-100 transition-colors`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? "text-emerald-600" : "text-rose-600"}`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-900">
            {typeof value === "number" &&
            title.toLowerCase().includes("revenue")
              ? `$${value.toLocaleString()}`
              : value}
          </span>
          {subtitle && (
            <span className="text-xs text-gray-400">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 border-2 border-primary-50">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {center_info?.name}
            </h1>
            <p className="text-gray-500 flex items-center gap-2 mt-0.5">
              <Calendar className="w-4 h-4" />
              Comprehensive Center Report & Analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReport}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Financial Performance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={financial_summary.total_revenue}
            icon={DollarSign}
            color="emerald"
            subtitle="Paid"
          />
          <StatCard
            title="Pending Revenue"
            value={financial_summary.pending_revenue}
            icon={Clock}
            color="amber"
            subtitle="Unpaid/Overdue"
          />
          <StatCard
            title="Collection Rate"
            value={`${Number(financial_summary.collection_rate || 0).toFixed(1)}%`}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Collection Efficiency"
            value={
              financial_summary.collection_rate > 90
                ? "Excellent"
                : "Needs Review"
            }
            icon={CheckCircle2}
            color={financial_summary.collection_rate > 90 ? "emerald" : "amber"}
          />
        </div>
      </section>

      {/* Academic & Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Summary */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Academic Activities
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {operational_summary.total_students}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Active Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Number(
                    (operational_summary.active_students /
                      operational_summary.total_students) *
                      100 || 0,
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Submission Rate</span>
                <span className="font-bold text-indigo-600">
                  {academic_summary.submission_rate}%
                </span>
              </div>
              <div className="w-full bg-indigo-50 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${academic_summary.submission_rate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500">
                  Avg Center Score
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {Number(academic_summary.avg_center_score || 0).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500">
                  Total Assignments
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {academic_summary.total_assignments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Operational & Attendance Summary */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-600" />
            Operations & Attendance
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Overall Attendance
                  </p>
                  <p className="text-xs text-gray-500">Center-wide average</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-rose-600">
                {attendance_summary.overall_attendance_rate}%
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Total Teachers</span>
                <span className="font-bold text-gray-900">
                  {operational_summary.total_teachers}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Attendance Today</span>
                <span className="font-bold text-emerald-600">
                  {attendance_summary.today_attendance}
                </span>
              </div>
            </div>

            <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl mt-2">
              <div className="flex gap-3">
                <BarChart3 className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Operational Health
                  </p>
                  <p className="text-xs text-primary-700 mt-0.5">
                    {attendance_summary.overall_attendance_rate > 85
                      ? "The center maintains healthy engagement levels."
                      : "Attention needed for student engagement."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Collection Summary (Table/List) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Monthly Collection Breakdown
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Month
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Expected
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Collected
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Rate
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {financial_summary.monthly_collection.map((item, idx) => {
                const rate =
                  item.total_expected > 0
                    ? (item.total_collected / item.total_expected) * 100
                    : 100;
                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      ${item.total_expected.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">
                      ${item.total_collected.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rate > 90 ? "bg-emerald-500" : rate > 70 ? "bg-amber-500" : "bg-rose-500"}`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          {Number(rate || 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rate > 95
                            ? "bg-emerald-100 text-emerald-700"
                            : rate > 80
                              ? "bg-blue-100 text-blue-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {rate > 95
                          ? "Excellent"
                          : rate > 80
                            ? "Good"
                            : "Action Needed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ReportModule;
