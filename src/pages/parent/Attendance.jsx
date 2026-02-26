import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { attendanceService } from "../../services/attendanceService";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";

const ParentAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await attendanceService.getChildrenAttendance();
        const data = res.data.data;
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch children attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "present":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
          badge: "green",
        };
      case "absent":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100",
          badge: "red",
        };
      case "late":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-100",
          badge: "yellow",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-100",
          badge: "gray",
        };
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Attendance History
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Monitor your children's daily attendance records and teacher notes.
          </p>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-10">
          {/* Child Selection Bar */}
          <div className="flex flex-wrap gap-4 p-2 bg-gray-50/50 rounded-[2rem] border border-gray-100">
            {reports.map((report) => (
              <button
                key={report.student_info.id}
                onClick={() => setSelectedReport(report)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-3xl transition-all duration-300 ${
                  selectedReport?.student_info.id === report.student_info.id
                    ? "bg-white shadow-xl shadow-indigo-100 border-indigo-100 border text-indigo-700 scale-[1.02]"
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

          {/* Attendance List for Selected Child */}
          {selectedReport && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-50">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    <GraduationCap size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">
                      {selectedReport.student_info.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-bold mt-1">
                      Enrollment No:{" "}
                      <span className="text-indigo-600">
                        {selectedReport.student_info.enrollment_no}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedReport.attendance.length > 0 ? (
                    [...selectedReport.attendance]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((record) => {
                        const config = getStatusConfig(record.status);
                        return (
                          <div
                            key={record.id}
                            className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-50/30 transition-all group"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center space-x-6">
                                <div
                                  className={`w-14 h-14 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center shadow-sm`}
                                >
                                  <config.icon size={28} />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-3">
                                    <p className="text-lg font-black text-gray-900">
                                      {new Date(record.date).toLocaleDateString(
                                        undefined,
                                        {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        },
                                      )}
                                    </p>
                                    <Badge variant={config.badge}>
                                      {record.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center text-gray-400 text-xs font-bold mt-1 uppercase tracking-wider">
                                    <Calendar size={12} className="mr-1.5" />
                                    Recorded on{" "}
                                    {new Date(
                                      record.created_at,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              {record.notes && (
                                <div className="flex items-start md:items-center bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm max-w-md">
                                  <MessageSquare
                                    size={16}
                                    className="text-indigo-400 mr-3 mt-1 md:mt-0 shrink-0"
                                  />
                                  <p className="text-sm text-gray-600 italic font-medium">
                                    "{record.notes}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-20 px-6 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                      <Calendar
                        size={48}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <p className="text-gray-500 font-bold">
                        No attendance records found for this child.
                      </p>
                    </div>
                  )}
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
            No attendance data found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
            We couldn't find any attendance history for your children at this
            time.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentAttendance;
