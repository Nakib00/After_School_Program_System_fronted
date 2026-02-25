import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Eye,
  BookOpen,
  ArrowRight,
  Layers,
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

const SubjectModule = ({ role = "super_admin" }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(role === "super_admin" ? false : true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [mode, setMode] = useState("add");

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
      const res =
        role === "super_admin" && showAll
          ? await subjectService.getAll()
          : await subjectService.getAllActive();
      setSubjects(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load subjects");
      }
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
    if (role !== "super_admin") {
      toast.error("Permission denied");
      return;
    }
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
            {role === "super_admin" && (
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
            )}
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
          >
            <Eye size={18} />
          </button>
          {role === "super_admin" && (
            <button
              onClick={() => handleEdit(row.original)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit size={18} />
            </button>
          )}
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
            {role === "super_admin" ? "Subject Management" : "Active Subjects"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {role === "super_admin"
              ? "Manage academic subjects and curriculum"
              : "View available subjects and curriculum details"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {role === "super_admin" && (
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
          )}
          {role === "super_admin" && (
            <button
              onClick={handleAdd}
              className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-semibold"
            >
              <Plus size={18} className="mr-2" />
              Add Subject
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-500">
            <Spinner size="lg" />
            <p className="mt-4 font-medium animate-pulse">
              Loading subjects...
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={subjects} />
        )}
      </div>

      {/* Add/Edit Modal */}
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Mathematics"
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
              placeholder="Subject curriculum details..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg"
            >
              {submitting && <Spinner size="sm" className="mr-2" />}
              {mode === "add" ? "Create Subject" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
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
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-50 text-indigo-600">
                    <BookOpen size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedSubject.name}
                    </h3>
                  </div>
                </div>
                <Badge variant={selectedSubject.is_active ? "green" : "red"}>
                  {selectedSubject.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <div className="mt-6 text-gray-600 text-sm leading-relaxed p-4 bg-white rounded-xl border">
                {selectedSubject.description || "No description provided."}
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
              </div>

              {selectedSubject.levels && selectedSubject.levels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedSubject.levels.map((level) => (
                    <div
                      key={level.id}
                      className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                    >
                      <h5 className="font-bold text-gray-900 mb-1">
                        {level.name}
                      </h5>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {level.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium italic">
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

export default SubjectModule;
