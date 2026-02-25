import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Download,
  Eye,
  Search,
  BookOpen,
  Layers,
  Clock,
  Target,
  FileDown,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { worksheetService } from "../../services/worksheetService";
import { subjectService } from "../../services/subjectService";
import { levelService } from "../../services/levelService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const worksheetSchema = z.object({
  subject_id: z.string().min(1, "Subject is required"),
  level_id: z.string().min(1, "Level is required"),
  title: z.string().min(1, "Title is required").max(200),
  worksheet_no: z.string().max(50).optional().nullable(),
  description: z.string().optional().nullable(),
  total_marks: z.coerce.number().int().optional().nullable(),
  time_limit_minutes: z.coerce.number().int().optional().nullable(),
  pdf_file: z.any().optional(),
});

const WorksheetModule = ({ role = "teacher" }) => {
  const [worksheets, setWorksheets] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);
  const [mode, setMode] = useState("add");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(worksheetSchema),
  });

  const selectedSubjectId = watch("subject_id");

  useEffect(() => {
    if (selectedSubjectId) {
      setFilteredLevels(
        levels.filter((l) => l.subject_id === parseInt(selectedSubjectId)),
      );
    } else {
      setFilteredLevels([]);
    }
  }, [selectedSubjectId, levels]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [wsRes, subRes, lvlRes] = await Promise.all([
        worksheetService.getAll(),
        subjectService.getAllActive(),
        levelService.getAll(),
      ]);
      setWorksheets(wsRes.data.data || []);
      setSubjects(subRes.data.data || []);
      setLevels(lvlRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch worksheets data:", error);
      toast.error("Failed to load worksheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setMode("add");
    reset({
      subject_id: "",
      level_id: "",
      title: "",
      worksheet_no: "",
      description: "",
      total_marks: 100,
      time_limit_minutes: 60,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (ws) => {
    setMode("edit");
    setSelectedWorksheet(ws);
    reset({
      subject_id: ws.subject_id.toString(),
      level_id: ws.level_id.toString(),
      title: ws.title,
      worksheet_no: ws.worksheet_no || "",
      description: ws.description || "",
      total_marks: ws.total_marks,
      time_limit_minutes: ws.time_limit_minutes,
    });
    setIsModalOpen(true);
  };

  const handleView = async (ws) => {
    try {
      setSelectedWorksheet(ws);
      setIsDetailsModalOpen(true);
      const res = await worksheetService.getById(ws.id);
      setSelectedWorksheet(res.data.data);
    } catch (error) {
      toast.error("Failed to load worksheet details");
    }
  };

  const handleDeleteClick = (ws) => {
    setSelectedWorksheet(ws);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await worksheetService.remove(selectedWorksheet.id);
      toast.success("Worksheet deleted successfully");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete worksheet");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (ws) => {
    try {
      toast.loading("Downloading...", { id: "download" });
      const res = await worksheetService.download(ws.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${ws.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Downloaded successfully", { id: "download" });
    } catch (error) {
      toast.error("Download failed", { id: "download" });
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "pdf_file" && data[key]?.length > 0) {
          formData.append(key, data[key][0]);
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      if (mode === "add") {
        if (!data.pdf_file || data.pdf_file.length === 0) {
          toast.error("PDF file is required");
          setSubmitting(false);
          return;
        }
        await worksheetService.create(formData);
        toast.success("Worksheet created successfully");
      } else {
        // Some APIs prefer POST for updates when files are involved
        await worksheetService.update(selectedWorksheet.id, formData);
        toast.success("Worksheet updated successfully");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Worksheet Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <FileText size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 line-clamp-1">
              {row.original.title}
            </span>
            <span className="text-xs text-gray-500">
              No: {row.original.worksheet_no || "N/A"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Curriculum",
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-xs text-gray-600">
            <BookOpen size={12} className="mr-1 text-indigo-400" />
            {row.original.subject?.name || "N/A"}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Layers size={12} className="mr-1 text-indigo-400" />
            {row.original.level?.name || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Details",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center px-2 py-1 bg-gray-50 rounded text-gray-600">
            <Target size={12} className="mr-1" />
            {row.original.total_marks} Marks
          </div>
          <div className="flex items-center px-2 py-1 bg-gray-50 rounded text-gray-600">
            <Clock size={12} className="mr-1" />
            {row.original.time_limit_minutes}m
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row.original)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDownload(row.original)}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Worksheet Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage curriculum worksheets for assignments
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Add Worksheet
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium">
              Loading worksheets...
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={worksheets} />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={
          mode === "add" ? "Upload New Worksheet" : "Edit Worksheet Details"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Subject
              </label>
              <select
                {...register("subject_id")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.subject_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.subject_id.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Level
              </label>
              <select
                {...register("level_id")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={!selectedSubjectId}
              >
                <option value="">Select Level</option>
                {filteredLevels.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              {errors.level_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.level_id.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Worksheet Title
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Mathematics - Introduction to Algebra"
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Worksheet No.
              </label>
              <input
                {...register("worksheet_no")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 3A-001"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                {...register("pdf_file")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-[10px] text-gray-500">
                Maximum size: 10MB. PDF only.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                {...register("total_marks")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                {...register("time_limit_minutes")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                placeholder="Briefly describe the contents or purpose of this worksheet..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t font-semibold">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center shadow-lg"
            >
              {submitting && <Spinner size="sm" className="mr-2" />}
              {mode === "add" ? "Upload Worksheet" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Worksheet Preview"
        size="lg"
      >
        {selectedWorksheet && (
          <div className="space-y-6">
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600">
                    <FileText size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
                      {selectedWorksheet.title}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                      <Badge variant="blue">
                        {selectedWorksheet.worksheet_no || "N/A"}
                      </Badge>
                      <span>•</span>
                      <span>{selectedWorksheet.subject?.name}</span>
                      <span>•</span>
                      <span>{selectedWorksheet.level?.name}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(selectedWorksheet)}
                  className="flex items-center px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all font-bold text-sm shadow-sm"
                >
                  <FileDown size={18} className="mr-2" />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Total Marks
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedWorksheet.total_marks} Marks
                </p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Time Limit
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedWorksheet.time_limit_minutes} Minutes
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-900">Description</h4>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border italic leading-relaxed">
                {selectedWorksheet.description ||
                  "No description provided for this worksheet."}
              </p>
            </div>

            {/* Minimalistic PDF Preview if file_url exists */}
            {selectedWorksheet.file_url && (
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">PDF Asset</h4>
                <div className="flex items-center p-3 bg-white border rounded-xl">
                  <FileText className="text-red-500 mr-3" size={24} />
                  <span className="text-sm font-medium text-gray-700 truncate flex-1">
                    {selectedWorksheet.file_path.split("/").pop()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-6 text-center py-4">
          <div className="p-4 bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <Trash2 className="text-red-600" size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Delete Worksheet?
            </h3>
            <p className="text-sm text-gray-500 mt-2 px-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">"{selectedWorksheet?.title}"</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-100 flex items-center justify-center"
            >
              {submitting && <Spinner size="sm" className="mr-2" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorksheetModule;
