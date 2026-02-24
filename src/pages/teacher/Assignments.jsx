import React, { useState } from "react";
import { Plus, Send } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const Assignments = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      student: "Anisul Islam",
      worksheet: "Math Level B-10",
      subject: "Math",
      level: "B",
      assigned_date: "2024-02-20",
      due_date: "2024-02-25",
      status: "assigned",
    },
    {
      id: 2,
      student: "Sumiya Khan",
      worksheet: "English Level A-05",
      subject: "English",
      level: "A",
      assigned_date: "2024-02-21",
      due_date: "2024-02-26",
      status: "submitted",
    },
  ]);

  const columns = [
    { header: "Student", accessorKey: "student" },
    { header: "Worksheet", accessorKey: "worksheet" },
    { header: "Subject", accessorKey: "subject" },
    { header: "Assigned", accessorKey: "assigned_date" },
    { header: "Due", accessorKey: "due_date" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const variants = {
          assigned: "blue",
          submitted: "yellow",
          graded: "green",
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
      },
    },
    {
      header: "Actions",
      cell: () => (
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Bulk Assign
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} className="mr-2" />
            Assign Worksheet
          </button>
        </div>
      </div>
      <DataTable columns={columns} data={assignments} />
    </div>
  );
};

export default Assignments;
