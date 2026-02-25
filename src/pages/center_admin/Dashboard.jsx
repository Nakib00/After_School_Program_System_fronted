import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import { centerService } from "../../services/centerService";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const CenterAdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.center_id) {
        setLoading(false);
        return;
      }
      try {
        const res = await centerService.getStats(user.center_id);
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch center stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.center_id]);

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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.center?.name || "Center Dashboard"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time performance overview for{" "}
            {user?.center?.name || "your center"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="My Students"
          value={stats?.total_students || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="My Teachers"
          value={stats?.total_teachers || 0}
          icon={GraduationCap}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`BDT ${stats?.monthly_revenue || 0}`}
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Present Today"
          value={stats?.present_today || "0"}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Absent Today"
          value={stats?.absent_today || "0"}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Pending Fees"
          value={stats?.pending_fees_count || "0"}
          icon={AlertCircle}
          color="red"
        />
      </div>
    </div>
  );
};

export default CenterAdminDashboard;
