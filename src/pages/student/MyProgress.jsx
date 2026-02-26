import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";
import { useAuthStore } from "../../store/authStore";
import Spinner from "../../components/ui/Spinner";
import {
  AlertCircle,
  TrendingUp,
  BookOpen,
  Target,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const MyProgress = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const studentId = user?.student?.id || user?.id;
        if (!studentId) return;

        const response = await studentService.getProgress(studentId);
        setProgressData(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Progress</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track your level progression across different subjects
          </p>
        </div>
        <Link
          to="/student/reports"
          className="flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
        >
          View Detailed Reports
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      {progressData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressData.map((item) => (
            <div
              key={item.id}
              className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-900 font-display flex items-center">
                  <BookOpen size={20} className="mr-2 text-indigo-600" />
                  {item.subject?.name || "Subject"}
                </h3>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Target size={20} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end text-sm font-bold">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">
                      Current Level
                    </span>
                    <span className="text-xl text-gray-900">
                      {item.level?.name || item.level?.level_name || "Level"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-indigo-600">
                      {item.worksheets_completed || 0} Worksheets
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000 shadow-md"
                    style={{
                      width: `${Math.min(100, ((item.worksheets_completed || 0) / 100) * 100)}%`,
                    }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      Avg Score
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {Math.round(item.score || 0)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      Status
                    </p>
                    <p
                      className={`text-sm font-bold ${item.is_level_complete ? "text-green-600" : "text-orange-500"}`}
                    >
                      {item.is_level_complete ? "Completed" : "In Progress"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
          <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">
            No progress data yet
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Start submitting worksheets to see your level progression and
            performance stats here.
          </p>
          <Link
            to="/student/assignments"
            className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Go to Assignments
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProgress;
