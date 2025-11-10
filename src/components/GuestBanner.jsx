import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Clock, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GuestBanner() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-[#fff9d6] dark:bg-[#3b3310] 
        border border-[#e8cf6b] dark:border-[#a88f2a]
        text-gray-800 dark:text-yellow-100
        rounded-xl px-4 py-3 mb-4 flex flex-col md:flex-row 
        items-start md:items-center justify-between gap-2 shadow-sm
      "
    >
      <div className="flex items-start md:items-center gap-2">
        <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400 mt-[2px]" />
        <div>
          <p className="text-sm font-medium">{t("guestBannerTitle")}</p>
          <p className="text-xs text-gray-700 dark:text-yellow-200 flex items-center gap-1 mt-1">
            <Clock size={14} /> {t("guestBannerSubtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
