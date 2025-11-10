import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../api"; // or your existing reset function
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("forgotPassword");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success(t("emailSent"));
      navigate("/login");
    } catch (err) {
      toast.error(err.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("title")} subtitle={t("subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full p-3 rounded-lg border border-[#f0e8d8] bg-[#fdfcf9]
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d8b45c]
                       transition-colors"
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
