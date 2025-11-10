import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploader from "./ImageUploader";
import { toIsoLocalYmd } from "../utils/date";

export default function NoteModal({
  day,
  note,
  isGlobalAdd,
  onClose,
  onSave,
  onDelete,
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [priority, setPriority] = useState(note?.priority || "normal");
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [imageBase64, setImageBase64] = useState(note?.imageBase64 || null);
  const [imageType, setImageType] = useState(note?.imageType || null);
  const [error, setError] = useState(""); // ⚠️ Error message for title
  const [closing, setClosing] = useState(false);

  const { t } = useTranslation("modal");

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(t("titleRequired") || "Title is required");
      return;
    }
    setError(""); // clear any old error

    const noteDate = note?.date || day || new Date();
    const newNote = {
      ...note,
      title,
      description,
      priority,
      pinned,
      imageBase64,
      imageType,
      date: toIsoLocalYmd(noteDate),
    };

    onSave(newNote);
  };

  const handleDelete = async () => {
    if (!note?.id) return;
    try {
      await onDelete(note.id);
      onClose();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose?.(), 250);
  };

  const formattedDay = day ? toIsoLocalYmd(day) : null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 
      bg-black/40 transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`
          relative w-full max-w-sm rounded-2xl border border-[#f0e8d8] 
          bg-[#fdfcf9] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.1)]
          dark:bg-[#2b2b2b] dark:border-[#444]
          transform transition-all duration-300 ease-in-out 
          ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
      >
        {/* ❌ Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold transition-all"
        >
          ✕
        </button>

        {/* 📝 Title */}
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          {note ? t("editNote") : t("addNote")}
          {formattedDay && (
            <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
              {formattedDay}
            </span>
          )}
        </h3>

        {/* ✏️ Form */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder={t("title")}
              className={`w-full rounded-lg border px-3 py-2 text-sm 
                ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : "border-[#f0e8d8] focus:ring-[#d8b45c]"
                }
                bg-[#fdfcf9] text-gray-800 placeholder-gray-400 
                focus:ring-2 outline-none transition-all
                dark:bg-[#2b2b2b] dark:border-[#555] dark:text-gray-100`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
            )}
          </div>

          {/* Description */}
          <textarea
            placeholder={t("description")}
            className="w-full h-24 rounded-lg border border-[#f0e8d8] bg-[#fdfcf9]
                       px-3 py-2 text-sm resize-none text-gray-800 placeholder-gray-400
                       focus:ring-2 focus:ring-[#d8b45c] outline-none transition-all
                       dark:bg-[#2b2b2b] dark:border-[#555] dark:text-gray-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              {t("priority")}
            </label>
            <select
              className="border border-[#f0e8d8] rounded-lg px-2 py-1 text-sm 
                         bg-[#fffdf4] text-gray-800 focus:ring-2 focus:ring-[#d8b45c] outline-none
                         dark:bg-[#3a3a3a] dark:border-[#666] dark:text-gray-100"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="normal">{t("normal")}</option>
              <option value="important">{t("important")}</option>
              <option value="reminder">{t("reminder")}</option>
            </select>
          </div>

          {/* Image */}
          <ImageUploader
            noteId={note?.id}
            imageBase64={imageBase64}
            imageType={imageType}
            onChange={(base64, type) => {
              setImageBase64(base64);
              setImageType(type);
            }}
          />

          {/* Pin */}
          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="accent-[#d8b45c]"
            />
            <span>{t("pinNote")}</span>
          </label>

          {/* Buttons */}
          <div className="flex justify-between mt-4 gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#d8b45c] hover:bg-[#b7933f] text-[#333]
                         font-semibold rounded-lg py-2 shadow-sm transition-all
                         border border-[#b7933f]"
            >
              {note ? t("update") : t("add")}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-[#f8f6ef] hover:bg-[#f0eadf] text-gray-700
                         font-semibold rounded-lg py-2 border border-[#f0e8d8]
                         shadow-sm transition-all"
            >
              {t("cancel")}
            </button>
          </div>

          {note && (
            <button
              onClick={handleDelete}
              className="w-full mt-3 text-sm text-red-600 hover:underline"
            >
              {t("deleteNote")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
