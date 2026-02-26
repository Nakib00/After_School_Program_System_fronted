import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  User,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { assignmentService } from "../../services/assignmentService";
import { worksheetService } from "../../services/worksheetService";
import { submissionService } from "../../services/submissionService";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { toast } from "react-hot-toast";

const ParentAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await assignmentService.getChildrenAssignments();
        const data = res.data.data;
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch children assignments:", error);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleDownloadWorksheet = async (worksheetId, title) => {
    try {
      const response = await worksheetService.download(worksheetId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download worksheet");
    }
  };

  const handleDownloadSubmission = async (submissionId, studentName) => {
    try {
      const response = await submissionService.download(submissionId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Submission_${studentName}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download submission");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "graded":
        return (
          <Badge variant="green" className="font-bold">
            Graded
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="blue" className="font-bold">
            Submitted
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="yellow" className="font-bold">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

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
            Academic Assignments
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            View and download assignments, submissions, and teacher evaluations.
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

          {/* Assignments for Selected Child */}
          {selectedReport && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-5">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">
                      {selectedReport.assignments.length}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Total Assignments
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-5">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <FileCheck size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">
                      {
                        selectedReport.assignments.filter(
                          (a) => a.status === "graded",
                        ).length
                      }
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Graded Tasks
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-5">
                  <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">
                      {
                        selectedReport.assignments.filter(
                          (a) => a.status === "pending",
                        ).length
                      }
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Pending Tasks
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedReport.assignments.length > 0 ? (
                  selectedReport.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/40 transition-all overflow-hidden group"
                    >
                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Primary Info */}
                          <div className="flex-1 space-y-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                  <FileText size={28} />
                                </div>
                                <div>
                                  <h4 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {assignment.worksheet?.title}
                                  </h4>
                                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                    Worksheet #
                                    {assignment.worksheet?.worksheet_no ||
                                      "N/A"}
                                  </p>
                                </div>
                              </div>
                              {getStatusBadge(assignment.status)}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                  Due Date
                                </p>
                                <p className="text-sm font-black text-gray-900 flex items-center mt-1">
                                  <Calendar
                                    size={14}
                                    className="mr-1.5 text-red-500"
                                  />
                                  {new Date(
                                    assignment.due_date,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                  Assigned Date
                                </p>
                                <p className="text-sm font-black text-gray-900 flex items-center mt-1">
                                  <Calendar
                                    size={14}
                                    className="mr-1.5 text-indigo-500"
                                  />
                                  {new Date(
                                    assignment.assigned_date,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                  Teacher
                                </p>
                                <p className="text-sm font-black text-gray-900 flex items-center mt-1">
                                  <User
                                    size={14}
                                    className="mr-1.5 text-indigo-600"
                                  />
                                  {assignment.teacher?.name}
                                </p>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                  Max Marks
                                </p>
                                <p className="text-sm font-black text-gray-900 flex items-center mt-1">
                                  <BarChart3
                                    size={14}
                                    className="mr-1.5 text-indigo-600"
                                  />
                                  {assignment.worksheet?.total_marks} Pts
                                </p>
                              </div>
                            </div>

                            {assignment.notes && (
                              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">
                                  Teacher Instructions
                                </p>
                                <p className="text-sm text-indigo-700 italic font-medium">
                                  "{assignment.notes}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Evaluation / Submission Side */}
                          <div className="lg:w-80 space-y-4">
                            {assignment.submission ? (
                              <div className="h-full flex flex-col space-y-4">
                                <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                                  <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                      Final Score
                                    </p>
                                    <div className="bg-white/20 p-2 rounded-xl">
                                      <GraduationCap size={16} />
                                    </div>
                                  </div>
                                  <div className="flex items-baseline space-x-1">
                                    <h5 className="text-4xl font-black">
                                      {assignment.submission.score}
                                    </h5>
                                    <span className="text-lg opacity-60 font-bold">
                                      / {assignment.worksheet?.total_marks}
                                    </span>
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[9px] font-bold opacity-60 uppercase">
                                        Errors
                                      </p>
                                      <p className="font-black">
                                        {assignment.submission.error_count}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-bold opacity-60 uppercase">
                                        Time Taken
                                      </p>
                                      <p className="font-black">
                                        {assignment.submission.time_taken_min}m
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {(assignment.submission.teacher_feedback ||
                                  assignment.submission.submitted_file) && (
                                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex-1 flex flex-col justify-between">
                                    {assignment.submission.teacher_feedback && (
                                      <div className="mb-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center">
                                          <MessageSquare
                                            size={12}
                                            className="mr-1.5"
                                          />
                                          Feedback
                                        </p>
                                        <p className="text-sm text-gray-700 font-medium italic leading-relaxed">
                                          "
                                          {
                                            assignment.submission
                                              .teacher_feedback
                                          }
                                          "
                                        </p>
                                      </div>
                                    )}
                                    <div className="space-y-3">
                                      <button
                                        onClick={() =>
                                          handleDownloadWorksheet(
                                            assignment.worksheet.id,
                                            assignment.worksheet.title,
                                          )
                                        }
                                        className="w-full flex items-center justify-center space-x-2 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                                      >
                                        <Download size={14} />
                                        <span>Worksheet</span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDownloadSubmission(
                                            assignment.submission.id,
                                            selectedReport.student_info.name,
                                          )
                                        }
                                        className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-black text-indigo-700 hover:bg-indigo-100 transition-all"
                                      >
                                        <Download size={14} />
                                        <span>Child Submission</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-full bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-300 shadow-sm mb-4">
                                  <FileText size={28} />
                                </div>
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                  No Submission Yet
                                </p>
                                <button
                                  onClick={() =>
                                    handleDownloadWorksheet(
                                      assignment.worksheet.id,
                                      assignment.worksheet.title,
                                    )
                                  }
                                  className="mt-6 flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                                >
                                  <Download size={14} />
                                  <span>Download Worksheet</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-gray-50 rounded-[4rem] border border-dashed border-gray-200">
                    <FileText
                      size={64}
                      className="mx-auto text-gray-200 mb-4"
                    />
                    <h5 className="text-xl font-black text-gray-400 tracking-tight">
                      No assignments assigned to this child
                    </h5>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[4rem] border border-dashed border-gray-200 text-center shadow-inner">
          <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center mx-auto mb-8 border border-gray-100">
            <User size={48} className="text-gray-300" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
            No assignment data found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
            We couldn't find any assignment history for your children at this
            time.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentAssignments;
