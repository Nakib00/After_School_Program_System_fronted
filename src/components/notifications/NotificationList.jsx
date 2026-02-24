import React, { useEffect } from "react";
import {
  BookOpen,
  Star,
  DollarSign,
  AlertCircle,
  Calendar,
  TrendingUp,
  Check,
} from "lucide-react";
import { useNotificationStore } from "../../store/notificationStore";

const NotificationList = ({ close }) => {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    loading,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "assignment":
        return { icon: BookOpen, color: "text-blue-500 bg-blue-100" };
      case "grade":
        return { icon: Star, color: "text-yellow-500 bg-yellow-100" };
      case "fee":
        return { icon: DollarSign, color: "text-green-500 bg-green-100" };
      case "fee_overdue":
        return { icon: AlertCircle, color: "text-red-500 bg-red-100" };
      case "attendance":
        return { icon: Calendar, color: "text-orange-500 bg-orange-100" };
      case "progress":
        return { icon: TrendingUp, color: "text-purple-500 bg-purple-100" };
      default:
        return { icon: Check, color: "text-gray-500 bg-gray-100" };
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Mark all as read
        </button>
      </div>

      <div className="overflow-y-auto max-h-96">
        {loading && notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.slice(0, 10).map((notif) => {
              const { icon: Icon, color } = getIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read_at ? "bg-blue-50/30" : ""}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                        {/* Example: 2 hours ago - in real app use date-fns/formatDistanceToNow */}
                        {notif.created_at}
                      </p>
                    </div>
                    {!notif.read_at && (
                      <div className="w-2 h-2 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
        <button
          className="text-xs font-medium text-gray-500 hover:text-gray-700"
          onClick={close}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
