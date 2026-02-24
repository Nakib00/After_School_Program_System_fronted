import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Eye,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  ClipboardList,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { subjectService } from "../../services/subjectService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const subjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional().nullable(),
});

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [mode, setMode] = useState("add"); // add, edit

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = showAll
        ? await subjectService.getAll()
        : await subjectService.getAllActive();
      setSubjects(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showAll]);

  const handleAdd = () => {
    setMode("add");
    reset({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (subject) => {
    setMode("edit");
    setSelectedSubject(subject);
    reset({
      name: subject.name,
      description: subject.description || "",
    });
    setIsModalOpen(true);
  };

  const handleView = async (subject) => {
    try {
      setSelectedSubject(subject);
      setIsDetailsModalOpen(true);
      const res = await subjectService.getById(subject.id);
      setSelectedSubject(res.data.data);
    } catch (error) {
      toast.error("Failed to load subject details");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await subjectService.toggleStatus(id);
      toast.success("Status updated successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (mode === "add") {
        await subjectService.create(data);
        toast.success("Subject created successfully");
      } else {
        await subjectService.update(selectedSubject.id, data);
        toast.success("Subject updated successfully");
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
      header: "Subject Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <BookOpen size={18} />
          </div>
          <span className="font-semibold text-gray-900">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ getValue }) => (
        <div className="max-w-xs truncate text-gray-500">
          {getValue() || "N/A"}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row, getValue }) => {
        const isActive = getValue();
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleToggleStatus(row.original.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isActive ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <Badge variant={isActive ? "green" : "red"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
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
            onClick={() => handleEdit(row.original)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={18} />
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
            Subject Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage academic subjects and curriculum
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`flex items-center px-4 py-2.5 rounded-xl font-semibold transition-all border ${
              showAll
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {showAll ? "Viewing All Subjects" : "Viewing Active Only"}
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-semibold"
          >
            <Plus size={18} className="mr-2" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-500">
            <Spinner size="lg" />
            <p className="mt-4 font-medium animate-pulse">
              Fetching subjects from the matrix...
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={subjects} />
        )}
      </div>

      {/* Add/Edit Sidebar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={mode === "add" ? "Create New Subject" : "Edit Subject Details"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Subject Name
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g. Mathematics, English Language"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]"
              placeholder="Brief description of the subject curriculum..."
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
              {mode === "add" ? "Create Subject" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Sidebar */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Subject Details & Levels"
        size="lg"
      >
        {selectedSubject && (
          <div className="space-y-8">
            <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600 border border-indigo-50">
                    <BookOpen size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedSubject.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Subject Code: SUB-{selectedSubject.id}
                    </p>
                  </div>
                </div>
                <Badge variant={selectedSubject.is_active ? "green" : "red"}>
                  {selectedSubject.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <div className="mt-6 text-gray-600 text-sm leading-relaxed bg-white/50 p-4 rounded-xl border border-white">
                {selectedSubject.description ||
                  "No description provided for this subject."}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers size={18} className="text-indigo-600" />
                  <h4 className="text-lg font-bold text-gray-900">
                    Academic Levels
                  </h4>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {selectedSubject.levels?.length || 0} Total
                </span>
              </div>

              {selectedSubject.levels && selectedSubject.levels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedSubject.levels.map((level) => (
                    <div
                      key={level.id}
                      className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-all group shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {level.name}
                        </h5>
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                          <ArrowRight
                            size={14}
                            className="text-gray-400 group-hover:text-indigo-600"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {level.description || "No description available."}
                      </p>
                      <div className="mt-4 flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <ClipboardList size={12} className="mr-1.5" />
                        Order Index: {level.order_index}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                  <XCircle size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-semibold italic">
                    No levels assigned to this subject yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Subjects;
