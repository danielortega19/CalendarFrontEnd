import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ username, password });
      if (data.requiresPasswordReset) {
        localStorage.setItem("resetEmail", username);
        toast(t("mustChangePassword"), { icon: "⚠️" });
        navigate("/change-password");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", username);
      toast.success(t("loginSuccess"));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("welcome")} subtitle={t("loginSubtitle")}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-lg p-3 bg-warmwhite-50 border border-warmwhite-300 
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-400 
                       transition-colors"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("passwordLabel")}
          </label>
          <input
            type="password"
            placeholder={t("passwordPlaceholder")}
            className="w-full rounded-lg p-3 bg-warmwhite-50 border border-warmwhite-300 
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-400 
                       transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-accent-400 hover:bg-accent-500 text-[#333] 
                     font-semibold border border-accent-500 shadow-sm hover:-translate-y-[1px] 
                     transition-all disabled:opacity-70"
        >
          {loading ? t("loggingIn") : t("login")}
        </button>
      </form>

      {/* Links */}
      <div className="text-center mt-6 space-y-2 text-sm">
        <button
          onClick={() => navigate("/reset-password")}
          className="text-accent-500 hover:underline font-medium"
        >
          {t("forgotPassword")}
        </button>
        <p className="text-gray-700">
          {t("noAccount")}{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-accent-500 hover:underline font-medium cursor-pointer"
          >
            {t("register")}
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
