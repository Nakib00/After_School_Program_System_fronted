import React, { useState, useEffect } from "react";
import {
  Upload,
  Download,
  FileText,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { studentService } from "../../services/studentService";
import { submissionService } from "../../services/submissionService";
import { useAuthStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";

const SubmitWork = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [file, setFile] = useState(null);
  const [timeTaken, setTimeTaken] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const studentId = user?.student?.id || user?.id;
        if (!studentId) return;

        const response = await studentService.getAssignments(studentId);
        const pending = (response.data.data || []).filter(
          (a) => a.status === "pending",
        );
        setAssignments(pending);

        // If assignmentId was passed in location.state, select it
        if (location.state?.assignmentId) {
          setSelectedAssignment(location.state.assignmentId.toString());
        } else if (pending.length > 0) {
          setSelectedAssignment(pending[0].id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAssignments();
  }, [user, location.state]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return toast.error("Please select an assignment");
    if (!file) return toast.error("Please upload your completed worksheet");

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("assignment_id", selectedAssignment);
      formData.append("submitted_file", file);
      if (timeTaken) formData.append("time_taken_min", timeTaken);
      if (notes) formData.append("notes", notes);

      await submissionService.create(formData);
      toast.success("Worksheet submitted successfully!");
      navigate("/student/assignments");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit worksheet",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentAssignment = assignments.find(
    (a) => a.id.toString() === selectedAssignment,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Submit Your Work</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload your completed worksheet for grading
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-100">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Select Assignment
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            >
              <option value="" disabled>
                Choose an assignment
              </option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.worksheet?.title}
                </option>
              ))}
            </select>
            {assignments.length === 0 && (
              <p className="text-xs text-orange-600 flex items-center">
                <AlertCircle size={12} className="mr-1" /> No pending
                assignments found.
              </p>
            )}
          </div>
          <div className="flex items-end">
            <a
              href={currentAssignment?.worksheet?.file_url}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors w-full justify-center font-bold text-sm ${!currentAssignment ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Download size={18} className="mr-2" />
              Download Worksheet (PDF)
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Time Taken (Minutes)
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(e.target.value)}
                  placeholder="e.approx 20 mins"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            {/* Notes if needed, the controller doesn't explicitly handle notes but Submission model might */}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Upload Completed Work
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer group ${file ? "border-indigo-400 bg-indigo-50/30" : "border-gray-200 hover:border-indigo-400 hover:bg-gray-50"}`}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,image/*"
              />
              {file ? (
                <div className="text-center">
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-3">
                    <FileText size={40} className="text-indigo-600" />
                  </div>
                  <p className="font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-4 text-sm text-red-500 font-bold hover:underline flex items-center justify-center mx-auto"
                  >
                    <X size={14} className="mr-1" /> Remove File
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="p-4 bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors inline-block mb-4">
                    <Upload
                      size={32}
                      className="text-gray-400 group-hover:text-indigo-500"
                    />
                  </div>
                  <p className="font-bold text-gray-700">
                    Click or drag & drop to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    Accepts PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting || !file || !selectedAssignment}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:shadow-none flex items-center"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Submitting...
                </>
              ) : (
                "Submit Assignment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitWork;
