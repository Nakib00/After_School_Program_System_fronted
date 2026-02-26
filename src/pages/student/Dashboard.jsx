import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  FileText,
  AlertCircle,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { studentService } from "../../services/studentService";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await studentService.getDashboard();
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  const { stats, recent_assignments, progress, student } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-2xl shadow-lg shadow-indigo-100 text-white">
        <div>
          <h2 className="text-3xl font-black">
            Welcome back, {student?.name}! 👋
          </h2>
          <p className="text-indigo-100 mt-2 font-medium">
            You have{" "}
            <span className="text-white font-bold">
              {stats.pending_assignments}
            </span>{" "}
            pending assignments to complete.
          </p>
        </div>
        <Link
          to="/student/assignments"
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all flex items-center group"
        >
          View Assignments
          <ChevronRight
            size={18}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assignments"
          value={stats.total_assignments}
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Pending"
          value={stats.pending_assignments}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Submitted"
          value={stats.submitted_assignments}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Graded"
          value={stats.graded_assignments}
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Assignments section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar size={20} className="mr-2 text-indigo-600" />
              Recent Assignments
            </h3>
            <Link
              to="/student/assignments"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {recent_assignments.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recent_assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight">
                          {assignment.worksheet?.title || "Untitled Worksheet"}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {assignment.due_date} •{" "}
                          {assignment.teacher?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={
                          assignment.status === "graded"
                            ? "green"
                            : assignment.status === "submitted"
                              ? "blue"
                              : "yellow"
                        }
                      >
                        {assignment.status}
                      </Badge>
                      <Link
                        to="/student/assignments"
                        state={{ openAssignmentId: assignment.id }}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500">No recent assignments found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Overview section */}
        <div className="space-y-4">
          <div className="px-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-600" />
              Progress Overview
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            {progress.length > 0 ? (
              progress.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700">
                      {item.subject?.name}
                    </span>
                    <span className="text-indigo-600 font-black">
                      {item.level?.name}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(item.score || 0, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Performance</span>
                    <span>{item.score || 0}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No progress data available yet.
              </div>
            )}

            <Link
              to="/student/progress"
              className="block w-full text-center py-3 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors mt-4"
            >
              Detailed Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
