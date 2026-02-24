import React from "react";
import {
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  AlertCircle,
  Clock,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Super Admin Dashboard
        </h2>
        <div className="text-sm text-gray-500">Welcome back, Super Admin</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Centers"
          value="12"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value="1,240"
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Teachers"
          value="85"
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value="BDT 850k"
          icon={DollarSign}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 h-80 flex items-center justify-center text-gray-400">
          Revenue Chart Placeholder (Recharts)
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 h-80 flex items-center justify-center text-gray-400">
          Students per Center Placeholder
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
