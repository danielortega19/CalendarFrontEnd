// src/hooks/useGlobalFetchInterceptor.js
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

function showCriticalErrorModal(title, message, closeText) {
  if (document.getElementById("critical-error-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "critical-error-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    maxWidth: "420px",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  });

  modal.innerHTML = `
    <h2 style="color:#b91c1c; font-weight:700; font-size:20px; margin-bottom:12px;">
      ⚠️ ${title}
    </h2>
    <p style="color:#444; font-size:15px; line-height:1.4;">${message}</p>
    <button id="close-critical-error" style="
      margin-top:18px;
      background:#dc2626;
      color:#fff;
      border:none;
      padding:8px 16px;
      border-radius:6px;
      cursor:pointer;
      font-weight:600;
    ">${closeText}</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document
    .getElementById("close-critical-error")
    .addEventListener("click", () => overlay.remove());
}

export default function useGlobalFetchInterceptor() {
  const { t } = useTranslation("errorHandler");

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (response.ok) return response;

        let errorBody;
        try {
          const text = await response.text();
          errorBody = text ? JSON.parse(text) : {};
        } catch {
          errorBody = { error: "Invalid server response", statusCode: response.status };
        }

        const errorData = {
          errorCode: errorBody.errorCode || `HTTP_${response.status}`,
          error: errorBody.error || errorBody.message,
          statusCode: response.status,
        };

        handleGlobalApiError(errorData, t);
        throw errorData;
      } catch (err) {
        if (err.name === "TypeError") {
          handleGlobalApiError(
            {
              errorCode: "NETWORK_ERROR",
              error: t("NETWORK_ERROR"),
              statusCode: 0,
            },
            t
          );
        }
        throw err;
      }
    };

    return () => {
      window.fetch = originalFetch; // cleanup on unmount
    };
  }, [t]);
}

function handleGlobalApiError(errorData, t) {
  const { errorCode, error, statusCode } = errorData || {};
  const msg = error || t("UNKNOWN");

  switch (errorCode) {
    case "UNAUTHORIZED":
    case "HTTP_401":
      toast.error(t("UNAUTHORIZED"), { className: "toast-error", icon: "🔒" });
      localStorage.clear();
      setTimeout(() => (window.location.href = "/login"), 1500);
      break;

    case "DB_CONNECTION_ERROR":
    case "HTTP_500":
      showCriticalErrorModal(t("CRITICAL_ERROR"), t("DB_FAIL"), t("CLOSE"));
      toast.error(t("DB_FAIL"), { className: "toast-error", icon: "💥" });
      break;

    case "NETWORK_ERROR":
      toast.error(t("NETWORK_ERROR"), { className: "toast-error", icon: "🌐" });
      break;

    case "INVALID_ARGUMENT":
    case "HTTP_400":
      toast.error(t("INVALID_ARGUMENT"), { className: "toast-warning", icon: "⚠️" });
      break;

    case "DUPLICATE_NOTE":
      toast.error(t("DUPLICATE_NOTE"), { className: "toast-error shake", icon: "🚫" });
      break;

    case "TIMEOUT":
      toast.error(t("TIMEOUT"), { className: "toast-error", icon: "⏱️" });
      break;

    default:
      toast.error(msg, { className: "toast-error", icon: "❌" });
      break;
  }

  console.error("🌐 API Error:", { errorCode, error, statusCode });
}
