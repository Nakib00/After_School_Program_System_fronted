import {
  BookOpen,
  Clock,
  Star,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import { useAuthStore } from "../../store/authStore";

const ParentDashboard = () => {
  const { user } = useAuthStore();
  const children = user?.children || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parent Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user?.name}. Monitoring progress for{" "}
            {children.length} {children.length === 1 ? "child" : "children"}.
          </p>
        </div>
      </div>

      {children.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            My Children
          </h3>
          <div className="flex flex-wrap gap-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 flex items-center"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {child.user?.name || `Student ID: ${child.enrollment_no}`}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Active Students"
          value={children.length}
          icon={Users}
          color="blue"
        />
        <StatCard title="Pending Tasks" value="—" icon={Clock} color="orange" />
        <StatCard
          title="Avg Attendance"
          value="—"
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Fee Status"
          value="Check Details"
          icon={DollarSign}
          color="blue"
        />
        <StatCard title="Performance" value="Good" icon={Star} color="yellow" />
      </div>
    </div>
  );
};

export default ParentDashboard;
