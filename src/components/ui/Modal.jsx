import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 right-0 h-full w-full ${sizeClasses[size] || sizeClasses.md} bg-white shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.15)] flex flex-col border-l border-gray-100 animate-slide-in-right z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-50 flex-shrink-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="animate-fade-in fill-mode-forwards opacity-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
