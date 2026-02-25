import React, { useState, useEffect } from "react";
import {
  Download,
  Upload,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { studentService } from "../../services/studentService";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const MyAssignments = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // Assuming student ID is user.student.id or just user.id based on context
        const studentId = user?.student?.id || user?.id;
        if (!studentId) return;

        const response = await studentService.getAssignments(studentId);
        setAssignments(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAssignments();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="yellow" className="flex items-center">
            <Clock size={12} className="mr-1" /> Pending
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="blue" className="flex items-center">
            <CheckCircle2 size={12} className="mr-1" /> Submitted
          </Badge>
        );
      case "graded":
        return (
          <Badge variant="green" className="flex items-center">
            <CheckCircle2 size={12} className="mr-1" /> Graded
          </Badge>
        );
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and submit your worksheets
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-200 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No assignments found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge variant="indigo" className="mb-2">
                    {assignment.worksheet?.subject?.name || "Subject"}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {assignment.worksheet?.title || "Untiled Worksheet"}
                  </h3>
                </div>
                {assignment.status === "graded" &&
                  assignment.submission?.score && (
                    <div className="text-2xl font-black text-green-600">
                      {assignment.submission.score}
                    </div>
                  )}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  {getStatusBadge(assignment.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date:</span>
                  <span
                    className={`font-medium ${assignment.status === "pending" ? "text-red-500" : "text-gray-700"}`}
                  >
                    {assignment.due_date}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 mt-auto">
                <a
                  href={assignment.worksheet?.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-100"
                >
                  <Download size={16} className="mr-2" />
                  View
                </a>
                {assignment.status === "pending" && (
                  <button
                    onClick={() =>
                      navigate("/student/submit", {
                        state: { assignmentId: assignment.id },
                      })
                    }
                    className="flex-1 flex items-center justify-center py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md shadow-indigo-100"
                  >
                    <Upload size={16} className="mr-2" />
                    Submit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssignments;
