import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation("footer");
  const navigate = useNavigate();

  return (
    <footer
      className="
        w-full mt-6 py-4 border-t border-[#f0e8d8] dark:border-[#555]
        text-center text-sm transition-colors duration-300
        bg-[var(--sticky-paper)] dark:bg-[#181818]
      "
    >
      <p className="text-gray-600 dark:text-gray-400">
        {t("tittle")} ·{" "}
        <span className="opacity-70 select-none">v1.0</span> ·{" "}
        <span
          onClick={() => navigate("/contact-us")}
          className="
            text-[#b7933f] hover:text-[#d8b45c]
            dark:text-yellow-400 dark:hover:text-yellow-300
            font-medium cursor-pointer transition-colors
          "
        >
          {t("contactLink")}
        </span>
      </p>
    </footer>
  );
}
