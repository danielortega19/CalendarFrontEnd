import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("resetPassword");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success(t("emailSent"));
      navigate("/");
    } catch (err) {
      toast.error(err.message || t("resetFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[var(--sticky-paper)] dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <div className="w-full max-w-md bg-white dark:bg-[#181818] rounded-2xl border border-yellow-400 shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#d8b45c] dark:text-yellow-300">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="w-full p-3 rounded-lg border border-[#f0e8d8] dark:border-[#444] bg-[#fdfcf9] dark:bg-[#2b2b2b] text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#d8b45c] outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[#d8b45c] hover:bg-[#b7933f] text-[#333]
                       font-semibold border border-[#b7933f] shadow-sm hover:-translate-y-[1px]
                       transition-all disabled:opacity-70"
          >
            {loading ? t("loading") : t("sendLink")}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2 text-sm">
          <p>
            {t("remembered")}{" "}
            <span
              onClick={() => navigate("/")}
              className="text-[#b7933f] dark:text-yellow-400 hover:underline font-medium cursor-pointer"
            >
              {t("login")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
