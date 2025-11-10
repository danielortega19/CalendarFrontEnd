import React, { useState, useMemo } from "react";
import { isAfter, isBefore } from "date-fns";
import { useTranslation } from "react-i18next";

export default function SmartFilter({ notes = [], onFilter }) {
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { t } = useTranslation("smartFilter");

  const insight = useMemo(() => {
    const imp = notes.filter((n) => n.priority === "important").length;
    const rem = notes.filter((n) => n.priority === "reminder").length;
    const nor = notes.filter((n) => n.priority === "normal").length;
    return { imp, rem, nor };
  }, [notes]);

  const apply = () => {
    const result = notes.filter((n) => {
      const p = n.priority || "normal";
      const title = (n.title || "").toLowerCase();
      const d = new Date(n.date);
      if (q && !title.includes(q.toLowerCase())) return false;
      if (priority !== "all" && p !== priority) return false;
      if (from && isBefore(d, new Date(from))) return false;
      if (to && isAfter(d, new Date(to))) return false;
      return true;
    });
    const range =
      from && to
        ? { from, to }
        : from
        ? { from, to: null }
        : to
        ? { from: null, to }
        : null;
    onFilter?.(result, range);
  };

  const clearAll = () => {
    setQ("");
    setPriority("all");
    setFrom("");
    setTo("");
    onFilter?.([], null);
  };

  return (
    <div
      className="
        rounded-2xl border border-[#f0e8d8] bg-[#fdfcf9]
        p-4 space-y-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]
        text-gray-800 transition-all duration-300
        dark:bg-[#2b2b2b] dark:border-[#555] dark:text-[#f0f0f0]
      "
    >
      {/* 🔍 Search input */}
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        className="
          w-full rounded-lg border border-[#f0e8d8] bg-[#fffdf4]
          px-3 py-2 text-sm text-gray-800 placeholder-gray-400
          focus:ring-2 focus:ring-[#d8b45c] outline-none transition
          dark:bg-[#3a3a3a] dark:border-[#555] dark:text-[#f0f0f0]
        "
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* ⚙️ Priority Dropdown */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="
          w-full rounded-lg border border-[#f0e8d8] bg-[#fffdf4]
          px-3 py-2 text-sm text-gray-800
          focus:ring-2 focus:ring-[#d8b45c] outline-none transition
          dark:bg-[#3a3a3a] dark:border-[#555] dark:text-[#f0f0f0]
        "
      >
        <option value="all">{t("allPriorities")}</option>
        <option value="normal">{t("normal")}</option>
        <option value="important">{t("important")}</option>
        <option value="reminder">{t("reminder")}</option>
      </select>

      {/* 📅 Date Filters */}
      <div className="flex gap-2">
        <input
          type="date"
          aria-label={t("fromDate")}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="
            w-1/2 rounded-lg border border-[#f0e8d8] bg-[#fffdf4]
            px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-[#d8b45c] outline-none
            dark:bg-[#3a3a3a] dark:border-[#555] dark:text-[#f0f0f0]
          "
        />
        <input
          type="date"
          aria-label={t("toDate")}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="
            w-1/2 rounded-lg border border-[#f0e8d8] bg-[#fffdf4]
            px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-[#d8b45c] outline-none
            dark:bg-[#3a3a3a] dark:border-[#555] dark:text-[#f0f0f0]
          "
        />
      </div>

      {/* 💡 Insights */}
      <div
        className="
          text-xs text-gray-700 bg-[#fff9b1]/80 border border-[#f0e8d8]
          rounded-xl p-2 shadow-inner italic
          dark:bg-[#333319] dark:border-[#777] dark:text-[#f7f7c0]
        "
      >
        {t("insight", { imp: insight.imp, rem: insight.rem, nor: insight.nor })}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={apply}
          className="
            flex-1 bg-[#d8b45c] hover:bg-[#b7933f]
            text-[#333] font-semibold rounded-lg py-2 shadow-sm
            border border-[#b7933f] transition
          "
        >
          {t("apply")}
        </button>

        <button
          onClick={clearAll}
          className="
            flex-1 bg-[#f8f6ef] hover:bg-[#f0eadf]
            text-gray-700 font-semibold rounded-lg py-2 border border-[#f0e8d8]
            shadow-sm transition
            dark:bg-[#3a3a3a] dark:border-[#555] dark:text-[#eee]
          "
        >
          {t("clear")}
        </button>
      </div>
    </div>
  );
}
