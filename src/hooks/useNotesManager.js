import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  getNotes,
  addNote,
  updateNote,
  updateNoteDate,
  deleteNote,
  updateNotePin,
  getGuestNotes,
  addGuestNote,
  deleteGuestNote,
  updateGuestNote,
  isAuthenticated,
} from "../api";
import { toIsoLocalYmd, normalizeNoteDate } from "../utils/date";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext"; // ✅ centralized toast system

export default function useNotesManager(userId, refreshKey, onNoteAdded) {
  const [notes, setNotes] = useState([]);
  const [modalDay, setModalDay] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [isGlobalAdd, setIsGlobalAdd] = useState(false);
  const [guestNoteCount, setGuestNoteCount] = useState(0);

  const auth = isAuthenticated();
  const { t } = useTranslation("noteRegister");
  const { showSuccess, showError, showWarning, showInfo } = useToast(); // ✅ destructure toast methods

  // 🧠 Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      const data = auth ? await getNotes(userId) : await getGuestNotes();

      setNotes(
        (data || []).map((n) => ({
          ...n,
          date: normalizeNoteDate(n.date),
        }))
      );
    } catch (err) {
      console.error("Error fetching notes:", err);
      // ❌ no toast.error needed — handled globally by fetch interceptor
    }
  }, [auth, userId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes, refreshKey]);

  useEffect(() => {
    const handleAuthChange = () => fetchNotes();
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [fetchNotes]);

  // 🪄 Modal Controls
  const openAddModal = (day, global = false) => {
    setModalDay(global ? null : day);
    setActiveNote(null);
    setIsGlobalAdd(global);
  };

  const openEditModal = (day, note) => {
    setModalDay(day);
    setActiveNote(note);
    setIsGlobalAdd(false);
  };

  const closeModal = () => {
    setModalDay(null);
    setActiveNote(null);
    setIsGlobalAdd(false);
  };

  // 💾 Save or Update Note
  const saveNote = async (noteData) => {
    try {
      const localDay = toIsoLocalYmd(noteData.date || modalDay || new Date());
      const payload = {
        userId,
        title: noteData.title,
        description: noteData.description || "",
        priority: (noteData.priority || "normal").toLowerCase(),
        pinned: !!noteData.pinned,
        date: `${localDay}T12:00:00Z`,
        imageBase64: noteData.imageBase64,
        imageType: noteData.imageType,
      };

      if (activeNote) {
        // ✏️ Update existing note
        if (auth) await updateNote(activeNote.id, payload);
        else await updateGuestNote(activeNote.id, payload);

        showSuccess(t("noteUpdated"));
        setNotes((prev) =>
          prev.map((n) => (n.id === activeNote.id ? { ...n, ...payload } : n))
        );
      } else {
        // ➕ Add new note
        if (auth) {
          await addNote(payload);
        } else {
          await addGuestNote(payload);
          localStorage.setItem("hasGuestNotes", "true");

          // 🧮 Track guest note count + confetti celebration
          setGuestNoteCount((prev) => {
            const newCount = prev + 1;
            if (newCount === 3 && !sessionStorage.getItem("guestPromptShown")) {
              sessionStorage.setItem("guestPromptShown", "true");

              confetti({ particleCount: 70, spread: 70, origin: { y: 0.8 } });

              showInfo(`${t("guestPromptTitle")} — ${t("guestPromptBody")}`);
            }
            return newCount;
          });
        }

        showSuccess(t("noteAdded"));
      }

      fetchNotes();
      onNoteAdded?.();
      closeModal();
    } catch (err) {
      console.error("Error saving note:", err);
      showError(t("saveError"));
      // ❌ no need to rethrow — global handler covers server errors
    }
  };

  // 🗑️ Delete Note
  const removeNote = async (id) => {
    try {
      if (auth) await deleteNote(id);
      else await deleteGuestNote(id);

      setNotes((prev) => prev.filter((n) => n.id !== id));
      showSuccess(t("noteDeleted"));
    } catch (err) {
      console.error("Error deleting note:", err);
      showError(t("deleteError"));
    }
  };

  // 📅 Move Note (change date)
  const moveNote = async (id, newDate) => {
    try {
      const updated = await updateNoteDate(id, `${newDate}T12:00:00Z`);
      showSuccess(t("noteMoved"));
      return { id, date: newDate, ...updated };
    } catch (err) {
      console.error("Error moving note:", err);
      showError(t("moveError"));
      return null;
    }
  };

  // 📌 Pin / Unpin Note
  const togglePin = async (id, pinned) => {
    try {
      await updateNotePin(id, pinned);
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned } : n)));
    } catch (err) {
      console.error("Error updating pin:", err);
      showError(t("pinError"));
    }
  };

  return {
    notes,
    modalDay,
    activeNote,
    isGlobalAdd,
    fetchNotes,
    openAddModal,
    openEditModal,
    closeModal,
    saveNote,
    removeNote,
    moveNote,
    togglePin,
  };
}
