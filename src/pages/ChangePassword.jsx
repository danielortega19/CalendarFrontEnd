import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { verifyResetToken, completePasswordReset } from "../api";
import AuthLayout from "../layouts/AuthLayout";

export default function ChangePassword() {
  const { t } = useTranslation("changePassword");
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 URL query params
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const token = params.get("token");

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  // ✅ Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      if (!email || !token) {
        toast.error(t("missingParams") || "Invalid link.");
        navigate("/");
        return;
      }

      try {
        await verifyResetToken({ email, token });
        setVerified(true);
      } catch (err) {
        toast.error(t("invalidOrExpired") || "Invalid or expired link.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [email, token, navigate, t]);

  // 🔒 Submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error(t("passwordRequired") || "Please enter your new password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("passwordMismatch") || "Passwords do not match.");
      return;
    }

    setChanging(true);
    try {
      await completePasswordReset({ email, newPassword: password });
      toast.success(t("resetSuccess") || "Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || t("resetError") || "Something went wrong.");
    } finally {
      setChanging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200 text-lg font-medium">
        {t("verifying") || "Verifying your request..."}
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200 text-lg font-medium">
        {t("invalidOrExpired") || "Invalid or expired reset link."}
      </div>
    );
  }

  return (
    <AuthLayout
      title={t("title") || "Set New Password"}
      subtitle={t("subtitle") || "Enter your new password below."}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("newPassword") || "New Password"}
          </label>
          <input
            type="password"
            placeholder={t("newPasswordPlaceholder") || "Enter new password"}
            className="w-full p-3 rounded-lg border border-[#f0e8d8] bg-[#fdfcf9]
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d8b45c]
                       dark:bg-[#2b2b2b] dark:text-gray-100 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("confirmPassword") || "Confirm Password"}
          </label>
          <input
            type="password"
            placeholder={t("confirmPasswordPlaceholder") || "Confirm new password"}
            className="w-full p-3 rounded-lg border border-[#f0e8d8] bg-[#fdfcf9]
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d8b45c]
                       dark:bg-[#2b2b2b] dark:text-gray-100 transition-colors"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={changing}
          className="w-full py-2 rounded-lg bg-[#d8b45c] hover:bg-[#b7933f] text-[#333]
                     font-semibold border border-[#b7933f] shadow-sm hover:-translate-y-[1px]
                     transition-all disabled:opacity-70"
        >
          {changing ? t("updating") || "Updating..." : t("updatePassword") || "Update Password"}
        </button>
      </form>

      <div className="text-center mt-6 text-sm">
        <button
          onClick={() => navigate("/")}
          className="text-[#b7933f] hover:underline font-medium"
        >
          ← {t("backHome") || "Back to Home"}
        </button>
      </div>
    </AuthLayout>
  );
}
