import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  Building2,
  GraduationCap,
  Calendar,
  Phone,
  MapPin,
  Users,
  FileCheck,
  Search,
  UserMinus,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import FileUpload from "../../components/ui/FileUpload";
import { teacherService } from "../../services/teacherService";
import { centerService } from "../../services/centerService";
import { adminService } from "../../services/adminService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const teacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  center_id: z.coerce.number().min(1, "Center is required"),
  employee_id: z.string().optional(),
  qualification: z.string().optional(),
  join_date: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const TeacherModule = ({ role = "super_admin", initialFilters = {} }) => {
  const [teachers, setTeachers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [mode, setMode] = useState("add");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      center_id: initialFilters.center_id || "",
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { ...initialFilters };

      const fetchPromises = [teacherService.getAll(params)];

      if (role === "super_admin") {
        fetchPromises.push(centerService.getAll());
      }

      const results = await Promise.all(fetchPromises);
      setTeachers(results[0].data.data || []);

      if (role === "super_admin" && results[1]) {
        setCenters(results[1].data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(initialFilters)]);

  const handleAdd = () => {
    setMode("add");
    setProfilePhoto(null);
    reset({
      name: "",
      email: "",
      password: "",
      center_id: initialFilters.center_id || "",
      employee_id: "",
      qualification: "",
      join_date: "",
      phone: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setMode("edit");
    setSelectedTeacher(teacher);
    setProfilePhoto(null);
    reset({
      name: teacher.user?.name || "",
      email: teacher.user?.email || "",
      password: "",
      center_id: teacher.center_id,
      employee_id: teacher.employee_id || "",
      qualification: teacher.qualification || "",
      join_date: teacher.join_date
        ? new Date(teacher.join_date).toISOString().split("T")[0]
        : "",
      phone: teacher.user?.phone || "",
      address: teacher.user?.address || "",
    });
    setIsModalOpen(true);
  };

  const handleView = async (teacher) => {
    try {
      setSelectedTeacher(teacher);
      setIsDetailsModalOpen(true);
      const teacherUserId = teacher.user_id || teacher.user?.id || teacher.id;
      const { data } = await teacherService.getStudents(teacherUserId);
      setAssignedStudents(data.data || []);
    } catch (error) {
      console.error("Failed to fetch teacher details:", error);
      toast.error("Failed to load teacher students");
    }
  };

  const handleUnassign = async (studentId) => {
    try {
      if (!window.confirm("Are you sure you want to unassign this student?"))
        return;
      setSubmitting(true);
      await teacherService.unassignStudents({ student_ids: [studentId] });
      toast.success("Student unassigned successfully");

      // Refresh student list for this teacher
      const teacherUserId =
        selectedTeacher.user_id ||
        selectedTeacher.user?.id ||
        selectedTeacher.id;
      const { data } = await teacherService.getStudents(teacherUserId);
      setAssignedStudents(data.data || []);
    } catch (error) {
      console.error("Unassign failed:", error);
      toast.error("Failed to unassign student");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      if (mode === "add") {
        await teacherService.create(formData);
        toast.success("Teacher registered successfully");
      } else {
        await teacherService.update(selectedTeacher.id, formData);
        toast.success("Teacher updated successfully");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      // Ensure we use teacher.id (teacher table PK)
      await teacherService.delete(selectedTeacher.id);
      toast.success("Teacher record removed");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete teacher");
    } finally {
      setSubmitting(false);
    }
  };

  const baseColumns = [
    {
      header: "Teacher",
      accessorKey: "user.name",
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 overflow-hidden border border-gray-100">
              {teacher.user?.profile_photo_path ? (
                <img
                  src={teacher.user.profile_photo_path}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <GraduationCap size={20} className="text-blue-600" />
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {teacher.user?.name}
              </div>
              <div className="text-xs text-gray-500">
                {teacher.employee_id || "No ID"}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const centerColumn = {
    header: "Center",
    accessorKey: "center.name",
  };

  const endColumns = [
    { header: "Qualification", accessorKey: "qualification" },
    {
      header: "Status",
      accessorKey: "user.is_active",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "green" : "red"}>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
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

  const columns =
    role === "super_admin"
      ? [...baseColumns, centerColumn, ...endColumns]
      : [...baseColumns, ...endColumns];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Teachers Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {role === "super_admin"
              ? "Manage teaching staff across all centers"
              : "Manage teachers for your center"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Add New Teacher
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 animate-pulse font-medium">
              Loading teachers...
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={teachers} />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={mode === "add" ? "Register New Teacher" : "Update Teacher Info"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <User size={18} />
                  </span>
                  <input
                    {...register("name")}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Teacher full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="teacher@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={
                    mode === "edit"
                      ? "Leave blank to keep current"
                      : "Min 6 characters"
                  }
                />
              </div>

              {role === "super_admin" ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Center
                  </label>
                  <select
                    {...register("center_id")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="">Select Center</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input type="hidden" {...register("center_id")} />
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Employee ID
                </label>
                <input
                  {...register("employee_id")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  placeholder="e.g. T-101"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Qualification
                </label>
                <input
                  {...register("qualification")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  placeholder="e.g. B.A in English"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Join Date
                </label>
                <input
                  type="date"
                  {...register("join_date")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Address
            </label>
            <textarea
              {...register("address")}
              rows="2"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Residential address"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Profile Photo
            </label>
            <FileUpload
              onFileSelect={setProfilePhoto}
              accept=".jpg,.jpeg,.png"
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
              className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center disabled:opacity-70"
            >
              {submitting ? <Spinner size="sm" className="mr-2" /> : null}
              {mode === "add" ? "Register Teacher" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Teacher Professional Profile"
        size="2xl"
      >
        {selectedTeacher && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden border-2 border-white">
                {selectedTeacher.user?.profile_photo_path ? (
                  <img
                    src={selectedTeacher.user.profile_photo_path}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap size={40} className="text-blue-600" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedTeacher.user?.name}
                  </h3>
                  <Badge
                    variant={selectedTeacher.user?.is_active ? "green" : "red"}
                  >
                    {selectedTeacher.user?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500 font-medium">
                  <span className="flex items-center">
                    <Building2 size={16} className="mr-1.5" />{" "}
                    {selectedTeacher.center?.name || "N/A"}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1.5" /> Joined{" "}
                    {selectedTeacher.join_date
                      ? new Date(selectedTeacher.join_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
                    <Users size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    Assigned Students ({assignedStudents.length})
                  </h4>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                >
                  Manage Assignments
                </button>
              </div>

              {assignedStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {assignedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3 border border-gray-200">
                        {student.user?.profile_photo_path ? (
                          <img
                            src={student.user.profile_photo_path}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <User size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {student.user?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Grade {student.grade} | Level {student.current_level}
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnassign(student.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Unassign student"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">
                    No students assigned yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Teacher assignment modal wrapper */}
      {selectedTeacher && (
        <TeacherAssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          teacher={selectedTeacher}
          onSuccess={() => handleView(selectedTeacher)}
        />
      )}

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-2xl flex items-center space-x-3 text-red-600">
            <Trash2 size={24} />
            <p className="font-semibold">This action cannot be undone.</p>
          </div>
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-900">
              {selectedTeacher?.user?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="px-8 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100"
            >
              {submitting ? <Spinner size="sm" /> : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TeacherAssignmentModal = ({ isOpen, onClose, teacher, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    if (!teacher) return;
    try {
      setLoading(true);
      // Filter by center to make the list relevant
      const params = { center_id: teacher.center_id };
      const { data } = await adminService.getStudents(params);
      setStudents(data.data || []);

      const teacherUserId = teacher.user_id || teacher.user?.id || teacher.id;
      const assignedRes = await teacherService.getStudents(teacherUserId);
      setSelectedIds(assignedRes.data.data.map((s) => s.id));
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load student list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchStudents();
  }, [isOpen, teacher]);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const teacherUserId = teacher.user_id || teacher.user?.id || teacher.id;
      await teacherService.assignStudents({
        teacher_id: teacherUserId,
        student_ids: selectedIds,
      });
      toast.success("Assignment updated");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to assign students");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollment_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.center?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Students to ${teacher?.user?.name}`}
      size="lg"
    >
      <div className="space-y-4 pt-2">
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
          {loading ? (
            <div className="p-8 text-center">
              <Spinner size="md" />
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => handleToggle(student.id)}
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedIds.includes(student.id)
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-transparent hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 ${selectedIds.includes(student.id) ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}
                >
                  {selectedIds.includes(student.id) && (
                    <FileCheck size={14} className="text-white" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {student.user?.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {student.enrollment_no}
                    </div>
                  </div>
                  {student.center && (
                    <div className="text-right">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500 uppercase border border-gray-200">
                        <Building2 size={10} className="mr-1" />
                        {student.center.name}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 mr-3"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold"
          >
            {submitting ? <Spinner size="sm" /> : "Save Assignments"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TeacherModule;
