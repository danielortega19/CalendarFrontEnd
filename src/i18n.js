import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 🌍 English locales (by component)
import enDashboard from "./locales/en/dashboard.json";
import enSidebar from "./locales/en/sidebar.json";
import enModal from "./locales/en/modal.json";
import enCommon from "./locales/en/common.json";
import enLogin from "./locales/en/login.json";
import enResetPassword from "./locales/en/resetPassword.json";
import enRegister from "./locales/en/register.json";
import enPinned from "./locales/en/pinned.json";
import enUploader from "./locales/en/uploader.json"; 
import enHeader from "./locales/en/header.json";
import enFooter from "./locales/en/footer.json";
import enProfile from "./locales/en/profile.json";
import enErrorHandler from "./locales/en/errorHandler.json";
import enContact from "./locales/en/contact.json"
import enNoteRegister from "./locales/en/noteRegister.json"
import enChangePassword from "./locales/en/changePassword.json"

// 🌎 Spanish locales (by component)
import esDashboard from "./locales/es/dashboard.json";
import esSidebar from "./locales/es/sidebar.json";
import esModal from "./locales/es/modal.json";
import esCommon from "./locales/es/common.json";
import esLogin from "./locales/es/login.json";
import esResetPassword from "./locales/es/resetPassword.json";
import esRegister from "./locales/es/register.json";
import esPinned from "./locales/es/pinned.json";
import esUploader from "./locales/es/uploader.json";
import esHeader from "./locales/es/header.json";
import esFooter from "./locales/es/footer.json";
import esProfile from "./locales/es/profile.json";
import esErrorHandler from "./locales/es/errorHandler.json";
import esContact from "./locales/es/contact.json"
import esNoteRegister from "./locales/es/noteRegister.json"
import esChangePassword from "./locales/es/changePassword.json"

// ⚙️ Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      dashboard: enDashboard,
      sidebar: enSidebar,
      modal: enModal,
      common: enCommon,
      login: enLogin,
      resetPassword: enResetPassword,
      register: enRegister,
      pinned: enPinned,
      uploader: enUploader,
      header : enHeader,
      footer: enFooter,
      profile: enProfile,
      errorHandler: enErrorHandler,
      contact: enContact,
      noteRegister: enNoteRegister,
      changePassword: enChangePassword
    },
    es: {
      dashboard: esDashboard,
      sidebar: esSidebar,
      modal: esModal,
      common: esCommon,
      login: esLogin,
      resetPassword: esResetPassword,
      register: esRegister,
      pinned: esPinned,
      uploader: esUploader,
      header: esHeader,
      footer: esFooter,
      profile: esProfile,
      errorHandler: esErrorHandler,
      contact: esContact,
      noteRegister: esNoteRegister,
      changePassword: esChangePassword
    },
  },
  lng: localStorage.getItem("lang") || "en", // 🌐 Default language
  fallbackLng: "en",
  ns: [
    "common",
    "dashboard",
    "sidebar",
    "modal",
    "login",
    "resetPassword",
    "register",
    "pinned",
    "uploader",
    "header",
  ],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

// 💾 Persist language choice
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

export default i18n;
