import React from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const MyStudents = () => {
  const students = [
    {
      id: 1,
      name: "Anisul Islam",
      level: "B",
      avg_score: "88%",
      last_active: "2 hours ago",
    },
    {
      id: 2,
      name: "Sumiya Khan",
      level: "A",
      avg_score: "92%",
      last_active: "4 hours ago",
    },
  ];

  const columns = [
    { header: "Student Name", accessorKey: "name" },
    { header: "Current Level", accessorKey: "level" },
    {
      header: "Avg Score",
      accessorKey: "avg_score",
      cell: ({ getValue }) => (
        <span className="font-bold text-green-600">{getValue()}</span>
      ),
    },
    { header: "Last Active", accessorKey: "last_active" },
    {
      header: "Actions",
      cell: () => (
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View History
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Students</h2>
      <DataTable columns={columns} data={students} />
    </div>
  );
};

export default MyStudents;
