import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AuthLayout from "../layouts/AuthLayout";
import {
  UserPlus,
  Cloud,
  Lock,
  Bell,
  Shield,
  FileText,
  Star,
  LogIn,
} from "lucide-react";

export default function Register() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation("register");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ first, last, email });
      toast.success(t("successMessage"));
      navigate("/login");
    } catch (err) {
      setError(err.message || t("errorMessage"));
      toast.error(err.message || t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    toast.success(t("guestContinueMessage"));
    navigate("/dashboard");
  };

  return (
    <AuthLayout title={t("title")} subtitle={t("subtitle")} showHeader>
      {/* 🧩 Feature Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fadeIn">
        {/* Guest Column */}
        <div className="rounded-xl p-4 border border-yellow-100 dark:border-[#555] bg-[#fffdf7] dark:bg-[#222] shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-100">
            <UserPlus className="text-yellow-500" size={18} /> {t("guestTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              {t("guestFeature1")}
            </li>
            <li className="flex items-center gap-2">
              <Cloud size={16} className="text-gray-400" />
              {t("guestFeature2")}
            </li>
            <li className="flex items-center gap-2">
              <Bell size={16} className="text-gray-400" />
              {t("guestFeature3")}
            </li>
          </ul>
        </div>

        {/* Registered Column */}
        <div className="rounded-xl p-4 border border-yellow-200 dark:border-[#666] bg-[#fffbe8] dark:bg-[#2a2a2a] shadow-md">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Star className="text-yellow-600" size={18} /> {t("registeredTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <Cloud size={16} className="text-yellow-500" />
              {t("registeredFeature1")}
            </li>
            <li className="flex items-center gap-2">
              <Lock size={16} className="text-yellow-500" />
              {t("registeredFeature2")}
            </li>
            <li className="flex items-center gap-2">
              <Shield size={16} className="text-yellow-500" />
              {t("registeredFeature3")}
            </li>
            <li className="flex items-center gap-2">
              <Bell size={16} className="text-yellow-500" />
              {t("registeredFeature4")}
            </li>
          </ul>
        </div>
      </div>

      {/* 🧾 Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {t("firstName")}
          </label>
          <input
            type="text"
            placeholder={t("firstPlaceholder")}
            className="w-full p-3 rounded-lg border border-[#f0e8d8] dark:border-[#555] bg-[#fdfcf9] dark:bg-[#2a2a2a]
                       text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d8b45c]
                       transition-colors"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {t("lastName")}
          </label>
          <input
            type="text"
            placeholder={t("lastPlaceholder")}
            className="w-full p-3 rounded-lg border border-[#f0e8d8] dark:border-[#555] bg-[#fdfcf9] dark:bg-[#2a2a2a]
                       text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d8b45c]
                       transition-colors"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {t("email")}
          </label>
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full p-3 rounded-lg border border-[#f0e8d8] dark:border-[#555] bg-[#fdfcf9] dark:bg-[#2a2a2a]
                       text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d8b45c]
                       transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-[#d8b45c] hover:bg-[#b7933f] text-[#333] dark:text-[#111]
                     font-semibold border border-[#b7933f] shadow-sm hover:-translate-y-[1px]
                     transition-all disabled:opacity-70"
        >
          {loading ? t("loading") : t("register")}
        </button>
      </form>

      {/* 🟡 Continue as Guest */}
      <div className="mt-4 text-center">
        <button
          onClick={handleContinueAsGuest}
          className="w-full py-2 rounded-lg bg-[#faf8f0] dark:bg-[#222] hover:bg-[#f5f2e5] dark:hover:bg-[#333] 
                     text-gray-700 dark:text-gray-200 font-medium border border-[#e5d9a8] dark:border-[#555] shadow-sm 
                     hover:-translate-y-[1px] transition-all"
        >
          <LogIn size={16} className="inline mr-1 text-yellow-600" />
          {t("continueAsGuest")}
        </button>
      </div>

      <div className="text-center mt-6 space-y-2 text-sm">
        <p className="text-gray-600 dark:text-gray-300">
          {t("alreadyHaveAccount")}{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#b7933f] hover:underline font-medium cursor-pointer"
          >
            {t("login")}
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
