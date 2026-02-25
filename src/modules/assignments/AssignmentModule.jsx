import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { assignmentService } from "../../services/assignmentService";
import { studentService } from "../../services/studentService";
import { worksheetService } from "../../services/worksheetService";
import { teacherService } from "../../services/teacherService";
import { useAuthStore } from "../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const assignmentSchema = z.object({
  worksheet_id: z.string().min(1, "Worksheet is required"),
  student_ids: z
    .array(z.coerce.number())
    .min(1, "At least one student must be selected"),
  due_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateSchema = z.object({
  due_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(["assigned", "submitted", "graded", "returned"]).optional(),
});

const AssignmentModule = ({ role = "teacher" }) => {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [mode, setMode] = useState("add"); // "add" or "edit"

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      student_ids: [],
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  const selectedStudentIds = watch("student_ids") || [];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, worksheetsRes] = await Promise.all([
        assignmentService.getAll(),
        worksheetService.getAll(),
      ]);

      setAssignments(assignmentsRes.data.data.data || []);
      setWorksheets(worksheetsRes.data.data || []);

      // Fetch students based on role
      let studentsRes;
      if (role === "teacher" && user?.id) {
        studentsRes = await teacherService.getStudents(user.id);
      } else {
        studentsRes = await studentService.getAll();
      }
      setStudents(studentsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, user?.id]);

  const handleAdd = () => {
    setMode("add");
    reset({
      worksheet_id: "",
      student_ids: [],
      due_date: "",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    resetUpdate({
      due_date: assignment.due_date ? assignment.due_date.split("T")[0] : "",
      notes: assignment.notes || "",
      status: assignment.status,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await assignmentService.remove(selectedAssignment.id);
      toast.success("Assignment removed successfully");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await assignmentService.create(data);
      toast.success("Worksheets assigned successfully");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create assignments",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdate = async (data) => {
    try {
      setSubmitting(true);
      await assignmentService.update(selectedAssignment.id, data);
      toast.success("Assignment updated successfully");
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStudent = (id) => {
    const current = [...selectedStudentIds];
    const index = current.indexOf(id);
    if (index === -1) {
      current.push(id);
    } else {
      current.splice(index, 1);
    }
    setValue("student_ids", current);
  };

  const columns = [
    {
      header: "Student",
      accessorKey: "student.user.name",
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center text-indigo-600 border border-indigo-50 shadow-sm">
              {student?.user?.profile_photo_path ? (
                <img
                  src={student.user.profile_photo_path}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {student?.user?.name || "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                ID: {student?.enrollment_no || "N/A"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Worksheet",
      accessorKey: "worksheet.title",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 text-gray-600">
          <FileText size={16} className="text-indigo-400" />
          <span className="text-sm font-medium line-clamp-1">
            {row.original.worksheet?.title || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Due Date",
      accessorKey: "due_date",
      cell: ({ getValue }) => (
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar size={14} className="mr-1.5" />
          {getValue() ? new Date(getValue()).toLocaleDateString() : "No Date"}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const colors = {
          assigned: "blue",
          submitted: "yellow",
          graded: "green",
          returned: "orange",
        };
        return (
          <Badge variant={colors[status] || "gray"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track student worksheet progress
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Assign Worksheet
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500">Loading assignments...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={assignments} />
        )}
      </div>

      {/* Bulk Assign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign New Worksheet"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Select Worksheet
              </label>
              <select
                {...register("worksheet_id")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="">Choose a worksheet</option>
                {worksheets.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.title} ({ws.worksheet_no})
                  </option>
                ))}
              </select>
              {errors.worksheet_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.worksheet_id.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                {...register("due_date")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Select Students
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedStudentIds.includes(student.id)
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white border-gray-100 hover:border-indigo-100 text-gray-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold truncate">
                        {student.user?.name || "N/A"}
                      </p>
                      <p className="text-[10px] opacity-70">
                        Level: {student.current_level || "N/A"}
                      </p>
                    </div>
                    {selectedStudentIds.includes(student.id) && (
                      <CheckCircle2
                        size={16}
                        className="text-indigo-500 ml-2"
                      />
                    )}
                  </label>
                ))}
                {students.length === 0 && (
                  <p className="col-span-full text-center py-4 text-gray-500 italic text-sm">
                    No students available for assignment.
                  </p>
                )}
              </div>
              {errors.student_ids && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_ids.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Teacher Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Instructions for the student..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 font-semibold mr-3 hover:bg-gray-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center min-w-[140px]"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Assigning...
                </>
              ) : (
                "Create Assignments"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Assignment"
        size="md"
      >
        <form onSubmit={handleSubmitUpdate(onUpdate)} className="space-y-6">
          <div className="p-4 bg-indigo-50 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">
                Currently Editing
              </p>
              <h4 className="font-bold text-gray-900 line-clamp-1">
                {selectedAssignment?.worksheet?.title}
              </h4>
              <p className="text-xs text-gray-500">
                For {selectedAssignment?.student?.user?.name}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                {...registerUpdate("status")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <option value="assigned">Assigned</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
                <option value="returned">Returned</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                {...registerUpdate("due_date")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Notes
              </label>
              <textarea
                {...registerUpdate("notes")}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl"
            >
              {submitting ? <Spinner size="sm" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Assignment"
        size="sm"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
            <Trash2 size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Are you sure you want to remove this assignment? This action
              cannot be undone.
            </p>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-100"
            >
              {submitting ? <Spinner size="sm" /> : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentModule;
