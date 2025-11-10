import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  updateUser,
  changePassword,
} from "../api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔒 Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  // 🧭 Load current user info
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
        setFirst(data.name?.first || "");
        setLast(data.name?.last || "");
        setEmail(data.email || "");
      } catch {
        toast.error(t("loadError"));
        navigate("/");
      }
    };
    loadUser();
  }, [t, navigate]);

  // 🧩 Validation
  const validateProfile = () => {
    const newErrors = {};
    if (!first.trim()) newErrors.first = t("firstRequired");
    if (!last.trim()) newErrors.last = t("lastRequired");
    if (!email.trim()) newErrors.email = t("emailRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!oldPassword.trim()) newErrors.oldPassword = t("oldPasswordRequired");
    if (!newPassword.trim()) newErrors.newPassword = t("newPasswordRequired");
    if (!confirmPassword.trim())
      newErrors.confirmPassword = t("confirmPasswordRequired");
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = t("passwordMismatch");
    setPwErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 💾 Save Profile
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateProfile()) {
      toast.error(t("fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      await updateUser({ name: { first, last }, email });
      toast.success(t("updateSuccess"));
      window.dispatchEvent(new Event("authChange"));
    } catch (err) {
      toast.error(err.message || t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      toast.error(t("fillAllFields"));
      return;
    }

    setChanging(true);
    try {
      await changePassword({ email, newPassword, oldPassword });
      toast.success(t("passwordUpdated"));
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwErrors({});
    } catch (err) {
      toast.error(err.message || t("passwordError"));
    } finally {
      setChanging(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200 text-lg font-medium">
        {t("loading")}
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[var(--sticky-paper)] dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 transition-colors duration-500">
      {/* 🧩 Two Cards Side-by-Side */}
      <div className="flex flex-col md:flex-row gap-10 justify-center items-start w-full max-w-5xl mb-8">
        {/* ✏️ Update Profile */}
        <div className="flex-1 bg-white dark:bg-[#181818] rounded-2xl border border-yellow-400 shadow-md p-8 space-y-6 transition-all hover:-translate-y-[2px]">
          <h1 className="text-2xl font-bold text-center text-[#d8b45c] dark:text-yellow-300">
            {t("title")}
          </h1>

          <form onSubmit={handleSave} className="space-y-5">
            {[
              { label: t("firstName"), value: first, onChange: setFirst, error: errors.first },
              { label: t("lastName"), value: last, onChange: setLast, error: errors.last },
              { label: t("email"), value: email, onChange: setEmail, error: errors.email },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input
                  type={field.label === t("email") ? "email" : "text"}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    field.error ? "border-red-400" : "border-[#f0e8d8]"
                  } bg-[#fdfcf9] dark:bg-[#2b2b2b] dark:text-gray-100 focus:ring-2 focus:ring-[#d8b45c] transition-all`}
                />
                {field.error && <p className="text-red-500 text-xs mt-1">{field.error}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-4 rounded-lg bg-[#f8e47e] hover:bg-[#f6d84f] text-[#333] font-semibold border border-[#e6c95f] shadow-sm hover:-translate-y-[1px] transition-all disabled:opacity-70"
            >
              {loading ? t("saving") : t("saveChanges")}
            </button>
          </form>
        </div>

        {/* 🔒 Change Password */}
        <div className="flex-1 bg-white dark:bg-[#181818] rounded-2xl border border-yellow-400 shadow-md p-8 space-y-6 transition-all hover:-translate-y-[2px]">
          <h2 className="text-2xl font-bold text-center text-[#d8b45c] dark:text-yellow-300">
            {t("changePassword")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            {t("changePasswordHint")}
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {[
              { label: t("oldPassword"), value: oldPassword, onChange: setOldPassword, error: pwErrors.oldPassword },
              { label: t("newPassword"), value: newPassword, onChange: setNewPassword, error: pwErrors.newPassword },
              { label: t("confirmPassword"), value: confirmPassword, onChange: setConfirmPassword, error: pwErrors.confirmPassword },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input
                  type="password"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    field.error ? "border-red-400" : "border-[#f0e8d8]"
                  } bg-[#fdfcf9] dark:bg-[#2b2b2b] dark:text-gray-100 focus:ring-2 focus:ring-[#d8b45c] transition-all`}
                />
                {field.error && <p className="text-red-500 text-xs mt-1">{field.error}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={changing}
              className="w-full py-2 rounded-lg bg-[#f8e47e] hover:bg-[#f6d84f] text-[#333] font-semibold border border-[#e6c95f] shadow-sm hover:-translate-y-[1px] transition-all disabled:opacity-70"
            >
              {changing ? t("changing") : t("updatePassword")}
            </button>
          </form>
        </div>
      </div>

      {/* 🏠 Back to Home */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 text-sm font-medium rounded-lg bg-[#d8b45c] hover:bg-[#b7933f] text-[#333] border border-[#b7933f] shadow-sm transition-all"
      >
        ← {t("backToHome") || "Back to Home"}
      </button>
    </div>
  );
}
