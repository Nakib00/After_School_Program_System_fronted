import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  Award,
  MessageSquare,
  ChevronRight,
  Download,
  ExternalLink,
  Filter,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { submissionService } from "../../services/submissionService";
import { useAuthStore } from "../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const gradeSchema = z.object({
  score: z.coerce
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  error_count: z.coerce.number().int().min(0).optional().nullable(),
  teacher_feedback: z.string().optional().nullable(),
});

const SubmissionModule = ({ role = "teacher" }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [statusFilter, setStatusFilter] = useState("submitted");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gradeSchema),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await submissionService.getAll({ status: statusFilter });
      setSubmissions(res.data.data.data || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleGrade = (submission) => {
    setSelectedSubmission(submission);
    reset({
      score: submission.status === "graded" ? submission.score : "",
      error_count: submission.status === "graded" ? submission.error_count : 0,
      teacher_feedback:
        submission.status === "graded" ? submission.teacher_feedback : "",
    });
    setIsGradeModalOpen(true);
  };

  const onSubmitGrade = async (data) => {
    try {
      setSubmitting(true);
      // Use the appropriate method based on whether it was already graded or not
      // For this system, the user provided baseurl/submission/id/update-grade
      await submissionService.updateGrade(selectedSubmission.id, data);

      toast.success("Submission graded successfully");
      setIsGradeModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit grade");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Student",
      accessorKey: "student.user.name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User size={16} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {row.original.student?.user?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              ID: {row.original.student?.enrollment_no || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Worksheet",
      accessorKey: "assignment.worksheet.title",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 text-gray-600">
          <FileText size={16} className="text-indigo-400" />
          <span className="text-sm font-medium line-clamp-1">
            {row.original.assignment?.worksheet?.title || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Submitted At",
      accessorKey: "submitted_at",
      cell: ({ getValue }) => (
        <div className="flex items-center text-gray-500 text-sm">
          <Clock size={14} className="mr-1.5" />
          {new Date(getValue()).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() === "graded" ? "green" : "blue"}>
          {getValue()?.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleGrade(row.original)}
            className={`px-4 py-1.5 ${
              row.original.status === "graded"
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            } text-sm font-bold rounded-lg transition-all flex items-center`}
          >
            <Award size={16} className="mr-1.5" />
            {row.original.status === "graded" ? "Edit Grade" : "Grade"}
          </button>
          {row.original.submitted_file && (
            <a
              href={row.original.submitted_file}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="Download/Review File"
            >
              <Download size={18} />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {statusFilter === "submitted"
              ? "Pending Submissions"
              : "Graded Submissions"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {statusFilter === "submitted"
              ? "Review and grade pending student worksheet submissions"
              : "Review and update previously graded submissions"}
          </p>
        </div>
        <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setStatusFilter("submitted")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              statusFilter === "submitted"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("graded")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              statusFilter === "graded"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Graded
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium">
              Loading submissions...
            </p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
              {statusFilter === "submitted" ? (
                <CheckCircle2 size={32} />
              ) : (
                <FileText size={32} />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {statusFilter === "submitted"
                ? "All Caught Up!"
                : "No Graded Work"}
            </h3>
            <p className="text-gray-500 mt-1">
              {statusFilter === "submitted"
                ? "There are no pending submissions to grade at the moment."
                : "You haven't graded any submissions yet."}
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={submissions} />
        )}
      </div>

      {/* Grading Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => !submitting && setIsGradeModalOpen(false)}
        title={
          selectedSubmission?.status === "graded"
            ? "Update Submission Grade"
            : "Grade Assignment Submission"
        }
        size="lg"
      >
        {selectedSubmission && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Submission Context & File */}
            <div className="space-y-6">
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">
                      {selectedSubmission.assignment?.worksheet?.title}
                    </h4>
                    <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">
                      Student: {selectedSubmission.student?.user?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Max Marks:</span>
                    <span className="font-bold text-gray-900">
                      {selectedSubmission.assignment?.worksheet?.total_marks}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time Limit:</span>
                    <span className="font-bold text-gray-900">
                      {
                        selectedSubmission.assignment?.worksheet
                          ?.time_limit_minutes
                      }
                      m
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Student Time:</span>
                    <span className="font-bold text-indigo-600">
                      {selectedSubmission.time_taken_min}m
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-sm font-bold text-gray-900 flex items-center">
                  <FileText size={16} className="mr-2 text-gray-400" />
                  Submitted Asset
                </h5>
                <div className="relative group rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 aspect-[4/3] flex items-center justify-center">
                  {selectedSubmission.submitted_file && (
                    <>
                      {selectedSubmission.submitted_file.match(
                        /\.(jpg|jpeg|png|gif)$/i,
                      ) ? (
                        <img
                          src={selectedSubmission.submitted_file}
                          alt="Submission"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <FileText
                            size={64}
                            className="mx-auto text-gray-300 mb-4"
                          />
                          <p className="text-sm text-gray-500 font-medium">
                            File Submission
                          </p>
                          <a
                            href={selectedSubmission.submitted_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center text-indigo-600 font-bold hover:underline"
                          >
                            <Download size={16} className="mr-1.5" />
                            Download to Review
                          </a>
                        </div>
                      )}
                      <a
                        href={selectedSubmission.submitted_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2"
                      >
                        <ExternalLink size={20} />
                        View Full Size / Download
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Grading Form */}
            <form onSubmit={handleSubmit(onSubmitGrade)} className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start space-x-3">
                  <Award
                    className="text-orange-500 shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="text-xs text-orange-700 italic">
                    {selectedSubmission.status === "graded"
                      ? "You are updating a previously assigned grade. This will recalculate the student's progress."
                      : "Please review the student's submission carefully before assigning a final score. Feedback is encouraged for student progress."}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 flex justify-between">
                    Final Score
                    <span className="text-[10px] text-gray-400 font-normal">
                      0 - 100
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("score")}
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      %
                    </span>
                  </div>
                  {errors.score && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.score.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Error Count
                  </label>
                  <input
                    type="number"
                    {...register("error_count")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Number of mistakes..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Teacher Feedback
                  </label>
                  <textarea
                    {...register("teacher_feedback")}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Ex: Good effort! Focus more on the algebraic steps next time..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="flex-1 px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Award size={18} className="mr-2" />
                      {selectedSubmission.status === "graded"
                        ? "Update Grade"
                        : "Post Grade"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionModule;
