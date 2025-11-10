// src/components/PinnedNotesPanel.jsx
import React, { useEffect, useState } from "react";
import { Pin, Trash2, Edit3 } from "lucide-react";
import { getNotes, updateNotePin, deleteNote } from "../api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function PinnedNotesPanel({
  userId,
  refreshKey,
  onEditNote,
  showHover,
  requestHideHover,
}) {
  const [notes, setNotes] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation("pinned");

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes(userId);
      setNotes((data || []).filter((n) => n.pinned));
    };
    fetchNotes();
  }, [userId, refreshKey]);

  const handleUnpin = async (id) => {
    await updateNotePin(id, false);
    toast.success(t("unpinnedSuccess"));
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };
  const handleDelete = async (id) => {
    await deleteNote(id);
    toast.success(t("deleteSuccess"));
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <aside className="rounded-xl p-3 border border-[#f3e8b3] dark:border-[#555] bg-[var(--sticky-paper)] dark:bg-[#202020]">
      <div
        className="flex justify-between items-center mb-3 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h4 className="text-sm font-semibold flex items-center gap-2 text-[#333] dark:text-[#f5f5dc]">
          <Pin size={16} className="text-[#d8b45c]" /> {t("header")}
        </h4>
        <span>{collapsed ? "▸" : "▾"}</span>
      </div>

      {!collapsed &&
        (notes.length === 0 ? (
          <p className="text-xs italic text-gray-600 dark:text-gray-300">
            {t("noPinned")}
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className="text-xs border-l-4 border-[#d8b45c] rounded-md p-2 bg-[#f8f6ef] dark:bg-[#262626] hover:bg-[#f7f3e8]"
                onMouseEnter={(e) => showHover({ ...n, from: "pinned" }, e.currentTarget)}
                onMouseLeave={requestHideHover}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium truncate">{n.title}</p>
                    <p className="text-[11px] text-gray-600">
                      {format(new Date(n.date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ))}
    </aside>
  );
}
