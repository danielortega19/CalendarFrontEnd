import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ImageUploader from "./ImageUploader";
import { toIsoLocalYmd } from "../utils/date";
import { isBefore, isToday, format } from "date-fns";

export default function NoteModal({
  day,
  note,
  isGlobalAdd,
  onClose,
  onSave,
  onDelete,
  user, // 👈 user prop (contains email if logged in)
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [priority, setPriority] = useState(note?.priority || "normal");
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [imageBase64, setImageBase64] = useState(note?.imageBase64 || null);
  const [imageType, setImageType] = useState(note?.imageType || null);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  // 🔔 Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(note?.reminder || false);
  const [reminderDate, setReminderDate] = useState(
    note?.reminderDate ? new Date(note.reminderDate).toISOString().slice(0, 16) : ""
  );
  const [reminderEmail, setReminderEmail] = useState(note?.reminderEmail || "");
  const [reminderError, setReminderError] = useState("");
  const [previewTime, setPreviewTime] = useState("");

  const { t } = useTranslation("modal");
  const now = new Date();
  const noteDate = note?.date ? new Date(note.date) : day ? new Date(day) : new Date();
  const isPastDate = isBefore(noteDate, now.setHours(0, 0, 0, 0));
  const isTodayDate = isToday(noteDate);

  // 🎬 fade animation
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to {opacity: 1; transform: translateY(0);} }
      .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // 🕓 default reminder (note’s day at 9 AM)
  useEffect(() => {
    if (!note?.reminderDate && !isPastDate) {
      const defaultDate = new Date(noteDate);
      defaultDate.setHours(9, 0, 0, 0);
      setReminderDate(defaultDate.toISOString().slice(0, 16));
    }
  }, [noteDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // 🗓️ Live preview of reminder
  useEffect(() => {
    if (reminderDate) {
      const formatted = format(new Date(reminderDate), "PPP, p");
      setPreviewTime(`${t("reminderSetFor")} ${formatted}`);
    } else setPreviewTime("");
  }, [reminderDate, t]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(t("titleRequired"));
      return;
    }
    setError("");

    let reminderDateValue = null;

    if (reminderEnabled && reminderDate) {
      reminderDateValue = new Date(reminderDate);
      if (isBefore(reminderDateValue, new Date())) {
        setReminderError(t("reminderInvalidFuture"));
        return;
      }
    }

    const reminderDateIso = reminderDateValue
      ? new Date(reminderDateValue).toISOString()
      : null;

    const newNote = {
      ...note,
      title,
      description,
      priority,
      pinned,
      reminder: reminderEnabled,
      reminderDate: reminderDateIso,
      reminderEmail: user?.email || reminderEmail.trim() || null,
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
        className={`relative w-full max-w-sm rounded-2xl border border-[#f0e8d8] 
          bg-[#fdfcf9] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.1)]
          dark:bg-[#2b2b2b] dark:border-[#444]
          transform transition-all duration-300 ease-in-out 
          ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        {/* ❌ Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold transition-all"
        >
          ✕
        </button>

        {/* Header */}
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          {note ? t("editNote") : t("addNote")}
          {formattedDay && (
            <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
              {formattedDay}
            </span>
          )}
        </h3>

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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("priority")}
            </label>
            <select
              value={priority}
              onChange={(e) => {
                const value = e.target.value;
                setPriority(value);
                if (value === "reminder") setReminderEnabled(true);
              }}
              className="w-full rounded-lg border border-[#f0e8d8] bg-[#fffdf4]
                         px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-[#d8b45c]
                         outline-none transition-all dark:bg-[#3a3a3a] dark:border-[#666]
                         dark:text-gray-100"
            >
              <option value="normal">{t("normal")}</option>
              <option value="important">{t("important")}</option>
              {!isPastDate && (
                <option value="reminder">{t("reminder")}</option>
              )}
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

          {/* 📌 Pin */}
          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="accent-[#d8b45c]"
            />
            <span>{t("pinNote")}</span>
          </label>

          {/* 🔔 Reminder Section */}
          {priority === "reminder" && !isPastDate && (
            <div className="border-t border-[#f0e8d8] dark:border-[#444] pt-3 mt-3 space-y-3 animate-fadeIn">
              {!reminderEnabled ? (
                <button
                  onClick={() => setReminderEnabled(true)}
                  className="w-full text-sm font-medium bg-[#fffdf4] text-[#333] border border-[#d8b45c]
                             rounded-lg py-2 hover:bg-[#f7f1de] transition-all dark:bg-[#3a3a3a] dark:text-gray-100"
                >
                  ⏰ {t("setReminder")}
                </button>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("reminderQuestion")}
                    </p>
                    <button
                      onClick={() => {
                        setReminderEnabled(false);
                        setReminderDate("");
                        setReminderError("");
                        setPreviewTime("");
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      {t("removeReminder")}
                    </button>
                  </div>

                  {/* Date + Time Picker */}
                  <div className="flex flex-col gap-2">
                    <input
                      type="datetime-local"
                      value={reminderDate}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => {
                        setReminderDate(e.target.value);
                        setReminderEnabled(true);
                        setReminderError("");
                      }}
                      className="w-full rounded-lg border border-[#f0e8d8] bg-[#fffdf4] 
                                 px-3 py-2 text-sm text-gray-800 placeholder-gray-400
                                 focus:ring-2 focus:ring-[#d8b45c] outline-none transition-all
                                 dark:bg-[#3a3a3a] dark:border-[#666] dark:text-gray-100
                                 hover:shadow-[0_0_5px_rgba(216,180,92,0.3)]"
                    />
                  </div>

                  {previewTime && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1">
                      {previewTime}
                    </p>
                  )}

                  {/* Email logic */}
                  {user?.email ? (
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1">
                      {t("reminderEmailDynamic", { email: user.email })}
                    </p>
                  ) : (
                    <>
                      <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1 mt-2">
                        {t("reminderEmail")}
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={reminderEmail}
                        onChange={(e) => setReminderEmail(e.target.value)}
                        className="w-full rounded-lg border border-[#f0e8d8] bg-[#fffdf4] px-3 py-2 text-sm
                                   focus:ring-2 focus:ring-[#d8b45c] outline-none dark:bg-[#3a3a3a]
                                   dark:border-[#666] dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1">
                        {t("reminderEmailProvided")}
                      </p>
                    </>
                  )}

                  {reminderError && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {reminderError}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

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
