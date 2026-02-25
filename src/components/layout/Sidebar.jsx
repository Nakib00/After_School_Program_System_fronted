import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  ClipboardList,
  CheckSquare,
  Calendar,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Star,
  Clock,
  ListTodo,
  FileUp,
  FileText,
  X,
  Menu,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = {
    super_admin: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/super-admin/dashboard",
      },
      { name: "Centers", icon: Building2, path: "/super-admin/centers" },
      {
        name: "Center Admins",
        icon: Users,
        path: "/super-admin/center-admins",
      },
      { name: "Students", icon: Users, path: "/super-admin/students" },
      { name: "Parents", icon: Users, path: "/super-admin/parents" },
      { name: "Teachers", icon: GraduationCap, path: "/super-admin/teachers" },
      { name: "Subjects", icon: BookOpen, path: "/super-admin/subjects" },
      { name: "Levels", icon: ListTodo, path: "/super-admin/levels" },
      { name: "Fees", icon: DollarSign, path: "/super-admin/fees" },
      { name: "Reports", icon: BarChart3, path: "/super-admin/reports" },
    ],
    center_admin: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/center-admin/dashboard",
      },
      { name: "Students", icon: Users, path: "/center-admin/students" },
      { name: "Parents", icon: Users, path: "/center-admin/parents" },
      { name: "Teachers", icon: GraduationCap, path: "/center-admin/teachers" },
      { name: "Attendance", icon: Calendar, path: "/center-admin/attendance" },
      { name: "Fees", icon: DollarSign, path: "/center-admin/fees" },
      { name: "Reports", icon: BarChart3, path: "/center-admin/reports" },
    ],
    teacher: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/teacher/dashboard" },
      { name: "My Students", icon: Users, path: "/teacher/students" },
      { name: "Subjects", icon: BookOpen, path: "/teacher/subjects" },
      { name: "Levels", icon: ListTodo, path: "/teacher/levels" },
      { name: "Worksheets", icon: FileText, path: "/teacher/worksheets" },
      { name: "Assignments", icon: BookOpen, path: "/teacher/assignments" },
      { name: "Grade Submissions", icon: CheckSquare, path: "/teacher/grade" },
      { name: "Attendance", icon: Calendar, path: "/teacher/attendance" },
    ],
    parents: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/parent/dashboard" },
      { name: "Child Progress", icon: TrendingUp, path: "/parent/progress" },
      { name: "Assignments", icon: ClipboardList, path: "/parent/assignments" },
      { name: "Fees", icon: DollarSign, path: "/parent/fees" },
    ],
    student: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
      {
        name: "My Assignments",
        icon: ClipboardList,
        path: "/student/assignments",
      },
      { name: "Submit Work", icon: FileUp, path: "/student/submit" },
      { name: "My Progress", icon: Star, path: "/student/progress" },
    ],
  };

  const currentMenu = user?.role ? menuItems[user.role] : [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900 border-b border-gray-800">
          <span className="text-xl font-bold text-blue-500">ZAN LMS</span>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
