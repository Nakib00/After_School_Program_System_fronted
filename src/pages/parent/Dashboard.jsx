import React from "react";
import { BookOpen, Clock, Star, Calendar, DollarSign } from "lucide-react";
import StatCard from "../../components/ui/StatCard";

const ParentDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Parent Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Current Level"
          value="Level C"
          icon={BookOpen}
          color="blue"
        />
        <StatCard title="Pending" value="2" icon={Clock} color="orange" />
        <StatCard title="Avg Score" value="88%" icon={Star} color="yellow" />
        <StatCard
          title="Attendance"
          value="95%"
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Fee Status"
          value="Paid"
          icon={DollarSign}
          color="green"
        />
      </div>
    </div>
  );
};

export default ParentDashboard;
