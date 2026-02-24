import React from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const GradeSubmissions = () => {
  const submissions = [
    {
      id: 1,
      student: "Anisul Islam",
      worksheet: "Math Level B-10",
      submitted_at: "2024-02-23 10:30 AM",
      time_taken: "45 mins",
    },
    {
      id: 2,
      student: "Sumiya Khan",
      worksheet: "Math Level B-11",
      submitted_at: "2024-02-23 11:15 AM",
      time_taken: "38 mins",
    },
  ];

  const columns = [
    { header: "Student", accessorKey: "student" },
    { header: "Worksheet", accessorKey: "worksheet" },
    { header: "Submitted At", accessorKey: "submitted_at" },
    { header: "Time Taken", accessorKey: "time_taken" },
    {
      header: "Action",
      cell: () => (
        <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          Grade Now
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Grade Submissions</h2>
      <DataTable columns={columns} data={submissions} />
    </div>
  );
};

export default GradeSubmissions;
