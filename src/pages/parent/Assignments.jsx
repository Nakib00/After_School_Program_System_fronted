import React from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const ParentAssignments = () => {
  const assignments = [
    {
      id: 1,
      name: "Math Worksheet B-10",
      status: "pending",
      due: "2024-02-25",
    },
    {
      id: 2,
      name: "English Reading A-05",
      status: "submitted",
      due: "2024-02-26",
    },
  ];

  const columns = [
    { header: "Worksheet Name", accessorKey: "name" },
    { header: "Due Date", accessorKey: "due" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() === "pending" ? "yellow" : "blue"}>
          {getValue()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Child's Assignments</h2>
      <DataTable columns={columns} data={assignments} />
    </div>
  );
};

export default ParentAssignments;
