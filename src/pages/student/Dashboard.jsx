import React from "react";
import { BookOpen, CheckCircle, Star, TrendingUp } from "lucide-react";
import StatCard from "../../components/ui/StatCard";

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending" value="3" icon={BookOpen} color="orange" />
        <StatCard
          title="Completed"
          value="5"
          icon={CheckCircle}
          color="green"
        />
        <StatCard title="Avg Score" value="92%" icon={Star} color="yellow" />
        <StatCard
          title="Current Level"
          value="Level B"
          icon={TrendingUp}
          color="blue"
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
