import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../../store/notificationStore";
import NotificationList from "./NotificationList";

const NotificationBell = () => {
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Polling disabled as backend lacks notifications
    // fetchUnreadCount();
    // const interval = setInterval(fetchUnreadCount, 30000);
    // return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 transition-colors bg-white rounded-full hover:bg-gray-100 hover:text-blue-600"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right">
            <NotificationList close={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
