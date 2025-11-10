// src/components/LanguageSwitcher.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const isEnglish = i18n.language?.startsWith("en");

  const switchLang = () => {
    const newLang = isEnglish ? "es" : "en";
    i18n.changeLanguage(newLang);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const flags = { en: "🇺🇸", es: "🇪🇸" };

  return (
    <div
      onClick={switchLang}
      title={`Switch to ${isEnglish ? "Español" : "English"}`}
      className="
        relative flex items-center justify-between
        w-[72px] h-[34px]
        rounded-full p-[4px] cursor-pointer select-none
        bg-gradient-to-br from-[#fff9df] to-[#f6e9b4]
        dark:from-[#18160f] dark:to-[#262213]
        border border-[#e6d98c] dark:border-[#6b5c2a]
        shadow-[inset_0_2px_6px_rgba(255,255,220,0.3),_0_2px_8px_rgba(0,0,0,0.2)]
        transition-all duration-300
        hover:shadow-[0_0_10px_rgba(216,180,92,0.4)]
      "
    >
      {/* ✨ Sliding golden highlight with glow */}
      <div
        className={`
          absolute top-[3px] left-[3px]
          w-[28px] h-[28px]
          rounded-full flex items-center justify-center
          bg-[#f0d573] dark:bg-[#b7933f]
          transition-transform duration-300 ease-[cubic-bezier(0.25,1.25,0.5,1)]
          ${isEnglish ? "translate-x-0" : "translate-x-[34px]"}
          shadow-[0_2px_6px_rgba(0,0,0,0.25)]
          dark:shadow-[0_0_10px_rgba(216,180,92,0.6),_0_0_4px_rgba(255,240,180,0.3)]
        `}
      />

      {/* 🇺🇸 English flag */}
      <span
        className={`
          relative z-10 text-[18px] transition-transform duration-300
          ${isAnimating && isEnglish ? "flag-bounce paper-flicker" : ""}
          ${isEnglish ? "dark:drop-shadow-[0_0_4px_rgba(255,240,180,0.7)]" : ""}
        `}
      >
        {flags.en}
      </span>

      {/* 🇪🇸 Spanish flag */}
      <span
        className={`
          relative z-10 text-[18px] transition-transform duration-300
          ${isAnimating && !isEnglish ? "flag-bounce paper-flicker" : ""}
          ${!isEnglish ? "dark:drop-shadow-[0_0_4px_rgba(255,240,180,0.7)]" : ""}
        `}
      >
        {flags.es}
      </span>
    </div>
  );
}
