import React, { useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "../../components/ui/DataTable";

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Ms. Alice Smith",
      employee_id: "T-101",
      center: "Dhanmondi",
      qualification: "M.A. in Education",
      join_date: "2023-01-15",
      students_assigned: 15,
    },
    {
      id: 2,
      name: "Mr. John Doe",
      employee_id: "T-102",
      center: "Uttara",
      qualification: "B.Sc. in Maths",
      join_date: "2023-03-20",
      students_assigned: 12,
    },
  ]);

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Employee ID", accessorKey: "employee_id" },
    { header: "Center", accessorKey: "center" },
    { header: "Qualification", accessorKey: "qualification" },
    { header: "Join Date", accessorKey: "join_date" },
    { header: "Students", accessorKey: "students_assigned" },
    {
      header: "Actions",
      cell: () => (
        <div className="flex space-x-3">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Edit
          </button>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Assign Students
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Teachers</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} className="mr-2" />
          Add Teacher
        </button>
      </div>
      <DataTable columns={columns} data={teachers} />
    </div>
  );
};

export default Teachers;
