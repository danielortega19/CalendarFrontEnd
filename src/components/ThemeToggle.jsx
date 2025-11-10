import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../hooks/useTheme"; // ✅ import your context

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme(); // ✅ directly from context
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="
        relative flex items-center justify-center w-10 h-10 rounded-full
        border border-[#f0e8d8] bg-[#fffdf4]
        shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform
        hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]
        dark:bg-[#2b2b2b] dark:border-[#555] dark:shadow-[0_0_10px_rgba(255,240,130,0.15)]
      "
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          // 🌙 Moon Icon
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute w-5 h-5 rounded-full bg-[#d8b45c]/40 shadow-inner"
          >
            <span
              className="absolute w-5 h-5 bg-[#2b2b2b] dark:bg-[#fdfcf9] rounded-full top-[3px] left-[3px]"
              style={{ boxShadow: "inset 0 0 6px rgba(0,0,0,0.2)" }}
            ></span>
          </motion.span>
        ) : (
          // ☀️ Sun Icon
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute flex items-center justify-center"
          >
            {/* Sun Core */}
            <div className="w-5 h-5 bg-[#f0c75e] rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.4)]"></div>

            {/* ☀️ Rays */}
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute w-[2px] h-[6px] bg-[#f0c75e] rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-8px)`,
                  transformOrigin: "center",
                }}
              ></span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
