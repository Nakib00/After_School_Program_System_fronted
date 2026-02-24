import React from "react";
import { useAuthStore } from "../../store/authStore";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const dashboardMap = {
      super_admin: "/super-admin/dashboard",
      center_admin: "/center-admin/dashboard",
      teacher: "/teacher/dashboard",
      parent: "/parent/dashboard",
      student: "/student/dashboard",
    };
    return <Navigate to={dashboardMap[user.role]} replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Login to LMS
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@kumon.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform transition-transform active:scale-[0.98] shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500">
          <a
            href="/forgot-password"
            replace
            className="text-blue-600 hover:underline font-medium"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
