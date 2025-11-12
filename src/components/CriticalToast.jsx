import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangleIcon, XIcon } from "lucide-react";

export default function CriticalToast({ critical, onClose }) {
  if (!critical) return null;

  const { title, message } = critical;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="fixed top-0 left-0 w-full z-[99999] bg-red-700 text-white flex items-center justify-between px-6 py-3 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-yellow-300" />
          <div>
            <h3 className="font-semibold text-[15px] leading-tight">{title}</h3>
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="opacity-70 hover:opacity-100 transition ml-4"
          aria-label="Close critical alert"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
