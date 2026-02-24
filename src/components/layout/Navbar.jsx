import React, { useEffect } from "react";
import { Bell, Menu, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import NotificationBell from "../notifications/NotificationBell";

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-1 -ml-1 mr-4 text-gray-500 rounded-md md:hidden hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 md:hidden">
          Kumon LMS
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationBell />

        <div className="flex items-center pl-4 border-l border-gray-200">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user?.role?.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
