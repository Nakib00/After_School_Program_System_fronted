import React, { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const Centers = () => {
  const [centers, setCenters] = useState([
    {
      id: 1,
      name: "Dhanmondi Branch",
      city: "Dhaka",
      phone: "01711223344",
      admin: "Rahim Ahmed",
      students: 120,
      status: "active",
    },
    {
      id: 2,
      name: "Uttara Branch",
      city: "Dhaka",
      phone: "01811223344",
      admin: "Karim Uddin",
      students: 85,
      status: "active",
    },
  ]);

  const columns = [
    { header: "Center Name", accessorKey: "name" },
    { header: "City", accessorKey: "city" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Admin", accessorKey: "admin" },
    { header: "Students", accessorKey: "students" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() === "active" ? "green" : "red"}>
          {getValue()}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: () => (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Eye size={18} />
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-800">
            <Edit size={18} />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Centers Management</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} className="mr-2" />
          Add Center
        </button>
      </div>
      <DataTable columns={columns} data={centers} />
    </div>
  );
};

export default Centers;
