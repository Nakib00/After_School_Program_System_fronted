import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  User,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  Mail,
  FileCheck,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import StatCard from "../../components/ui/StatCard";
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

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [students, setStudents] = useState([]); // For assigned students view
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
  const [profilePhoto, setProfilePhoto] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherSchema),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersRes, centersRes] = await Promise.all([
        teacherService.getAll(),
        centerService.getAll(),
      ]);
      setTeachers(teachersRes.data.data || []);
      setCenters(centersRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load teachers or centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setMode("add");
    setProfilePhoto(null);
    reset({
      name: "",
      email: "",
      password: "",
      center_id: "",
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
      password: "", // Leave blank for edit
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
      const { data } = await teacherService.getStudents(teacher.id);
      setStudents(data.data || []);
    } catch (error) {
      console.error("Failed to fetch teacher details:", error);
      toast.error("Failed to load teacher students");
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
        toast.success("Teacher created successfully");
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

  const columns = [
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
                  alt={teacher.user.name}
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
    {
      header: "Center",
      accessorKey: "center_id",
      cell: ({ getValue }) => {
        const center = centers.find((c) => c.id === getValue());
        return center?.name || "N/A";
      },
    },
    { header: "Qualification", accessorKey: "qualification" },
    { header: "Phone", accessorKey: "user.phone" },
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
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(teacher)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(teacher)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit size={18} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Teachers Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your teaching staff, assignments and details
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

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 animate-pulse font-medium">
              Loading teachers list...
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={teachers} />
        )}
      </div>

      {/* Add/Edit Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={mode === "add" ? "Add New Teacher" : "Edit Teacher Info"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column */}
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.name.message}
                  </p>
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
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="teacher@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Password{" "}
                  {mode === "edit" ? "(Leave blank to keep current)" : ""}
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="At least 6 characters"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Center
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Building2 size={18} />
                  </span>
                  <select
                    {...register("center_id")}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Select a center</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.center_id && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.center_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Employee ID
                </label>
                <input
                  {...register("employee_id")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. T-101"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Qualification
                </label>
                <input
                  {...register("qualification")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. B.Sc in Education"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Join Date
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Calendar size={18} />
                  </span>
                  <input
                    {...register("join_date")}
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Phone size={18} />
                  </span>
                  <input
                    {...register("phone")}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <MapPin size={18} />
              </span>
              <textarea
                {...register("address")}
                rows="2"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Full residential address"
              ></textarea>
            </div>
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

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
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
              className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2 text-white" />
                  Processing...
                </>
              ) : mode === "add" ? (
                "Register Teacher"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Teacher Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Teacher Professional Profile"
        size="2xl"
      >
        {selectedTeacher && (
          <div className="space-y-8 pt-2 pb-4">
            {/* Top Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden border-2 border-white">
                {selectedTeacher.user?.profile_photo_path ? (
                  <img
                    src={selectedTeacher.user.profile_photo_path}
                    alt={selectedTeacher.user.name}
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
                <div className="text-blue-600 font-semibold">
                  {selectedTeacher.qualification || "Qualification Not Set"}
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Building2 size={16} className="mr-1.5" />{" "}
                    {
                      centers.find((c) => c.id === selectedTeacher.center_id)
                        ?.name
                    }
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

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Employee ID
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {selectedTeacher.employee_id || "---"}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Total Students
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {students.length}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100 overflow-hidden">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Email
                </div>
                <div
                  className="text-sm font-bold text-gray-900 truncate"
                  title={selectedTeacher.user?.email}
                >
                  {selectedTeacher.user?.email}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Phone
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {selectedTeacher.user?.phone || "---"}
                </div>
              </div>
            </div>

            {/* Detailed Info Tabs/Sections */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
                      <Users size={18} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      Assigned Students
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setIsAssignModalOpen(true);
                    }}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                  >
                    Manage Assignments
                  </button>
                </div>

                {students.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3 border border-gray-200 group-hover:bg-blue-50">
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
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>Level {student.current_level}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{student.grade} Grade</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Users size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No students assigned yet
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mr-3 text-orange-600">
                    <MapPin size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    Contact & Address
                  </h4>
                </div>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                  {selectedTeacher.user?.address ||
                    "No address information provided."}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Students Modal */}
      <TeacherAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        teacher={selectedTeacher}
        onSuccess={() => {
          if (selectedTeacher) handleView(selectedTeacher);
        }}
      />
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
      const { data } = await adminService.getStudents();
      setStudents(data.data || []);

      const assignedRes = await teacherService.getStudents(teacher.id);
      setSelectedIds(assignedRes.data.data.map((s) => s.id));
    } catch (error) {
      console.error("Failed to fetch students:", error);
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
      await teacherService.assignStudents({
        teacher_id: teacher.id,
        student_ids: selectedIds,
      });
      toast.success("Students assigned successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error("Failed to assign students");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollment_no?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Students to ${teacher?.user?.name}`}
      size="lg"
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <FileCheck size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {selectedIds.length} Students Selected
            </p>
            <p className="text-xs text-gray-500">
              Pick students from the list below to assign them
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search students by name or enrollment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Spinner size="md" />
              <p className="mt-2 text-sm text-gray-500">Loading students...</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar space-y-2">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleToggle(student.id)}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedIds.includes(student.id)
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mr-3 transition-colors ${
                      selectedIds.includes(student.id)
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedIds.includes(student.id) && (
                      <Plus
                        size={14}
                        className="text-white transform rotate-45"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {student.user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.enrollment_no || "No Enrollment #"} • Grade{" "}
                      {student.grade}
                    </div>
                  </div>
                  {selectedIds.includes(student.id) && (
                    <Badge variant="blue">Selected</Badge>
                  )}
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="py-20 text-center text-gray-500">
                  <Users size={32} className="mx-auto mb-2 opacity-20" />
                  No students found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="mr-2 text-white" />
                Saving...
              </>
            ) : (
              "Update Assignments"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Teachers;
