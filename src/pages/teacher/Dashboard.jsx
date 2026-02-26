import React, { useState, useEffect } from "react";
import {
  Users,
  User,
  Clock,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Calendar,
  ChevronRight,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import { teacherService } from "../../services/teacherService";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getDashboardStats();
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch teacher dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const { stats, recent_assignments, recent_submissions, teacher } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {teacher?.user?.name}!
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening in your classes today.
          </p>
        </div>
        {teacher?.center && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <Calendar size={16} className="text-indigo-600" />
            <span className="font-medium">{teacher.center.name}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Assignments"
          value={stats?.total_assignments || 0}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Pending Submissions"
          value={stats?.pending_submissions || 0}
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center">
              <ClipboardList className="mr-2 text-indigo-600" size={20} />
              Recent Assignments
            </h3>
            <Link
              to="/teacher/assignments"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recent_assignments?.length > 0 ? (
              recent_assignments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.worksheet?.title}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User size={12} className="mr-1" />{" "}
                          {item.student?.user?.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          Due: {new Date(item.due_date).toLocaleDateString()}
                        </span>
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
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm italic">
                No recent assignments found.
              </div>
            )}
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Clock className="mr-2 text-orange-600" size={20} />
              Pending Grading
            </h3>
            <Link
              to="/teacher/grade"
              className="text-orange-600 hover:text-orange-700 text-sm font-semibold flex items-center"
            >
              Grade Now <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recent_submissions?.length > 0 ? (
              recent_submissions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.assignment?.worksheet?.title}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center text-indigo-600 font-medium">
                          {item.student?.user?.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          Submitted:{" "}
                          {new Date(
                            item.submitted_at || item.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/teacher/grade?student=${item.student_id}&submission=${item.id}`}
                      className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors"
                    >
                      Grade
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm italic">
                All submissions have been graded!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
