import React from "react";
import { Users, Clock, BookOpen, CheckCircle } from "lucide-react";
import StatCard from "../../components/ui/StatCard";

const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Students" value="15" icon={Users} color="blue" />
        <StatCard
          title="Pending Grading"
          value="4"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Assigned This Week"
          value="12"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Attendance Done"
          value="Yes"
          icon={CheckCircle}
          color="green"
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
