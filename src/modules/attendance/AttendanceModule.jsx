import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  AlertCircle,
  Calendar,
  User,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { attendanceService } from "../../services/attendanceService";
import { studentService } from "../../services/studentService";
import { toast } from "react-hot-toast";

const AttendanceModule = ({ role = "teacher", initialFilters = {} }) => {
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [viewMode, setViewMode] = useState(
    role === "teacher" ? "mark" : "view",
  ); // mark or view

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { ...initialFilters, date: selectedDate };

      if (viewMode === "mark") {
        // Use standard student API for all roles
        const response = await studentService.getAll(params);

        const studentData = response.data;
        const studentList = Array.isArray(studentData?.data)
          ? studentData.data
          : Array.isArray(studentData)
            ? studentData
            : [];

        setStudents(studentList.map((s) => ({ ...s, status: "present" })));
      } else {
        const { data } = await attendanceService.getAll(params);
        setLogs(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, viewMode, JSON.stringify(initialFilters)]);

  const markStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  const handleBulkSubmit = async () => {
    try {
      setSubmitting(true);
      const records = students.map((s) => ({
        student_id: s.id,
        status: s.status,
        date: selectedDate,
      }));
      await attendanceService.mark({ attendance: records });
      toast.success("Attendance submitted successfully");
      if (role !== "teacher") setViewMode("view");
    } catch (error) {
      toast.error("Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    },
    {
      header: "Student",
      accessorKey: "student.name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-400">
            <User size={14} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {row.original.student?.name}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">
              {row.original.student?.enrollment_no}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue()?.toLowerCase() || "absent";
        const variant =
          status === "present"
            ? "green"
            : status === "absent"
              ? "red"
              : "orange";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
  ];

  if (viewMode === "mark") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Mark Attendance
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Daily attendance tracking for assigned students
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {role !== "teacher" && (
              <button
                onClick={() => setViewMode("view")}
                className="px-4 py-2 border rounded-xl hover:bg-gray-50 font-semibold text-gray-600"
              >
                View Logs
              </button>
            )}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none font-medium"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <Spinner size="lg" />
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Student Information
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                      Current Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {student.enrollment_no}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-3">
                          {[
                            { val: "present", icon: Check, color: "green" },
                            { val: "absent", icon: X, color: "red" },
                            { val: "late", icon: Clock, color: "orange" },
                          ].map((b) => (
                            <button
                              key={b.val}
                              onClick={() => markStatus(student.id, b.val)}
                              className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-center ${
                                student.status === b.val
                                  ? `bg-${b.color}-50 border-${b.color}-500 text-${b.color}-600 shadow-sm`
                                  : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300"
                              }`}
                              title={b.val.toUpperCase()}
                            >
                              <b.icon size={20} strokeWidth={3} />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center text-gray-500 italic font-medium">
              No students found for attendance marking.
            </div>
          )}
        </div>

        {students.length > 0 && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleBulkSubmit}
              disabled={submitting}
              className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center"
            >
              {submitting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <CheckCircle2 size={20} className="mr-2" />
              )}
              Submit Daily Attendance
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Attendance History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review attendance logs and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode("mark")}
            className="px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 font-bold flex items-center"
          >
            <CheckCircle2 size={18} className="mr-2" /> Mark Attendance
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none font-semibold text-gray-700"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable columns={columns} data={logs} />
        )}
      </div>
    </div>
  );
};

export default AttendanceModule;
