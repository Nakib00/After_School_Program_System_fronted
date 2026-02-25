import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { studentService } from "../../services/studentService";
import { useAuthStore } from "../../store/authStore";
import Spinner from "../../components/ui/Spinner";
import { AlertCircle, TrendingUp, BookOpen, Target } from "lucide-react";

const MyProgress = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const studentId = user?.student?.id || user?.id;
        if (!studentId) return;

        const response = await studentService.getProgress(studentId);
        // Assuming response.data.data includes progress stats and history
        const data = response.data.data || {};
        setProgress(data.current_progress || null);

        // Mocking or formatting history if the backend provides it, otherwise empty
        setScoreHistory(data.score_history || []);
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Progress</h2>
        <p className="text-sm text-gray-500 mt-1">
          See how you're doing in your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900 font-display">
              Score History
            </h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>

          {scoreHistory.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    dot={{
                      r: 6,
                      fill: "#4f46e5",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <TrendingUp size={40} className="mb-2 opacity-20" />
              <p className="text-sm font-medium">No score data yet</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900 font-display">
              Level Progression
            </h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Target size={20} />
            </div>
          </div>

          {progress ? (
            <div className="space-y-6">
              <div className="flex justify-between items-end text-sm font-bold">
                <div className="flex flex-col">
                  <span className="text-gray-500 font-medium">
                    Current Level
                  </span>
                  <span className="text-xl text-gray-900">
                    {progress.level?.name || "Level"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-indigo-600">
                    {progress.worksheets_completed} Worksheets
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-1000 shadow-md"
                  style={{
                    width: `${Math.min(100, (progress.worksheets_completed / 100) * 100)}%`,
                  }} // Assuming 100 as a milestone
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Avg Score
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    {Math.round(progress.average_score)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Avg Time
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    {Math.round(progress.average_time)} min
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">
                Start submitting worksheets to track your progress!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProgress;
