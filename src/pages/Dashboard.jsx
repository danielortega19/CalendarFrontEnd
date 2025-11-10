import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../api";
import NoteModal from "../components/NoteModal";
import toast from "react-hot-toast";
import useNotesManager from "../hooks/useNotesManager";
import { useTranslation } from "react-i18next";
import LanguageFadeWrapper from "../components/LanguageFadeWrapper";
import DashboardContainer from "../components/DashboardContainer";
import useNoteHover from "../hooks/useNoteHover";
import NoteHoverCard from "../components/NoteHoverCard";
import GuestBanner from "../components/GuestBanner";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filterRange, setFilterRange] = useState(null);
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [editingNote, setEditingNote] = useState(null);

  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();

  // 🧭 Hover management
  const {
    hoverNote,
    hoverAnchor,
    hoverVisible,
    showHover,
    requestHideHover,
    forceHideHover,
    lockHover,
    unlockHover,
  } = useNoteHover();

  // 🔐 Load user info
  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const data = await getCurrentUser();
          setUser(data);
          setIsGuest(false);
        } catch {
          toast.error(t("sessionEnd"));
          setUser(null);
          setIsGuest(true);
          localStorage.removeItem("token");
        }
      } else {
        setUser(null);
        setIsGuest(true);
      }
    };
    loadUser();
  }, [t]);

  // 🔁 Listen for auth changes to refresh user info and UI
  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        if (isAuthenticated()) {
          const data = await getCurrentUser();
          setUser(data);
          setIsGuest(false);
        } else {
          setUser(null);
          setIsGuest(true);
        }

        // 🧹 Reset filters and modal when switching accounts
        setFilteredNotes([]);
        setFilterRange(null);
        setEditingNote(null);

        // 🔄 Force refresh of notes
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error("Auth refresh error:", err);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const refreshNotes = () => setRefreshKey((k) => k + 1);

  // 🧠 Note Management
  const {
    notes,
    modalDay,
    activeNote,
    isGlobalAdd,
    openAddModal,
    openEditModal,
    closeModal,
    saveNote,
    removeNote,
    moveNote,
  } = useNotesManager(user?.id, refreshKey, refreshNotes);

  return (
    <LanguageFadeWrapper>
      {!isAuthenticated() && <GuestBanner />}
      <div className="min-h-screen flex flex-col bg-[var(--sticky-paper)] text-gray-800">
        <main
          className="
            flex flex-col md:flex-row gap-4 md:gap-5
            px-2 md:px-4 py-4
            w-full max-w-[1500px] mx-auto
          "
        >
          {/* 🧩 Dashboard Container */}
          <DashboardContainer
            userId={user?.id}
            notes={filteredNotes.length ? filteredNotes : notes}
            refreshKey={refreshKey}
            onNoteAdded={refreshNotes}
            onMonthChange={(month) => setActiveMonth(month)}
            openAddModal={openAddModal}
            openEditModal={openEditModal}
            removeNote={removeNote}
            moveNote={moveNote}
            onFilter={(data) => {
              if (!data) {
                setFilteredNotes([]);
                setFilterRange(null);
                return;
              }
              if (Array.isArray(data)) {
                setFilteredNotes(data);
                setFilterRange(null);
              } else {
                setFilteredNotes(data.filteredNotes || []);
                setFilterRange(data.range || null);
              }
            }}
            activeMonth={activeMonth}
            showHover={showHover}
            requestHideHover={requestHideHover}
            forceHideHover={forceHideHover}
          />
        </main>

        {/* 💬 Hover Card */}
        {hoverVisible && hoverNote && (
          <NoteHoverCard
            note={hoverNote}
            anchor={hoverAnchor}
            onEdit={(note) => openEditModal(note.date, note)}
            onDelete={(id) => removeNote(id)}
            onRequestClose={forceHideHover}
            lockHover={lockHover}
            unlockHover={unlockHover}
          />
        )}

        {/* ✏️ Note Modal */}
        {(modalDay || isGlobalAdd || editingNote) && (
          <NoteModal
            day={modalDay}
            note={editingNote || activeNote}
            isGlobalAdd={isGlobalAdd}
            onClose={() => {
              setEditingNote(null);
              closeModal();
            }}
            onSave={saveNote}
            onDelete={removeNote}
          />
        )}
      </div>
    </LanguageFadeWrapper>
  );
}
