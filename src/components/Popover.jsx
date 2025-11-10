// src/components/Popover.jsx
import React, { useEffect, useRef } from "react";

export default function Popover({ open, anchorEl, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target) && !anchorEl?.contains(e.target)) {
        onClose?.();
      }
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  const rect = anchorEl?.getBoundingClientRect();
  const style = rect
    ? { position: "fixed", top: rect.bottom + 6, left: rect.right - 150 }
    : { position: "fixed", top: 120, left: 120 };

  return (
    <div
      ref={ref}
      style={style}
      className="bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-[9999]"
    >
      {children}
    </div>
  );
}
