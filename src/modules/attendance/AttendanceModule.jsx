import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Users,
  CheckSquare,
  History,
  AlertCircle,
  Save,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserMinus,
  UserX,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";
import { attendanceService } from "../../services/attendanceService";
import { teacherService } from "../../services/teacherService";
import { studentService } from "../../services/studentService";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const AttendanceModule = ({ role = "teacher" }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(
    role === "teacher" ? "mark" : "history",
  ); // "mark" or "history"
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState([]);

  // Mark Tab State
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState({}); // { studentId: { status, notes } }

  // History Tab State
  const [history, setHistory] = useState([]);
  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7),
  ); // YYYY-MM

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const params = { month: filterMonth };
      const centerId =
        user?.center_id || user?.center?.id || user?.student?.center_id;
      if (centerId) {
        params.center_id = centerId;
      }

      if (activeTab === "mark") {
        let studentsData = [];
        if (role === "teacher") {
          const res = await teacherService.getStudents(user.id);
          studentsData = res.data.data || [];
        } else if (role === "center_admin" || role === "super_admin") {
          const res = await studentService.getAll({
            center_id: user.center_id,
          });
          studentsData = res.data.data || [];
        }
        setStudents(studentsData);

        // Initialize attendance data with 'present' by default
        const initial = {};
        studentsData.forEach((s) => {
          initial[s.id] = { status: "present", notes: "" };
        });
        setAttendanceData(initial);
      } else {
        const historyRes = await attendanceService.getAll(params);
        setHistory(historyRes.data.data || []);
      }

      if (role !== "parents") {
        const summaryRes = await attendanceService.getSummary(params);
        setSummary(summaryRes.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, user?.id, filterMonth]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes },
    }));
  };

  const handleMarkBulk = async () => {
    if (students.length === 0) return;

    try {
      setSubmitting(true);
      // Assuming teacher's first student's center_id is the reference for the center
      const payload = {
        center_id: user.center_id || students[0]?.center_id,
        date: selectedDate,
        attendance: Object.entries(attendanceData).map(([studentId, data]) => ({
          student_id: parseInt(studentId),
          status: data.status,
          notes: data.notes,
        })),
      };

      await attendanceService.markBulk(payload);
      toast.success("Attendance marked successfully");
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const historyColumns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">
          {new Date(getValue()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Student",
      accessorKey: "student.user.name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 overflow-hidden flex items-center justify-center text-indigo-600 border border-indigo-100">
            {row.original.student?.user?.profile_photo_path ? (
              <img
                src={row.original.student.user.profile_photo_path}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={14} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {row.original.student?.user?.name}
            </p>
            <p className="text-[10px] text-gray-500">
              ID: {row.original.student?.enrollment_no || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const val = getValue();
        const colors = { present: "green", absent: "red", late: "yellow" };
        return (
          <Badge variant={colors[val] || "gray"}>
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500 italic max-w-xs truncate block">
          {getValue() || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage student daily attendance
          </p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden w-fit">
          {role === "teacher" && (
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "mark"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CheckSquare size={16} className="mr-2" />
              Mark Today
            </button>
          )}
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "history" || role !== "teacher"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <History size={16} className="mr-2" />
            History
          </button>
        </div>
      </div>

      {role !== "parents" && summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: "present",
              label: "Present",
              color: "green",
              icon: UserCheck,
            },
            { id: "late", label: "Late", color: "yellow", icon: Clock },
            { id: "absent", label: "Absent", color: "red", icon: UserX },
          ].map((item) => {
            const stats = summary.find((s) => s.status === item.id) || {
              count: 0,
            };
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 bg-${item.color}-50 text-${item.color}-600 rounded-xl`}
                  >
                    <item.icon size={24} />
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider text-${item.color}-600`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.count}
                  </h3>
                  <span className="text-sm text-gray-500">Recordings</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "mark" ? (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              <Calendar size={18} className="mr-2 text-indigo-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="bg-transparent outline-none font-semibold text-sm"
              />
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
              <Users size={16} className="text-indigo-600" />
              <span className="font-bold text-indigo-900">
                {students.length}
              </span>
              <span>Assigned Students</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-20 text-center">
                <Spinner size="lg" />
              </div>
            ) : students.length === 0 ? (
              <div className="p-20 text-center">
                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500">
                  No students found assigned to you.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Notes (Optional)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students.map((student) => (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center text-indigo-600 font-bold border border-white shadow-sm">
                                {student.user?.profile_photo_path ? (
                                  <img
                                    src={student.user.profile_photo_path}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  student.user?.name?.charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">
                                  {student.user?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {student.current_level} Level
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {[
                                {
                                  id: "present",
                                  icon: UserCheck,
                                  color: "text-green-600",
                                  bg: "bg-green-50",
                                  border: "border-green-200",
                                },
                                {
                                  id: "late",
                                  icon: Clock,
                                  color: "text-yellow-600",
                                  bg: "bg-yellow-50",
                                  border: "border-yellow-200",
                                },
                                {
                                  id: "absent",
                                  icon: UserX,
                                  color: "text-red-600",
                                  bg: "bg-red-50",
                                  border: "border-red-200",
                                },
                              ].map((status) => (
                                <button
                                  key={status.id}
                                  onClick={() =>
                                    handleStatusChange(student.id, status.id)
                                  }
                                  className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center min-w-[64px] ${
                                    attendanceData[student.id]?.status ===
                                    status.id
                                      ? `${status.bg} ${status.border} ${status.color} scale-105 shadow-sm`
                                      : "bg-white border-transparent text-gray-400 grayscale opacity-60"
                                  }`}
                                >
                                  <status.icon size={20} />
                                  <span className="text-[10px] font-bold mt-1 uppercase">
                                    {status.id}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={attendanceData[student.id]?.notes || ""}
                              onChange={(e) =>
                                handleNotesChange(student.id, e.target.value)
                              }
                              placeholder="Reason for absence..."
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleMarkBulk}
                    disabled={submitting || students.length === 0}
                    className="flex items-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Mark Attendance
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-600">
                Filter By Month:
              </span>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500 font-medium">
                  Present
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-500 font-medium">Late</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-500 font-medium">
                  Absent
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-20 text-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <DataTable columns={historyColumns} data={history} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;
