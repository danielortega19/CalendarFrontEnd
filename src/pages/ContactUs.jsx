import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendContactMessage } from "../api";
import { Filter } from "bad-words";
import { useTheme } from "../hooks/useTheme";
import { Mail, User, Type, MessageSquare, SendHorizonal } from "lucide-react";

export default function ContactUs() {
  const { t } = useTranslation("contact");
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const filter = useRef(new Filter());

  // 🧩 Add some custom banned words if needed
  filter.current.addWords("stupidhead", "dummyword");

  // ✅ Handle change with profanity feedback
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If profanity detected, mark error but allow correction
    if (filter.current.isProfane(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: t("errorProfanityDetected"),
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validate before submitting
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) newErrors.name = t("errorNameRequired");
    if (!form.email.trim()) newErrors.email = t("errorEmailRequired");
    else if (!emailRegex.test(form.email)) newErrors.email = t("errorEmailInvalid");
    if (!form.subject.trim()) newErrors.subject = t("errorSubjectRequired");
    if (!form.message.trim()) newErrors.message = t("errorMessageRequired");

    if (Object.values(form).some((val) => filter.current.isProfane(val))) {
      newErrors.message = t("errorProfanityDetected");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✉️ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(t("validationError"));
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage(form);
      toast.success(t("successMessage"));
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      toast.error(err.message || t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-10 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#1e1e1e] text-gray-100"
          : "bg-[var(--sticky-paper)] text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-md p-6 space-y-6 transition-all ${
          theme === "dark"
            ? "bg-[#181818] border-[#6b5c2a]"
            : "bg-[#fffdf7] border-yellow-100"
        }`}
      >
        {/* 🏷️ Title */}
        <h1 className="text-2xl font-bold text-center text-[#d8b45c]">
          {t("title")}
        </h1>
        <p
          className={`text-sm text-center mb-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("subtitle")}
        </p>

        {/* 🧩 Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("name")}
            </label>
            <div className="relative">
              <User
                size={16}
                className={`absolute left-3 top-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("namePlaceholder")}
                className={`w-full p-3 pl-9 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d8b45c] ${
                  errors.name ? "border-red-400" : "border-[#f0e8d8]"
                } ${theme === "dark" ? "text-gray-100 border-[#444]" : "text-gray-800"}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("email")}
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("emailPlaceholder")}
                className={`w-full p-3 pl-9 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d8b45c] ${
                  errors.email ? "border-red-400" : "border-[#f0e8d8]"
                } ${theme === "dark" ? "text-gray-100 border-[#444]" : "text-gray-800"}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("subject")}
            </label>
            <div className="relative">
              <Type
                size={16}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder={t("subjectPlaceholder")}
                className={`w-full p-3 pl-9 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d8b45c] ${
                  errors.subject ? "border-red-400" : "border-[#f0e8d8]"
                } ${theme === "dark" ? "text-gray-100 border-[#444]" : "text-gray-800"}`}
              />
            </div>
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("message")}
            </label>
            <div className="relative">
              <MessageSquare
                size={16}
                className="absolute left-3 top-3 text-gray-400 pointer-events-none"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t("messagePlaceholder")}
                rows="5"
                className={`w-full p-3 pl-9 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[#d8b45c] ${
                  errors.message ? "border-red-400" : "border-[#f0e8d8]"
                } ${theme === "dark" ? "text-gray-100 border-[#444]" : "text-gray-800"}`}
              />
            </div>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[#d8b45c] hover:bg-[#b7933f] text-[#333] font-semibold border border-[#b7933f] shadow-sm hover:-translate-y-[1px] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <SendHorizonal size={18} />
            {loading ? t("sending") : t("sendMessage")}
          </button>

          <p
            onClick={() => navigate("/")}
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 hover:underline cursor-pointer"
          >
            {t("backHome")}
          </p>
        </form>
      </div>
    </div>
  );
}
