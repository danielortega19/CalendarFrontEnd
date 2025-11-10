import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, UserPlus, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import {
  isAuthenticated,
  getCurrentUser,
  loginUser,
  migrateGuestNotes,
  getGuestNotes,
} from "../api";
import toast from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("header");

  const [userName, setUserName] = useState(t("guest"));
  const [loggedIn, setLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestCountBeforeLogin, setGuestCountBeforeLogin] = useState(0);
  const dropdownRef = useRef(null);

  const hideHeader = [
    "/login",
    "/register",
    "/reset-password",
    "/change-password",
  ].includes(location.pathname);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize auth + guest state
  useEffect(() => {
    const init = async () => {
      if (isAuthenticated()) {
        try {
          const user = await getCurrentUser();
          const firstName =
            user?.name?.first || user?.name || user?.email?.split("@")[0];
          setUserName(firstName || t("guest"));
          setLoggedIn(true);
        } catch {
          toast.error(t("sessionEnd"));
          localStorage.removeItem("token");
          setUserName(t("guest"));
          setLoggedIn(false);
        }
      } else {
        setUserName(t("guest"));
        setLoggedIn(false);
      }

      try {
        const guestNotes = await getGuestNotes();
        setGuestCountBeforeLogin(Array.isArray(guestNotes) ? guestNotes.length : 0);
        if (guestNotes?.length > 0) {
          localStorage.setItem("hasGuestNotes", "true");
        }
      } catch {
        // ignore
      }
    };
    init();
  }, [location, i18n.language, t]);

  if (hideHeader) return null;

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUserName(t("guest"));
    toast.success(t("loggedOut"));
    window.dispatchEvent(new Event("authChange"));
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ username: email, password });
      const user = result.user;
      const userId = user?.id;

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(user));

      const shouldPrompt =
        guestCountBeforeLogin > 0 || localStorage.getItem("hasGuestNotes") === "true";

      if (shouldPrompt && userId) {
        toast.custom(
          (tToast) => (
            <div
              className={`bg-white dark:bg-[#1f1f1f] p-4 rounded-lg border border-yellow-400 shadow-lg max-w-sm mx-auto transform transition-all duration-300 ${
                tToast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              <p className="font-semibold text-gray-800 dark:text-yellow-100 mb-2">
                💡 {t("migratePromptTitle")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {t("migratePromptBody")}
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    toast.dismiss(tToast.id);
                    toast(t("migrateSkip"));
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {t("skip")}
                </button>
                <button
                  onClick={async () => {
                    try {
                      await migrateGuestNotes(userId);
                      toast.success(t("migrateSuccess"));
                      localStorage.removeItem("hasGuestNotes");
                      localStorage.setItem("guestMigrated", "true");
                      window.dispatchEvent(new Event("authChange"));
                    } catch {
                      toast.error(t("migrateError"));
                    } finally {
                      toast.dismiss(tToast.id);
                    }
                  }}
                  className="px-3 py-1 text-sm bg-yellow-300 hover:bg-yellow-400 rounded font-medium transition-transform hover:scale-105"
                >
                  {t("yesMigrate")}
                </button>
              </div>
            </div>
          ),
          { duration: 12000 }
        );
      }

      const firstName =
        user?.name?.first || user?.name || user?.email?.split("@")[0];
      setUserName(firstName || t("guest"));
      setLoggedIn(true);
      setShowDropdown(false);
      toast.success(t("welcomeBack"));
      window.dispatchEvent(new Event("authChange"));
    } catch {
      toast.error(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    setShowDropdown(false);
    navigate("/register");
  };

  const handleForgotPassword = () => {
    setShowDropdown(false);
    navigate("/reset-password");
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 bg-[var(--sticky-paper)] dark:bg-[#1e1e1e] border-b border-yellow-400 shadow-sm">
      <h1 className="text-xl font-bold tracking-wide text-gray-800 dark:text-yellow-200">
        🗒️ {t("tittle")}
      </h1>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("welcome")},{" "}
          <span className="font-semibold text-[#d8b45c] dark:text-yellow-300">
            {userName}
          </span>
        </span>

        <ThemeToggle />
        <LanguageSwitcher />

        {loggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-full bg-[var(--sticky-paper)] border border-yellow-400 shadow-md hover:scale-105 transition-transform"
              title={t("profile")}
            >
              <User size={18} className="text-yellow-600 dark:text-yellow-300" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-[var(--sticky-paper)] border border-yellow-400 shadow-md hover:scale-105 transition-transform"
              title={t("logout")}
            >
              <LogOut className="text-red-600" size={18} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-yellow-300 hover:bg-yellow-400 text-gray-900 border border-yellow-500 rounded-md shadow-sm transition-all"
            >
              <UserPlus size={16} /> {t("guestBannerButton")}
            </button>

            {/* Dropdown login box */}
            <div
              className={`absolute right-0 mt-2 w-64 bg-[var(--sticky-paper)] dark:bg-[#1f1f1f] border border-yellow-400 rounded-lg shadow-lg p-4 z-50 transform transition-all duration-300 ease-out ${
                showDropdown
                  ? "opacity-100 translate-y-0 scale-100 visible"
                  : "opacity-0 -translate-y-2 scale-95 invisible"
              }`}
            >
              <h3 className="text-sm font-semibold text-gray-700 dark:text-yellow-200 mb-2">
                {t("loginTitle")}
              </h3>

              <form onSubmit={handleLogin} className="space-y-2">
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded border text-sm border-[#f0e8d8] bg-[#fdfcf9] dark:bg-[#2b2b2b] dark:text-gray-100"
                  required
                />
                <input
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded border text-sm border-[#f0e8d8] bg-[#fdfcf9] dark:bg-[#2b2b2b] dark:text-gray-100"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#d8b45c] hover:bg-[#b7933f] text-[#333] py-1 rounded-md font-medium transition-all"
                >
                  {loading ? t("loading") : t("login")}
                </button>
              </form>

              {/* 🔗 Forgot password link */}
              <div className="text-xs text-center mt-2">
                <span
                  onClick={handleForgotPassword}
                  className="text-[#b7933f] hover:text-[#d8b45c] dark:text-yellow-400 dark:hover:text-yellow-300 cursor-pointer transition-colors"
                >
                  {t("forgotPassword")}
                </span>
              </div>

              <div className="text-xs text-center mt-3 text-gray-600 dark:text-gray-300">
                {t("noAccount")}{" "}
                <span
                  onClick={handleRegister}
                  className="text-[#b7933f] hover:underline cursor-pointer"
                >
                  {t("register")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
