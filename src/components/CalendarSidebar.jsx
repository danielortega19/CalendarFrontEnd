// src/components/CalendarSidebar.jsx
import React, { useEffect, useState } from "react";
import { getNotes } from "../api";
import { format, parseISO, isSameMonth } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Pin } from "lucide-react";
import { useTranslation } from "react-i18next";
import SmartFilter from "./SmartFilter";

export default function CalendarSidebar({
  userId,
  refreshKey,
  activeMonth,
  onFilter,
  showHover,
  requestHideHover,
}) {
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { t, i18n } = useTranslation("sidebar");
  const locale = i18n.language === "es" ? es : enUS;

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes(userId);
      setNotes(data || []);
    };
    fetchNotes();
  }, [userId, refreshKey]);

  useEffect(() => {
    const monthlyNotes = notes.filter((n) =>
      isSameMonth(parseISO(n.date), activeMonth)
    );
    setVisibleNotes(monthlyNotes);
  }, [activeMonth, notes]);

  const total = visibleNotes.length;
  const normal = visibleNotes.filter((n) => (n.priority || "normal") === "normal").length;
  const imp = visibleNotes.filter((n) => n.priority === "important").length;
  const rem = visibleNotes.filter((n) => n.priority === "reminder").length;
  const recent = [...visibleNotes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  return (
    <aside className="rounded-xl border border-[#f3e8b3] bg-[var(--sticky-paper)] dark:bg-[#202020] dark:border-[#6b5c2a]">
      <div className="sticky top-0 z-10 px-4 py-3 flex justify-between items-center border-b border-[#e6d78a] dark:border-[#555] bg-[var(--sticky-highlight)] dark:bg-[#222]">
        <div>
         <h3 className="text-lg font-bold">
  {(() => {
    const monthYear = format(activeMonth, "MMMM yyyy", { locale });
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
  })()}
</h3>
          <p className="text-sm opacity-80">{t("totalNotes")}: {total}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <ul className="text-sm space-y-1">
          <li>🟡 {t("normal")}: {normal}</li>
          <li>🔴 {t("important")}: {imp}</li>
          <li>🔵 {t("reminder")}: {rem}</li>
        </ul>

     {/* Recent Notes */}
<div>
  <div className="flex items-center justify-between mb-2">
    <h4 className="text-sm font-semibold flex items-center gap-2 text-[#333] dark:text-[#f5f5dc]">
      🕓 {t("recentNotes")}
    </h4>
  </div>

  {recent.length === 0 ? (
    <p className="text-xs italic text-gray-600 dark:text-gray-400">
      {t("noNotesThisMonth")}
    </p>
  ) : (
    <ul className="space-y-2">
      {recent.map((n) => (
        <li
          key={n.id}
          className={`text-xs border-l-4 rounded-md p-2 cursor-pointer transition-all
            ${
              n.priority === "important"
                ? "border-[#ea8b70]"
                : n.priority === "reminder"
                ? "border-[#9ab8dc]"
                : "border-[#d8b45c]"
            }
            bg-[#f8f6ef] hover:bg-[#f7f3e8]
            dark:bg-[#262626] dark:hover:bg-[#2e2e2e]
            shadow-sm hover:shadow-md`}
          onMouseEnter={(e) => showHover({ ...n, from: "sidebar" }, e.currentTarget)}
          onMouseLeave={requestHideHover}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium truncate text-[#333] dark:text-[#f3f3f3]">
                {n.title}
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                {format(new Date(n.date), "MMM d, yyyy", { locale })}
              </p>
            </div>
            {n.pinned && <Pin size={14} className="text-[#d8b45c]" />}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>



        {/* Filters */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="w-full py-2 rounded-md text-sm font-medium bg-[#d8b45c] hover:bg-[#b7933f] text-[#333] border border-[#b7933f]"
        >
          {showFilter ? t("hideFilters") : t("showFilters")}
        </button>
        {showFilter && (
          <div className="mt-3 border border-[#f3e8b3] rounded-lg p-3">
            <SmartFilter notes={visibleNotes} onFilter={onFilter} />
          </div>
        )}
      </div>
    </aside>
  );
}
