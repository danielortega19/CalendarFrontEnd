import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toIsoLocalYmd } from "../utils/date";
import { format, eachDayOfInterval, startOfWeek, addDays } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export default function CalendarView({
  userId,
  notes,
  filterRange,
  onNoteAdded,
  onClearFilters,
  onMonthChange,
  openEditModal,
  openAddModal,
  removeNote,
  moveNote,
  showHover,
  requestHideHover,
}) {
  const { i18n, t } = useTranslation("dashboard");
  const currentLocale = i18n.language === "es" ? es : enUS;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // --- Month logic ---
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes || []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // --- Calendar range ---
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const days = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1))
    days.push(new Date(d));

  const start = startOfWeek(new Date(), { locale: currentLocale });
  const dayNames = eachDayOfInterval({ start, end: addDays(start, 6) }).map((d) =>
    cap(format(d, "EEE", { locale: currentLocale }))
  );

  const pastel = [
    { light: "#fff8d5", dark: "#5b4a00" },
    { light: "#fde2e2", dark: "#613434" },
    { light: "#e0f7fa", dark: "#16464b" },
    { light: "#f9f1d9", dark: "#564a24" },
    { light: "#f0e6ff", dark: "#3f2f61" },
    { light: "#dfffe0", dark: "#1f4a28" },
  ];

  const onDragStart = () => document.body.classList.add("is-dragging");

  const onDragEnd = async (result) => {
    document.body.classList.remove("is-dragging");
    if (!result.destination) return;

    try {
      setLoading(true);
      const updated = await moveNote(result.draggableId, result.destination.droppableId);
      if (updated) {
        onNoteAdded?.();
      }
    } catch (err) {
      console.error("❌ Drag error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getNotesForDay = (day) => {
    const key = toIsoLocalYmd(day);
    return localNotes.filter((n) => toIsoLocalYmd(n.date) === key);
  };

  // Update when parent notes change
  useEffect(() => {
    setLocalNotes(notes || []);
  }, [notes]);

  const visibleDays = days.filter((d) => d.getMonth() === month);

  return (
    <div className="relative p-4 md:p-6 rounded-2xl border border-[#f3e8b3] bg-[var(--sticky-paper)] dark:bg-[#181818] dark:border-[#d1b866] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all">
      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 flex items-center justify-center rounded-2xl z-10 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#d8b45c] border-t-transparent"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-5">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded-md bg-[#d8b45c] hover:bg-[#c59a3e] text-[#333] border border-[#b7933f]"
            onClick={() => {
              const newMonth = new Date(year, month - 1, 1);
              setCurrentMonth(newMonth);
              onMonthChange?.(newMonth);
            }}
          >
            ← {t("prev")}
          </button>
          <button
            className="px-3 py-1 rounded-md border border-[#f3e8b3] bg-[var(--sticky-paper)] hover:bg-[rgba(255,255,240,0.7)] dark:border-[#d1b866] dark:bg-[#1f1f1f] dark:text-[#f3e9c9]"
            onClick={() => setCurrentMonth(new Date())}
          >
            {t("today")}
          </button>
          <button
            className="px-3 py-1 rounded-md bg-[#d8b45c] hover:bg-[#c59a3e] text-[#333] border border-[#b7933f]"
            onClick={() => {
              const newMonth = new Date(year, month + 1, 1);
              setCurrentMonth(newMonth);
              onMonthChange?.(newMonth);
            }}
          >
            {t("next")} →
          </button>
        </div>

        <h2 className="font-semibold text-2xl capitalize text-center text-[#4f461a] dark:text-[#fcecae]">
          {cap(format(currentMonth, "MMMM yyyy", { locale: currentLocale }))}
        </h2>
      </div>

      {/* 📱 Mobile View */}
      <div className="md:hidden space-y-3 transition-all duration-300">
        {visibleDays.map((day) => {
          const dateKey = toIsoLocalYmd(day);
          const dailyNotes = getNotesForDay(day);

          return (
            <div
              key={dateKey}
              className="p-3 rounded-xl border border-[#f3e8b3] bg-[var(--sticky-paper)] dark:bg-[#1f1f1f] dark:border-[#d1b866] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-[#333] dark:text-[#f3e9c9]">
                  {(() => {
                    const formatted = format(day, "EEE, MMM d", { locale: currentLocale });
                    return formatted
                      .split(" ")
                      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                      .join(" ");
                  })()}
                </h3>

                <button
                  onClick={() => openAddModal(dateKey)}
                  className="px-2 py-1 rounded-md bg-[#d8b45c] hover:bg-[#b7933f] text-[#333] text-xs"
                >
                  + {t("add")}
                </button>
              </div>

              {dailyNotes.length ? (
                <ul className="space-y-1">
                  {dailyNotes.map((n) => (
                    <li
                      key={n.id}
                      className="text-sm border-l-4 border-[#d8b45c] pl-2 cursor-pointer hover:translate-x-[2px] transition-all select-none text-gray-700 dark:text-[#f3e9c9]"
                      onClick={(e) => {
                        if (window.innerWidth < 768) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const centeredAnchor = {
                            x: window.innerWidth / 2 - 150,
                            y: rect.top + window.scrollY - 50,
                            width: 300,
                            height: 220,
                          };
                          showHover(n, centeredAnchor);
                        } else {
                          openEditModal(dateKey, n);
                        }
                      }}
                      onDoubleClick={() => openEditModal(dateKey, n)}
                    >
                      {n.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-gray-500 dark:text-[#bcae80] italic">
                  {t("noNotes")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 🧱 Desktop Grid View */}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="hidden md:grid grid-cols-7 gap-[6px] md:gap-[8px] lg:gap-[10px] text-sm">
          {dayNames.map((d) => (
            <div
              key={d}
              className="text-center font-semibold text-[#5f5625] dark:text-[#fcecae] pb-1"
            >
              {d}
            </div>
          ))}

          {days.map((day) => {
            const dateKey = toIsoLocalYmd(day);
            const dailyNotes = getNotesForDay(day);
            const isCurrentMonth = day.getMonth() === month;

            return (
              <Droppable droppableId={dateKey} key={dateKey}>
                {(dropProvided) => (
                  <div
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    className={`relative rounded-2xl p-3 border border-[#f3e8b3] bg-[var(--sticky-paper)] dark:bg-[#181818] dark:border-[#d1b866] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 ease-in-out ${
                      (() => {
                        const isPastDay = day < new Date().setHours(0, 0, 0, 0);
                        if (!isCurrentMonth || isPastDay) return "opacity-60 grayscale-[0.2]";
                        return "opacity-100";
                      })()
                    } h-[150px] sm:h-[170px] md:h-[190px] lg:h-[210px] overflow-hidden`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-[#333] dark:text-[#f3e9c9]">
                        {day.getDate()}
                      </span>
                      <button
                        onClick={() => openAddModal(dateKey)}
                        className="w-6 h-6 rounded-full bg-[#d8b45c] text-[#333] hover:bg-[#c59a3e] text-sm flex items-center justify-center"
                        title={t("addNote")}
                      >
                        +
                      </button>
                    </div>

                    <div className="space-y-1 max-h-[calc(100%-2rem)] overflow-y-auto pr-1">
                      {dailyNotes.length ? (
                        dailyNotes.map((n, index) => {
                          const palette = pastel[index % pastel.length];
                          return (
                            <Draggable key={n.id} draggableId={n.id.toString()} index={index}>
                              {(dragProvided) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={{
                                    backgroundColor:
                                      document.documentElement.classList.contains("dark")
                                        ? palette.dark
                                        : palette.light,
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: document.documentElement.classList.contains("dark")
                                      ? "#f3f3f3"
                                      : "#333",
                                    boxShadow: document.documentElement.classList.contains("dark")
                                      ? "0 1px 3px rgba(0,0,0,0.4)"
                                      : "0 1px 3px rgba(0,0,0,0.1)",
                                    ...dragProvided.draggableProps.style,
                                  }}
                                  onMouseEnter={(e) => showHover(n, e.currentTarget)}
                                  onMouseLeave={requestHideHover}
                                  onDoubleClick={() => openEditModal(dateKey, n)}
                                  className="px-2 py-1 text-xs rounded-md truncate cursor-pointer select-none hover:-translate-y-[2px] transition-transform duration-150"
                                >
                                  {n.title}
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      ) : (
                        <p className="text-[11px] italic text-gray-500 dark:text-[#bcae80]">
                          {t("noNotes")}
                        </p>
                      )}
                      {dropProvided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
