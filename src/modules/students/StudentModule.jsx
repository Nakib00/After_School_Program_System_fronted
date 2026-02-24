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
  ClipboardList,
  Clock,
  DollarSign,
  TrendingUp,
  BookOpen,
  BarChart3,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import FileUpload from "../../components/ui/FileUpload";
import { studentService } from "../../services/studentService";
import { centerService } from "../../services/centerService";
import { teacherService } from "../../services/teacherService";
import { adminService } from "../../services/adminService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  center_id: z.coerce.number().min(1, "Center is required"),
  parent_id: z.coerce.number().optional().nullable(),
  teacher_id: z.coerce.number().optional().nullable(),
  enrollment_no: z.string().optional(),
  date_of_birth: z.string().optional(),
  grade: z.string().optional(),
  enrollment_date: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  current_level: z.string().optional(),
});

const StudentModule = ({ role = "super_admin", initialFilters = {} }) => {
  const [students, setStudents] = useState([]);
  const [centers, setCenters] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mode, setMode] = useState("add");
  const [profileImage, setProfileImage] = useState(null);

  // Details tabs state
  const [activeTab, setActiveTab] = useState("profile");
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [progress, setProgress] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      center_id: initialFilters.center_id || "",
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { ...initialFilters };

      const fetchPromises = [
        studentService.getAll(params),
        teacherService.getAll(params),
        adminService.getParents(params),
      ];

      if (role === "super_admin") {
        fetchPromises.push(centerService.getAll());
      }

      const results = await Promise.all(fetchPromises);

      setStudents(results[0].data.data || []);
      setTeachers(results[1].data.data || []);
      setParents(results[2].data.data || []);

      if (role === "super_admin" && results[3]) {
        setCenters(results[3].data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load students and dependencies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(initialFilters)]);

  const handleAdd = () => {
    setMode("add");
    setProfileImage(null);
    reset({
      name: "",
      email: "",
      password: "",
      center_id: initialFilters.center_id || "",
      parent_id: "",
      teacher_id: "",
      enrollment_no: "",
      date_of_birth: "",
      grade: "",
      enrollment_date: "",
      subjects: [],
      current_level: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setMode("edit");
    setSelectedStudent(student);
    setProfileImage(null);
    reset({
      name: student.user?.name || "",
      email: student.user?.email || "",
      password: "",
      center_id: student.center_id,
      parent_id: student.parent_id || "",
      teacher_id: student.teacher_id || "",
      enrollment_no: student.enrollment_no || "",
      date_of_birth: student.date_of_birth
        ? new Date(student.date_of_birth).toISOString().split("T")[0]
        : "",
      grade: student.grade || "",
      enrollment_date: student.enrollment_date
        ? new Date(student.enrollment_date).toISOString().split("T")[0]
        : "",
      subjects: student.subjects || [],
      current_level: student.current_level || "",
    });
    setIsModalOpen(true);
  };

  const handleView = async (student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
    setActiveTab("profile");
    fetchStudentDetails(student.id);
  };

  const fetchStudentDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const [studentRes, assignmentsRes, attendanceRes, feesRes, progressRes] =
        await Promise.all([
          studentService.getById(id),
          studentService.getAssignments(id),
          studentService.getAttendance(id),
          studentService.getFees(id),
          studentService.getProgress(id),
        ]);
      setSelectedStudent(studentRes.data.data);
      setAssignments(assignmentsRes.data.data || []);
      setAttendance(attendanceRes.data.data || []);
      setFees(feesRes.data.data || []);
      setProgress(progressRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch student details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
          if (key === "subjects" && Array.isArray(data[key])) {
            data[key].forEach((sub) => formData.append("subjects[]", sub));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      if (mode === "add") {
        await studentService.create(formData);
        toast.success("Student enrolled successfully");
      } else {
        await studentService.update(selectedStudent.id, formData);
        toast.success("Student updated successfully");
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

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await studentService.delete(selectedStudent.id);
      toast.success("Student deleted successfully");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete student");
    } finally {
      setSubmitting(false);
    }
  };

  const baseColumns = [
    {
      header: "Student",
      accessorKey: "user.name",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 overflow-hidden border border-gray-100">
              {student.user?.profile_photo_path ? (
                <img
                  src={student.user.profile_photo_path}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-indigo-600" />
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {student.user?.name}
              </div>
              <div className="text-xs text-gray-500">
                {student.enrollment_no || "No ID"}
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
    { header: "Grade", accessorKey: "grade" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <Badge
          variant={
            getValue() === "active"
              ? "green"
              : getValue() === "completed"
                ? "blue"
                : "red"
          }
        >
          {getValue()?.toUpperCase()}
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
            Student Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {role === "super_admin"
              ? "Enroll, monitor and manage student records across all centers"
              : "Manage student records for your center"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Enroll New Student
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 animate-pulse font-medium">
              Loading students...
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={students} />
        )}
      </div>

      {/* Add/Edit Sidebar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={mode === "add" ? "Enroll New Student" : "Update Student Record"}
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Student full name"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="student@example.com"
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
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Parent (Optional)
                </label>
                <select
                  {...register("parent_id")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="">Select Parent</option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Enrollment No
                </label>
                <input
                  {...register("enrollment_no")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  placeholder="e.g. S-2024-001"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Teacher
                </label>
                <select
                  {...register("teacher_id")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.user?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Grade / Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    {...register("grade")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    placeholder="Grade"
                  />
                  <input
                    {...register("current_level")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    placeholder="Level"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Dates
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs uppercase font-bold">
                      DOB
                    </span>
                    <input
                      type="date"
                      {...register("date_of_birth")}
                      className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs uppercase font-bold">
                      Join
                    </span>
                    <input
                      type="date"
                      {...register("enrollment_date")}
                      className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Profile Photo
            </label>
            <FileUpload
              onFileSelect={setProfileImage}
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
              className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center disabled:opacity-70"
            >
              {submitting ? (
                <Spinner
                  size="sm"
                  className="mr-2 border-white/30 border-t-white"
                />
              ) : null}
              {mode === "add" ? "Enroll Student" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details sidebar */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Student Information & Progress"
        size="xl"
      >
        {selectedStudent && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden border-2 border-white">
                {selectedStudent.user?.profile_photo_path ? (
                  <img
                    src={selectedStudent.user.profile_photo_path}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-indigo-600" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedStudent.user?.name}
                  </h3>
                  <Badge
                    variant={
                      selectedStudent.status === "active" ? "green" : "red"
                    }
                  >
                    {selectedStudent.status?.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500 font-medium">
                  <span className="flex items-center">
                    <Building2 size={16} className="mr-1.5" />{" "}
                    {selectedStudent.center?.name}
                  </span>
                  <span className="flex items-center">
                    <GraduationCap size={16} className="mr-1.5" /> Grade{" "}
                    {selectedStudent.grade}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1.5" /> Enrolled{" "}
                    {selectedStudent.enrollment_date
                      ? new Date(
                          selectedStudent.enrollment_date,
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-100">
              <div className="flex space-x-8 -mb-px">
                {[
                  "profile",
                  "assignments",
                  "attendance",
                  "fees",
                  "progress",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-semibold transition-all border-b-2 capitalize ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="min-h-[400px]">
              {detailsLoading ? (
                <div className="flex justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : (
                <>
                  {activeTab === "profile" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900">
                          Contact Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail size={16} className="mr-3 text-gray-400" />
                            {selectedStudent.user?.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone size={16} className="mr-3 text-gray-400" />
                            {selectedStudent.user?.phone || "N/A"}
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin
                              size={16}
                              className="mr-3 text-gray-400 mt-0.5"
                            />
                            {selectedStudent.user?.address || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900">
                          Guardian & Teacher
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center">
                            <User size={16} className="mr-3 text-gray-400" />
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">
                                Guardian
                              </p>
                              <p className="text-sm font-semibold">
                                {selectedStudent.parent?.name || "Not assigned"}
                              </p>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center">
                            <GraduationCap
                              size={16}
                              className="mr-3 text-gray-400"
                            />
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">
                                Class Teacher
                              </p>
                              <p className="text-sm font-semibold">
                                {selectedStudent.teacher?.name ||
                                  "Not assigned"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "assignments" && (
                    <div className="space-y-4">
                      {assignments.length > 0 ? (
                        assignments.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:shadow-md transition-all"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <ClipboardList size={20} />
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-900">
                                  {item.worksheet?.title}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  Assigned:{" "}
                                  {new Date(
                                    item.assigned_date,
                                  ).toLocaleDateString()}{" "}
                                  | Due:{" "}
                                  {new Date(item.due_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                item.status === "graded"
                                  ? "green"
                                  : item.status === "submitted"
                                    ? "blue"
                                    : "orange"
                              }
                            >
                              {item.status?.toUpperCase()}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                          <BookOpen
                            className="mx-auto text-gray-300 mb-3"
                            size={40}
                          />
                          <p className="text-gray-500 font-medium">
                            No assignments found
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "attendance" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">
                          Attendance History
                        </span>
                        <span className="text-xs font-bold text-gray-400 uppercase">
                          Total: {attendance.length}
                        </span>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        {attendance.length > 0 ? (
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                              <tr>
                                <th className="px-6 py-3 text-left font-bold">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-left font-bold">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left font-bold">
                                  Notes
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {attendance.map((record) => (
                                <tr key={record.id}>
                                  <td className="px-6 py-4 font-medium">
                                    {new Date(record.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4">
                                    <Badge
                                      variant={
                                        record.status === "present"
                                          ? "green"
                                          : record.status === "absent"
                                            ? "red"
                                            : "orange"
                                      }
                                    >
                                      {record.status?.toUpperCase()}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500">
                                    {record.notes || "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center py-20">
                            <Clock
                              className="mx-auto text-gray-300 mb-3"
                              size={40}
                            />
                            <p className="text-gray-500 font-medium">
                              No attendance records found
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "fees" && (
                    <div className="space-y-4">
                      {fees.length > 0 ? (
                        fees.map((invoice) => (
                          <div
                            key={invoice.id}
                            className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <DollarSign size={20} />
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-900">
                                  {invoice.title || "Monthly Tuition Fee"}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  Invoice: {invoice.invoice_no} | Due:{" "}
                                  {new Date(
                                    invoice.due_date,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                BDT {invoice.amount}
                              </p>
                              <Badge
                                variant={
                                  invoice.status === "paid" ? "green" : "red"
                                }
                              >
                                {invoice.status?.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                          <DollarSign
                            className="mx-auto text-gray-300 mb-3"
                            size={40}
                          />
                          <p className="text-gray-500 font-medium">
                            No fee records found
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "progress" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <p className="text-[10px] font-bold text-blue-400 uppercase">
                            Current Grade
                          </p>
                          <p className="text-xl font-bold text-blue-700">
                            {selectedStudent.grade}
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                          <p className="text-[10px] font-bold text-purple-400 uppercase">
                            Current Level
                          </p>
                          <p className="text-xl font-bold text-purple-700">
                            {selectedStudent.current_level}
                          </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                          <p className="text-[10px] font-bold text-orange-400 uppercase">
                            Performance
                          </p>
                          <p className="text-xl font-bold text-orange-700">
                            Good
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center">
                          <TrendingUp
                            size={18}
                            className="mr-2 text-indigo-600"
                          />
                          Evaluation History
                        </h4>
                        {progress.length > 0 ? (
                          progress.map((p) => (
                            <div
                              key={p.id}
                              className="p-4 bg-white border border-gray-100 rounded-2xl"
                            >
                              <div className="flex justify-between mb-2">
                                <span className="font-bold text-sm">
                                  {p.subject?.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(p.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-full"
                                  style={{ width: `${p.score || 0}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600">
                                {p.comments || "No comments provided"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 bg-gray-50 rounded-2xl">
                            <BarChart3
                              className="mx-auto text-gray-300 mb-2"
                              size={30}
                            />
                            <p className="text-sm text-gray-500">
                              No evaluation records yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
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
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-2xl flex items-center space-x-3 text-red-600">
            <Trash2 size={24} />
            <p className="font-semibold">This action cannot be undone.</p>
          </div>
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete the student record for{" "}
            <span className="font-bold text-gray-900">
              {selectedStudent?.user?.name}
            </span>
            ? This will also remove all associated data.
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="px-8 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 flex items-center disabled:opacity-70"
            >
              {submitting ? (
                <Spinner
                  size="sm"
                  className="mr-2 border-white/30 border-t-white"
                />
              ) : null}
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentModule;
