import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Star,
  Calendar,
  DollarSign,
  Users,
  User,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Info,
  X,
  Briefcase,
  History,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import { useAuthStore } from "../../store/authStore";
import { dashboardService } from "../../services/dashboardService";
import { teacherService } from "../../services/teacherService";
import { studentService } from "../../services/studentService";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { toast } from "react-hot-toast";

const ParentDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherLoading, setTeacherLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getParentDashboard();
        setDashboardData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch parent dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewStudent = async (studentId) => {
    try {
      setStudentLoading(true);
      setIsStudentModalOpen(true);
      const res = await studentService.getById(studentId);
      setSelectedStudent(res.data.data);
    } catch (error) {
      console.error("Failed to fetch student details:", error);
      toast.error("Failed to load student details");
    } finally {
      setStudentLoading(false);
    }
  };

  const handleViewTeacher = async (teacherUserId) => {
    if (!teacherUserId) return;
    try {
      setTeacherLoading(true);
      setIsTeacherModalOpen(true);
      const res = await teacherService.getById(teacherUserId);
      setSelectedTeacher(res.data.data);
    } catch (error) {
      console.error("Failed to fetch teacher details:", error);
      toast.error("Failed to load teacher details");
    } finally {
      setTeacherLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "graded":
        return <Badge variant="green">Graded</Badge>;
      case "submitted":
        return <Badge variant="blue">Submitted</Badge>;
      case "pending":
        return <Badge variant="yellow">Pending</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const { parent_info, children_count, children_summary } = dashboardData || {};

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Parent Dashboard
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Welcome back, {parent_info?.name}. Monitoring progress for{" "}
            {children_count} {children_count === 1 ? "child" : "children"}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Children"
          value={children_count}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Centers"
          value={children_summary?.length > 0 ? 1 : 0}
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Tasks Completed"
          value={children_summary?.reduce(
            (acc, child) => acc + child.stats.graded_assignments,
            0,
          )}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Pending Tasks"
          value={children_summary?.reduce(
            (acc, child) => acc + child.stats.pending_assignments,
            0,
          )}
          icon={AlertCircle}
          color="yellow"
        />
      </div>

      <div className="space-y-10">
        <h3 className="text-2xl font-black text-gray-900 flex items-center tracking-tight">
          <Users className="w-8 h-8 mr-3 text-indigo-600" />
          Children Overview
        </h3>

        {children_summary?.length > 0 ? (
          <div className="grid grid-cols-1 gap-10">
            {children_summary.map((child) => (
              <div
                key={child.student_info.id}
                className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-50/40 transition-all group"
              >
                <div className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Child Profile Section */}
                    <div className="lg:w-1/3 xl:w-1/4 space-y-8">
                      <div className="flex flex-col items-center text-center space-y-5">
                        <div className="relative">
                          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-50 shadow-inner bg-gray-100 flex items-center justify-center">
                            {child.student_info.profile_image ? (
                              <img
                                src={child.student_info.profile_image}
                                alt={child.student_info.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={56} className="text-gray-300" />
                            )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {child.student_info.name}
                          </h4>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center">
                            <Badge variant="indigo" className="mr-2">
                              {child.student_info.enrollment_no}
                            </Badge>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                              Grade
                            </p>
                            <p className="text-lg font-black text-gray-900">
                              {child.student_info.grade}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                              Center
                            </p>
                            <p className="text-[11px] font-black text-gray-900 line-clamp-1">
                              {child.student_info.center}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleViewStudent(child.student_info.id)
                          }
                          className="w-full py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <span>View Academic Profile</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Stats and Recent Assignments */}
                    <div className="flex-1 space-y-10">
                      {/* Mini Stats Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 text-center">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                            Total
                          </p>
                          <p className="text-xl font-black text-indigo-700">
                            {child.stats.total_assignments}
                          </p>
                        </div>
                        <div className="p-5 bg-green-50/50 rounded-3xl border border-green-100/50 text-center">
                          <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">
                            Graded
                          </p>
                          <p className="text-xl font-black text-green-700">
                            {child.stats.graded_assignments}
                          </p>
                        </div>
                        <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50 text-center">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                            Submitted
                          </p>
                          <p className="text-xl font-black text-blue-700">
                            {child.stats.submitted_assignments}
                          </p>
                        </div>
                        <div className="p-5 bg-yellow-50/50 rounded-3xl border border-yellow-100/50 text-center">
                          <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-1">
                            Pending
                          </p>
                          <p className="text-xl font-black text-yellow-700">
                            {child.stats.pending_assignments}
                          </p>
                        </div>
                      </div>

                      {/* Recent Assignments List */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-black text-gray-900 tracking-tight flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                            Recent Assignments
                          </h5>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Latest Actions
                          </span>
                        </div>

                        <div className="space-y-4">
                          {child.recent_assignments?.length > 0 ? (
                            child.recent_assignments
                              .slice(0, 3)
                              .map((assignment) => (
                                <div
                                  key={assignment.id}
                                  className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 group/item hover:bg-white hover:shadow-lg hover:shadow-indigo-50/40 transition-all"
                                >
                                  <div className="flex items-center space-x-5">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                      <BookOpen size={20} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-gray-900">
                                        {assignment.worksheet?.title}
                                      </p>
                                      <p className="text-[10px] font-bold text-gray-400 mt-1 flex items-center tracking-wider uppercase">
                                        <Calendar
                                          size={12}
                                          className="mr-1 text-indigo-500"
                                        />
                                        Due{" "}
                                        {new Date(
                                          assignment.due_date,
                                        ).toLocaleDateString()}
                                        <span className="mx-2 opacity-30">
                                          •
                                        </span>
                                        By {assignment.teacher?.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-6">
                                    {getStatusBadge(assignment.status)}
                                    <button
                                      onClick={() =>
                                        handleViewTeacher(
                                          assignment.teacher?.teacherid ||
                                            assignment.teacher?.id,
                                        )
                                      }
                                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                                      title="View Teacher"
                                    >
                                      <User size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="p-8 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                              <p className="text-sm font-bold text-gray-400 italic">
                                No recent assignments found
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-24 rounded-[4rem] border border-dashed border-gray-200 text-center shadow-inner">
            <Users size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              No children profiles linked
            </h3>
            <p className="text-gray-500 mt-4 max-w-md mx-auto font-medium">
              Your account doesn't seem to be connected to any active students.
              Please contact the center admin for assistance.
            </p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Student Information"
        size="lg"
      >
        {studentLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium">
              Fetching academic record...
            </p>
          </div>
        ) : (
          selectedStudent && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-indigo-50 bg-gray-50 shrink-0">
                  {selectedStudent.user?.profile_photo_path ? (
                    <img
                      src={selectedStudent.user.profile_photo_path}
                      alt={selectedStudent.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <User size={64} />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">
                      {selectedStudent.user?.name}
                    </h3>
                    <p className="text-indigo-600 font-bold tracking-widest uppercase text-xs mt-1">
                      Enrollment ID: {selectedStudent.enrollment_no}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="blue">Grade {selectedStudent.grade}</Badge>
                    <Badge variant="indigo">
                      Level {selectedStudent.current_level}
                    </Badge>
                    <Badge
                      variant={
                        selectedStudent.status === "active" ? "green" : "red"
                      }
                    >
                      {selectedStudent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                    <Info size={14} className="mr-2" />
                    Academic Details
                  </h4>
                  <div className="space-y-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold">
                        Enrolled Subjects
                      </span>
                      <span className="font-black text-gray-900">
                        {selectedStudent.subjects?.join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold">
                        Enrollment Date
                      </span>
                      <span className="font-black text-gray-900">
                        {new Date(
                          selectedStudent.enrollment_date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400 italic font-medium">
                      <span className="text-gray-500 font-bold not-italic">
                        Date of Birth
                      </span>
                      <span className="font-black text-gray-900 not-italic">
                        {new Date(
                          selectedStudent.date_of_birth,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-200">
                      <span className="text-gray-500 font-bold">
                        Monthly Fees
                      </span>
                      <span className="font-black text-indigo-700 text-lg">
                        ${selectedStudent.monthly_fee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                    <Building2 size={14} className="mr-2" />
                    Center Context
                  </h4>
                  <div className="space-y-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                        Registered Center
                      </span>
                      <span className="text-sm font-black text-gray-900 leading-tight">
                        {selectedStudent.center?.name}
                      </span>
                      <div className="flex items-center text-[10px] text-gray-500 mt-1 font-bold">
                        <MapPin size={10} className="mr-1 text-red-500" />
                        {selectedStudent.center?.address},{" "}
                        {selectedStudent.center?.city}
                      </div>
                      {selectedStudent.center?.phone && (
                        <div className="flex items-center text-[10px] text-indigo-600 font-bold mt-2 bg-white px-3 py-1.5 rounded-xl border border-indigo-100 w-fit">
                          <Phone size={10} className="mr-1.5" />
                          {selectedStudent.center.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 border-t border-gray-200 pt-4">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                        Registered Email
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        {selectedStudent.user?.email}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-gray-200 pt-4">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                        Home Address
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed font-bold">
                        {selectedStudent.user?.address || "No address provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </Modal>

      {/* Teacher Detail Modal */}
      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        title="Teacher Information"
        size="md"
      >
        {teacherLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium">
              Fetching teacher details...
            </p>
          </div>
        ) : selectedTeacher ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-indigo-50 mx-auto bg-gray-50 shadow-sm relative group">
                {selectedTeacher.user?.profile_photo_path ? (
                  <img
                    src={selectedTeacher.user.profile_photo_path}
                    alt={selectedTeacher.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <User size={40} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  {selectedTeacher.user?.name}
                </h3>
                <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-1">
                  {selectedTeacher.qualification}
                </p>
                <div className="mt-3 flex justify-center">
                  <Badge variant="blue" className="font-bold">
                    EID: {selectedTeacher.employee_id || selectedTeacher.id}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mr-4 group-hover:text-indigo-500 transition-colors">
                  <Mail size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="text-sm font-black text-gray-700">
                    {selectedTeacher.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mr-4 group-hover:text-indigo-500 transition-colors">
                  <Phone size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    Phone Number
                  </p>
                  <p className="text-sm font-black text-gray-700">
                    {selectedTeacher.user?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mr-4 group-hover:text-indigo-500 transition-colors">
                  <History size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    Joined Center
                  </p>
                  <p className="text-sm font-black text-gray-700">
                    {selectedTeacher.join_date
                      ? new Date(selectedTeacher.join_date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mr-4 group-hover:text-indigo-500 transition-colors">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    Personal Address
                  </p>
                  <p className="text-sm font-bold text-gray-700 line-clamp-1">
                    {selectedTeacher.user?.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center shadow-inner">
              <Building2 size={24} className="text-indigo-500 mr-4 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  Operational Center
                </p>
                <p className="text-sm font-black text-indigo-700 leading-tight">
                  {selectedTeacher.center?.name}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            Failed to load teacher details.
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParentDashboard;
