import React from "react";
import {
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";

const CenterAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Center Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="My Students" value="120" icon={Users} color="blue" />
        <StatCard
          title="My Teachers"
          value="8"
          icon={GraduationCap}
          color="green"
        />
        <StatCard
          title="Present Today"
          value="112"
          icon={CheckCircle}
          color="green"
        />
        <StatCard title="Absent Today" value="5" icon={XCircle} color="red" />
        <StatCard
          title="Monthly Revenue"
          value="BDT 120k"
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Pending Fees"
          value="12"
          icon={AlertCircle}
          color="red"
        />
      </div>
    </div>
  );
};

export default CenterAdminDashboard;
