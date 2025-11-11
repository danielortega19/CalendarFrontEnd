import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
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

export default function useNotesManager(userId, refreshKey, onNoteAdded) {
  const [notes, setNotes] = useState([]);
  const [modalDay, setModalDay] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [isGlobalAdd, setIsGlobalAdd] = useState(false);
  const [guestNoteCount, setGuestNoteCount] = useState(0);

  const auth = isAuthenticated();
  const { t } = useTranslation("noteRegister");

  // 🧠 Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      const data = auth ? await getNotes(userId) : await getGuestNotes();

      // ✅ Normalize incoming UTC or plain date to local YYYY-MM-DD
      setNotes(
        (data || []).map((n) => ({
          ...n,
          date: normalizeNoteDate(n.date),
        }))
      );
    } catch (err) {
      console.error("Error fetching notes:", err);
      toast.error(t("loadError"));
    }
  }, [auth, userId, t]);

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
      // 🧭 Build timezone-safe payload
      const localDay = toIsoLocalYmd(noteData.date || modalDay || new Date());
      const payload = {
        userId,
        title: noteData.title,
        description: noteData.description || "",
        priority: (noteData.priority || "normal").toLowerCase(),
        pinned: !!noteData.pinned,
        // ✅ Store at local-noon UTC time to avoid shifting backward in UTC- zones
        date: `${localDay}T12:00:00Z`,
        imageBase64: noteData.imageBase64,
        imageType: noteData.imageType,
      };

      if (activeNote) {
        // ✏️ Update existing note
        if (auth) await updateNote(activeNote.id, payload);
        else await updateGuestNote(activeNote.id, payload);

        toast.success(t("noteUpdated"));
        setNotes((prev) =>
          prev.map((n) => (n.id === activeNote.id ? { ...n, ...payload } : n))
        );
      } else {
        // ➕ Add new note
        if (auth) {
          await addNote(payload);
        } else {
          await addGuestNote(payload);

          // ✅ Mark guest session
          localStorage.setItem("hasGuestNotes", "true");

          // 🧮 Track guest note count and show registration confetti
          setGuestNoteCount((prev) => {
            const newCount = prev + 1;
            if (newCount === 3 && !sessionStorage.getItem("guestPromptShown")) {
              sessionStorage.setItem("guestPromptShown", "true");

              confetti({
                particleCount: 70,
                spread: 70,
                origin: { y: 0.8 },
              });

              toast.custom(
                (tToast) => (
                  <div
                    className={`transform transition-all duration-500 ${
                      tToast.visible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    } bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-yellow-400 text-gray-800 dark:text-gray-200`}
                  >
                    <p className="font-semibold mb-2">
                      💡 {t("guestPromptTitle")}
                    </p>
                    <p className="text-sm mb-3">{t("guestPromptBody")}</p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toast.dismiss(tToast.id)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        {t("maybeLater")}
                      </button>
                      <button
                        onClick={() => {
                          toast.dismiss(tToast.id);
                          window.location.href = "/register";
                        }}
                        className="px-3 py-1 text-sm bg-yellow-300 hover:bg-yellow-400 rounded font-medium transition-transform hover:scale-105"
                      >
                        {t("registerNow")}
                      </button>
                    </div>
                  </div>
                ),
                { duration: 10000 }
              );
            }
            return newCount;
          });
        }

        toast.success(t("noteAdded"));
      }

      fetchNotes();
      onNoteAdded?.();
      closeModal();
    } catch (err) {
      console.error("Error saving note:", err);
      toast.error(t("saveError"));
    }
  };

  // 🗑️ Delete Note
  const removeNote = async (id) => {
    try {
      if (auth) await deleteNote(id);
      else await deleteGuestNote(id);

      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success(t("noteDeleted"));
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error(t("deleteError"));
    }
  };

  // 📅 Move Note (change date)
  const moveNote = async (id, newDate) => {
    try {
      // newDate should already be local day
      const updated = await updateNoteDate(id, `${newDate}T12:00:00Z`);
      toast.success(t("noteMoved"));
      return { id, date: newDate, ...updated };
    } catch (err) {
      console.error("Error moving note:", err);
      toast.error(t("moveError"));
      return null;
    }
  };

  // 📌 Pin / Unpin Note
  const togglePin = async (id, pinned) => {
    try {
      await updateNotePin(id, pinned);
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, pinned } : n))
      );
    } catch (err) {
      console.error("Error updating pin:", err);
      toast.error(t("pinError"));
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
