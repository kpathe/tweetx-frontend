import React from "react";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, children, title = "Reply" }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm sm:items-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-900 dark:text-white"
          >
            <X size={20} />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">{title}</span>
          <div className="w-10"></div>
        </div>
        <div className="p-4 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
