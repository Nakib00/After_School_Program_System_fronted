import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Anisul Islam",
      enrollment_no: "K-001",
      center: "Dhanmondi",
      grade: "4",
      teacher: "Ms. Smith",
      status: "active",
    },
    {
      id: 2,
      name: "Sumiya Khan",
      enrollment_no: "K-002",
      center: "Uttara",
      grade: "3",
      teacher: "Mr. Brown",
      status: "active",
    },
  ]);

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Enrollment No", accessorKey: "enrollment_no" },
    { header: "Center", accessorKey: "center" },
    { header: "Grade", accessorKey: "grade" },
    { header: "Teacher", accessorKey: "teacher" },
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
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} className="mr-2" />
          Enroll Student
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={18} className="mr-2" />
          Filters
        </button>
      </div>

      <DataTable columns={columns} data={students} />
    </div>
  );
};

export default Students;
