import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-100",
    error: "bg-red-50 border-red-100",
    info: "bg-blue-50 border-blue-100",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[200] flex items-center p-4 rounded-xl border shadow-lg animate-in slide-in-from-right duration-300 ${bgColors[type]}`}
    >
      <div className="mr-3">{icons[type]}</div>
      <p className="text-sm font-medium text-gray-800 mr-8">{message}</p>
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
