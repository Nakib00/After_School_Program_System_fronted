import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  AlertCircle,
  Clock,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import { dashboardService } from "../../services/dashboardService";
import { toast } from "react-hot-toast";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await dashboardService.getStats();
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
          value={stats?.total_centers || 0}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Teachers"
          value={stats?.total_teachers || 0}
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`BDT ${stats?.total_revenue || 0}`}
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
