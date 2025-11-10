// src/layouts/AuthLayout.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { useTheme } from "../hooks/useTheme";

export default function AuthLayout({ title, subtitle, children, showHeader = false }) {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#1e1e1e] text-gray-100"
          : "bg-[#f8f6ef] text-gray-800"
      }`}
    >
      {/* Optional header for consistency */}
      {showHeader && (
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          toggleLanguage={toggleLanguage}
        />
      )}

      <div className="flex-grow flex items-center justify-center px-4">
        <div
          className={`w-full max-w-md rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-8 border transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#202020] border-[#555]"
              : "bg-[#fdfcf9] border-[#f0e8d8]"
          }`}
        >
          <h1
            className={`text-2xl font-semibold text-center mb-2 ${
              theme === "dark" ? "text-yellow-400" : "text-gray-800"
            }`}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`text-sm text-center mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
