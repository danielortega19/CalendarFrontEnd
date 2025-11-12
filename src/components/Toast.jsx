import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  XCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";

export default function Toast({ toast, onClose }) {
  const { type, message, code } = toast;
  const [progress, setProgress] = useState(100);

  // Theme setup
  const themes = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/40",
      border: "border-green-300 dark:border-green-700",
      text: "text-green-800 dark:text-green-200",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />,
    },
    error: {
      bg: "bg-red-50 dark:bg-[#2b1a1a]",
      border: "border-red-300 dark:border-red-700",
      text: "text-red-800 dark:text-red-200",
      icon: <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />,
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      border: "border-yellow-300 dark:border-yellow-700",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: <AlertTriangleIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />,
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-300 dark:border-blue-700",
      text: "text-blue-800 dark:text-blue-200",
      icon: <InfoIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
    },
  };

  // 🔸 Convert certain known error codes into warning tone
  const isSoftError =
    code === "DUPLICATE_NOTE" ||
    code === "INVALID_ARGUMENT" ||
    code === "IMAGE_TOO_LARGE" ||
    code === "NOTE_UPDATE_NO_MATCH";

  const theme = isSoftError
    ? themes.warning
    : themes[type] || themes.info;

  // 🔄 Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p > 0 ? p - 1 : 0));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className={`relative w-full flex items-start gap-3 border rounded-xl p-4 shadow-lg ${theme.bg} ${theme.border} ${theme.text}`}
    >
      {theme.icon}
      <div className="flex-1 text-sm leading-snug">
        <p className="font-medium">{message}</p>
        {code && (
          <p className="text-[11px] mt-1 opacity-70 tracking-wide">
            Code: {code}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 transition"
      >
        <XIcon className="w-4 h-4" />
      </button>

      {/* 🔸 Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[3px] bg-current opacity-30 rounded-b-xl"
        animate={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.1 }}
      />
    </motion.div>
  );
}
