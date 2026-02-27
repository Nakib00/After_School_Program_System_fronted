import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  UserCheck,
  UserX,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import { dashboardService } from "../../services/dashboardService";
import { toast } from "react-hot-toast";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await dashboardService.getSuperAdminStats();
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch global stats:", error);
        toast.error("Failed to load global statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Format revenue data for the chart
  const revenueData = stats?.revenue_chart || [];
  const studentDistributionData = stats?.students_per_center || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Super Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1 italic">
            Overall system overview and performance metrics
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm font-semibold text-gray-900">Super Admin</div>
          <div className="text-xs text-gray-500">Global Overview</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Centers"
          value={stats?.total_centers || 0}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Teachers"
          value={stats?.total_teachers || 0}
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Total Parents"
          value={stats?.total_parents || 0}
          icon={Users}
          color="orange"
        />
        <StatCard
          title="Total Subjects"
          value={stats?.total_subjects || 0}
          icon={BookOpen}
          color="green"
        />
        <StatCard
          title="Total Levels"
          value={stats?.total_levels || 0}
          icon={Layers}
          color="teal"
        />
        <StatCard
          title="Center Admins"
          value={stats?.total_center_admins || 0}
          icon={ShieldCheck}
          color="pink"
        />
        <StatCard
          title="Active Users"
          value={stats?.is_active_users || 0}
          icon={UserCheck}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center">
              <CreditCard className="mr-2 text-blue-600" size={18} />
              Revenue Trends
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-wider">
              Last 6 Months
            </span>
          </div>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(value) => `৳${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  formatter={(value) => [`৳${value}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#2563eb",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Students per Center Chart */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Building2 className="mr-2 text-indigo-600" size={18} />
              Student Distribution
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-wider">
              By Center
            </span>
          </div>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentDistributionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="student_count"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  {studentDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#4f46e5" : "#818cf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
