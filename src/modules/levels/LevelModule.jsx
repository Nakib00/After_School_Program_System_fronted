import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  Search,
  BookOpen,
  Hash,
  AlertCircle,
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

const LevelModule = ({ role = "super_admin" }) => {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [mode, setMode] = useState("add");

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
          {role === "super_admin" && (
            <button
              onClick={() => handleEdit(row.original)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit size={18} />
            </button>
          )}
          {role === "super_admin" && (
            <button
              onClick={() => handleDeleteClick(row.original)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Level Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure curriculum levels for each subject
          </p>
        </div>
        {role === "super_admin" && (
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg font-semibold"
          >
            <Plus size={18} className="mr-2" />
            Create New Level
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable columns={columns} data={levels} />
        )}
      </div>

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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Level Name
              </label>
              <input
                {...register("name")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                placeholder="e.g. Level 3B"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Order Index
              </label>
              <input
                type="number"
                {...register("order_index")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl min-h-[100px]"
            />
          </div>

          <div className="flex justify-end pt-6 border-t font-semibold">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl"
            >
              {mode === "add" ? "Create Level" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4 text-center">
          <AlertCircle className="mx-auto text-red-600" size={40} />
          <h3 className="font-bold text-gray-900">Delete Level?</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-bold">"{selectedLevel?.name}"</span>?
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-2.5 bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LevelModule;
