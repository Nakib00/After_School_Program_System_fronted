import React, { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";

const AttendanceTable = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Anisul Islam", enrollment_no: "K-001", status: null },
    { id: 2, name: "Sumiya Khan", enrollment_no: "K-002", status: null },
  ]);

  const markStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg outline-none"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Submit Attendance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">
                    {student.enrollment_no}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => markStatus(student.id, "present")}
                      className={`p-2 rounded-lg border transition-all ${student.status === "present" ? "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-500" : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-green-50"}`}
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => markStatus(student.id, "absent")}
                      className={`p-2 rounded-lg border transition-all ${student.status === "absent" ? "bg-red-100 border-red-500 text-red-700 ring-2 ring-red-500" : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-red-50"}`}
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={() => markStatus(student.id, "late")}
                      className={`p-2 rounded-lg border transition-all ${student.status === "late" ? "bg-yellow-100 border-yellow-500 text-yellow-700 ring-2 ring-yellow-500" : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-yellow-50"}`}
                    >
                      <AlertCircle size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
