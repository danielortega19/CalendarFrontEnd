// src/components/DashboardContainer.jsx
import React, { useState } from "react";
import CalendarSidebar from "./CalendarSidebar";
import PinnedNotesPanel from "./PinnedNotesPanel";
import CalendarView from "./CalendarView";
import { Menu } from "lucide-react";

export default function DashboardContainer({
  userId,
  notes,
  refreshKey,
  onNoteAdded,
  onMonthChange,
  openAddModal,
  openEditModal,
  removeNote,
  moveNote,
  onFilter,
  activeMonth,
  showHover,
  requestHideHover,
  forceHideHover,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="
        flex flex-col md:flex-row gap-4 md:gap-6
        w-full pl-4 pr-6 md:pl-8 md:pr-10
        justify-start items-start
      "
    >
      {/* 📱 Mobile Toggle Button */}
      <div className="flex md:hidden justify-between items-center w-full mb-2">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-[#d8b45c] text-[#333] rounded-lg shadow-md hover:bg-[#b7933f] transition-all"
        >
          <Menu size={18} />
          <span className="font-medium">
            {isMenuOpen ? "Close Menu" : "Open Menu"}
          </span>
        </button>
      </div>

      {/* 📅 Sidebar + Pinned Notes */}
      <aside
        className={`
          w-full md:w-[22%]
          flex-shrink-0 flex flex-col gap-3
          bg-[var(--sticky-paper)] text-gray-800
          md:h-[calc(100vh-5rem)]
          md:sticky md:top-4
          border md:border-none border-[#f3e8b3] rounded-xl
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? "max-h-[1000px] opacity-100" : "max-h-0 md:max-h-none opacity-0 md:opacity-100"}
          overflow-hidden md:overflow-visible
        `}
      >
        <div
          className="
            bg-[var(--sticky-paper)]
            border border-[#f3e8b3] dark:border-[#444]
            rounded-xl p-0 shadow-sm
          "
        >
          <CalendarSidebar
            userId={userId}
            refreshKey={refreshKey}
            activeMonth={activeMonth}
            onFilter={onFilter}
            showHover={showHover}
            requestHideHover={requestHideHover}
          />
        </div>

        <div
          className="
            bg-[var(--sticky-paper)]
            border border-[#f0e8d8] dark:border-[#444]
            rounded-xl p-4 shadow-sm
          "
        >
          <PinnedNotesPanel
            userId={userId}
            refreshKey={refreshKey}
            onEditNote={(note) => openEditModal(note.date, note)}
            showHover={showHover}
            requestHideHover={requestHideHover}
          />
        </div>
      </aside>

      {/* 🗓️ Calendar Section */}
      <section
        className="
          flex-[0_0_78%]
          bg-[var(--sticky-paper)]
          border border-[#f0e8d8]
          rounded-2xl
          shadow-[0_2px_8px_rgba(0,0,0,0.05)]
          p-4 md:p-6
          min-h-[calc(100vh-5rem)]
          overflow-hidden
        "
      >
        <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          <CalendarView
            userId={userId}
            refreshKey={refreshKey}
            onNoteAdded={onNoteAdded}
            notes={notes}
            onMonthChange={onMonthChange}
            openAddModal={openAddModal}
            openEditModal={openEditModal}
            removeNote={removeNote}
            moveNote={moveNote}
            showHover={showHover}
            requestHideHover={requestHideHover}
            forceHideHover={forceHideHover}
          />
        </div>
      </section>
    </div>
  );
}
