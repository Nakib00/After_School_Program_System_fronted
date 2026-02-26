import React, { useState, useEffect } from "react";
import {
  Download,
  Upload,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  Info,
  Calendar,
  User,
  GraduationCap,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { studentService } from "../../services/studentService";
import { submissionService } from "../../services/submissionService";
import { assignmentService } from "../../services/assignmentService";
import { worksheetService } from "../../services/worksheetService";
import { useAuthStore } from "../../store/authStore";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { WORKSHEETS } from "../../services/apiEndpoints";

const MyAssignments = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedAssignmentInfo, setSelectedAssignmentInfo] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await studentService.getMyAssignments();
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

  const handleViewResult = async (assignmentId) => {
    try {
      setDetailsLoading(true);
      setIsModalOpen(true);
      const response = await submissionService.getByAssignment(assignmentId);
      setSelectedSubmission(response.data.data || null);
    } catch (error) {
      console.error("Failed to fetch submission details:", error);
      toast.error("Failed to load result details");
      setIsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewInfo = async (assignmentId) => {
    try {
      setDetailsLoading(true);
      setIsInfoModalOpen(true);
      const response = await assignmentService.getById(assignmentId);
      setSelectedAssignmentInfo(response.data.data || null);
    } catch (error) {
      console.error("Failed to fetch assignment info:", error);
      toast.error("Failed to load assignment info");
      setIsInfoModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDownload = async (worksheetId, title) => {
    try {
      setDownloading(worksheetId);
      const response = await worksheetService.download(worksheetId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${title.replace(/\s+/g, "_")}_Worksheet.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Worksheet download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download worksheet");
    } finally {
      setDownloading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
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
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Due Date:</span>
                  <span
                    className={`font-medium ${assignment.status === "assigned" || assignment.status === "pending" ? "text-red-500" : "text-gray-700"}`}
                  >
                    {assignment.due_date}
                  </span>
                </div>
                {assignment.teacher && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned by:</span>
                    <span className="font-medium text-gray-700">
                      {assignment.teacher.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={() =>
                    handleDownload(
                      assignment.worksheet?.id,
                      assignment.worksheet?.title,
                    )
                  }
                  disabled={downloading === assignment.worksheet?.id}
                  className="flex-1 flex items-center justify-center py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-100 disabled:opacity-50"
                >
                  {downloading === assignment.worksheet?.id ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : (
                    <Download size={16} className="mr-2" />
                  )}
                  {downloading === assignment.worksheet?.id
                    ? "Downloading..."
                    : "View Worksheet"}
                </button>
                {(assignment.status === "submitted" ||
                  assignment.status === "graded") && (
                  <button
                    onClick={() => handleViewResult(assignment.id)}
                    className="flex-1 flex items-center justify-center py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-100"
                  >
                    View Result
                  </button>
                )}
                {(assignment.status === "assigned" ||
                  assignment.status === "pending") && (
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
                <button
                  onClick={() => handleViewInfo(assignment.id)}
                  className="flex items-center justify-center p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                  title="View Info"
                >
                  <Info size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assignment Result"
        size="lg"
      >
        {detailsLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : selectedSubmission ? (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedSubmission.assignment?.worksheet?.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted on:{" "}
                    {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </p>
                </div>
                {selectedSubmission.status === "graded" && (
                  <div className="text-center">
                    <div className="text-3xl font-black text-indigo-600">
                      {selectedSubmission.score}
                    </div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Score
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Time Taken
                </p>
                <p className="text-lg font-bold text-gray-900 flex items-center">
                  <Clock size={18} className="mr-2 text-indigo-500" />
                  {selectedSubmission.time_taken_min || "N/A"} mins
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Status
                </p>
                <div className="mt-1">
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </div>
            </div>

            {selectedSubmission.status === "graded" && (
              <div className="space-y-4">
                <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                  <h4 className="font-bold text-green-900 flex items-center mb-2">
                    <CheckCircle2 size={18} className="mr-2" />
                    Teacher's Feedback
                  </h4>
                  <p className="text-green-800 text-sm italic">
                    "{selectedSubmission.teacher_feedback || "Excellent work!"}"
                  </p>
                </div>

                {selectedSubmission.grader && (
                  <div className="flex items-center space-x-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden border border-gray-100">
                      {selectedSubmission.grader.profile_photo_path ? (
                        <img
                          src={selectedSubmission.grader.profile_photo_path}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                          {selectedSubmission.grader.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Graded by
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedSubmission.grader.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex space-x-4">
              <a
                href={selectedSubmission.file_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-sm shadow-lg shadow-gray-200"
              >
                <FileText size={18} className="mr-2" />
                View Submitted File
              </a>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-white text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No submission details found.</p>
          </div>
        )}
      </Modal>

      {/* Assignment Info Modal */}
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Assignment Details"
        size="lg"
      >
        {detailsLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : selectedAssignmentInfo ? (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Badge variant="indigo" className="mb-1">
                    {selectedAssignmentInfo.worksheet?.subject?.name}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedAssignmentInfo.worksheet?.title}
                  </h3>
                  <div className="flex items-center text-xs text-indigo-600 font-medium">
                    <Calendar size={12} className="mr-1" />
                    Assigned:{" "}
                    {new Date(
                      selectedAssignmentInfo.created_at,
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Due Date
                  </span>
                  <div className="text-lg font-black text-indigo-600">
                    {selectedAssignmentInfo.due_date}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  Level
                </p>
                <p className="text-base font-bold text-gray-900 flex items-center">
                  <GraduationCap size={18} className="mr-2 text-indigo-500" />
                  {selectedAssignmentInfo.worksheet?.level?.name || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  Status
                </p>
                <div className="">
                  {getStatusBadge(selectedAssignmentInfo.status)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 flex items-center">
                <FileText size={18} className="mr-2 text-indigo-600" />
                Worksheet Information
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedAssignmentInfo.worksheet?.description ||
                  "No description provided for this worksheet."}
              </p>
            </div>

            {selectedAssignmentInfo.notes && (
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center">
                  <Info size={18} className="mr-2 text-indigo-600" />
                  Additional Instructions
                </h4>
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800 text-sm">
                  {selectedAssignmentInfo.notes}
                </div>
              </div>
            )}

            {selectedAssignmentInfo.teacher && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Assigned By
                </h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl border-2 border-white shadow-sm overflow-hidden">
                    {selectedAssignmentInfo.teacher.profile_photo_path ? (
                      <img
                        src={selectedAssignmentInfo.teacher.profile_photo_path}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedAssignmentInfo.teacher.name?.charAt(0) || "T"
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {selectedAssignmentInfo.teacher.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedAssignmentInfo.teacher.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex space-x-4">
              <button
                onClick={() =>
                  handleDownload(
                    selectedAssignmentInfo.worksheet?.id,
                    selectedAssignmentInfo.worksheet?.title,
                  )
                }
                disabled={downloading === selectedAssignmentInfo.worksheet?.id}
                className="flex-1 flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {downloading === selectedAssignmentInfo.worksheet?.id ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <Download size={18} className="mr-2" />
                )}
                {downloading === selectedAssignmentInfo.worksheet?.id
                  ? "Downloading..."
                  : "Download Worksheet"}
              </button>
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="px-6 py-3 bg-white text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No assignment information found.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyAssignments;
