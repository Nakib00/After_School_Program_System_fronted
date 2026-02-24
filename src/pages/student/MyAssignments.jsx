import React from "react";
import { Download, Upload } from "lucide-react";
import Badge from "../../components/ui/Badge";

const MyAssignments = () => {
  const assignments = [
    {
      id: 1,
      name: "Math Worksheet B-10",
      subject: "Math",
      due: "2024-02-25",
      status: "pending",
    },
    {
      id: 2,
      name: "English Reading A-05",
      subject: "English",
      due: "2024-02-26",
      status: "submitted",
    },
    {
      id: 3,
      name: "Math Worksheet B-09",
      subject: "Math",
      due: "2024-02-20",
      status: "graded",
      score: 95,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge
                  variant={assignment.subject === "Math" ? "blue" : "purple"}
                >
                  {assignment.subject}
                </Badge>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                  {assignment.name}
                </h3>
              </div>
              {assignment.score && (
                <div className="text-2xl font-black text-green-600">
                  {assignment.score}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-6 flex items-center">
              Due:{" "}
              <span
                className={`ml-1 font-medium ${assignment.status === "pending" ? "text-red-500" : ""}`}
              >
                {assignment.due}
              </span>
            </p>

            <div className="flex space-x-3 mt-auto">
              <button className="flex-1 flex items-center justify-center py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                <Download size={16} className="mr-2" />
                Worksheet
              </button>
              {assignment.status === "pending" && (
                <button className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Upload size={16} className="mr-2" />
                  Submit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAssignments;
