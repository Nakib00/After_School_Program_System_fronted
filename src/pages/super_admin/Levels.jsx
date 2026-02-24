import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  Search,
  BookOpen,
  ChevronRight,
  AlertCircle,
  Hash,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { levelService } from "../../services/levelService";
import { subjectService } from "../../services/subjectService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const levelSchema = z.object({
  subject_id: z.string().min(1, "Subject is required"),
  name: z.string().min(1, "Name is required").max(50),
  order_index: z.coerce.number().int().min(1, "Order index must be at least 1"),
  description: z.string().optional().nullable(),
});

const Levels = () => {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [mode, setMode] = useState("add"); // add, edit

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(levelSchema),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [levelsRes, subjectsRes] = await Promise.all([
        levelService.getAll(),
        subjectService.getAllActive(),
      ]);
      setLevels(levelsRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch levels data:", error);
      toast.error("Failed to load levels or subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setMode("add");
    reset({ subject_id: "", name: "", order_index: 1, description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (level) => {
    setMode("edit");
    setSelectedLevel(level);
    reset({
      subject_id: level.subject_id.toString(),
      name: level.name,
      order_index: level.order_index,
      description: level.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (level) => {
    setSelectedLevel(level);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await levelService.delete(selectedLevel.id);
      toast.success("Level deleted successfully");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete level");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (mode === "add") {
        await levelService.create(data);
        toast.success("Level created successfully");
      } else {
        await levelService.update(selectedLevel.id, data);
        toast.success("Level updated successfully");
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
      header: "Level Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Layers size={18} />
          </div>
          <span className="font-semibold text-gray-900">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      header: "Subject",
      accessorKey: "subject.name",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <BookOpen size={14} className="mr-2 text-indigo-400" />
          {row.original.subject?.name || "N/A"}
        </div>
      ),
    },
    {
      header: "Order Index",
      accessorKey: "order_index",
      cell: ({ getValue }) => (
        <div className="flex items-center">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
            #{getValue()}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
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
          <h2 className="text-2xl font-bold text-gray-900">Level Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure curriculum levels for each subject
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Create New Level
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-500">
            <Spinner size="lg" />
            <p className="mt-4 font-medium animate-pulse">
              Loading curriculum levels...
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={levels} />
        )}
      </div>

      {/* Add/Edit Sidebar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={mode === "add" ? "Create New Level" : "Edit Level Details"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Subject
            </label>
            <select
              {...register("subject_id")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subject_id && (
              <p className="text-xs text-red-500 mt-1">
                {errors.subject_id.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Level Name
              </label>
              <input
                {...register("name")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Level 3B, Grade 1"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Order Index
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Hash size={18} />
                </span>
                <input
                  type="number"
                  {...register("order_index")}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="1"
                />
              </div>
              {errors.order_index && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.order_index.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]"
              placeholder="Brief description of the level curriculum..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center disabled:opacity-70 transition-all"
            >
              {submitting && (
                <Spinner
                  size="sm"
                  className="mr-2 border-white/30 border-t-white"
                />
              )}
              {mode === "add" ? "Create Level" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="bg-white">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
            Delete Level?
          </h3>
          <p className="text-sm text-center text-gray-500 mb-8">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-700">
              "{selectedLevel?.name}"
            </span>
            ? This action cannot be undone and may affect assigned worksheets.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 flex items-center justify-center disabled:opacity-70"
            >
              {submitting && (
                <Spinner
                  size="sm"
                  className="mr-2 border-white/30 border-t-white"
                />
              )}
              Delete Level
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Levels;
