import React from "react";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, children, title = "Reply" }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center sm:items-center p-4"
      style={{ backgroundColor: "rgba(91, 112, 131, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          boxShadow: "0 0 15px rgba(255,255,255,0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--text-primary)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X size={20} />
          </button>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{title}</span>
          <div className="w-10"></div>
        </div>
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
