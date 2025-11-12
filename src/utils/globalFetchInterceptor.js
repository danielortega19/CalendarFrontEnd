import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";

/**
 * 🌍 Global Fetch Interceptor
 * Hooks into window.fetch to handle API errors automatically.
 */
export default function useGlobalFetchInterceptor() {
  const { t } = useTranslation("errorHandler");
  const {
    showError,
    showWarning,
    showInfo,
    showSuccess,
    showCriticalError, // 🔴 NEW
  } = useToast();

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
          title: errorBody.title,
          hint: errorBody.hint,
        };

        handleGlobalApiError(errorData, {
          t,
          showError,
          showWarning,
          showInfo,
          showSuccess,
          showCriticalError,
        });
        throw errorData;
      } catch (err) {
        if (err.name === "TypeError") {
          handleGlobalApiError(
            { errorCode: "NETWORK_ERROR", error: t("NETWORK_ERROR"), statusCode: 0 },
            { t, showError, showWarning, showInfo, showCriticalError }
          );
        }
        throw err;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [t, showError, showWarning, showInfo, showSuccess, showCriticalError]);
}

/**
 * 🧠 Handles mapped API error codes → user feedback
 */
function handleGlobalApiError(errorData, { t, showError, showWarning, showInfo, showSuccess, showCriticalError }) {
  const { errorCode, error, statusCode, hint } = errorData || {};
  const msg = error || t("UNKNOWN");

  switch (errorCode) {
    // 🔐 AUTH
    case "UNAUTHORIZED":
    case "AUTH_UNAUTHORIZED":
    case "HTTP_401":
      showWarning(t("UNAUTHORIZED"));
      localStorage.clear();
      setTimeout(() => (window.location.href = "/login"), 1500);
      break;
    case "AUTH_INVALID_CREDENTIALS":
    case "USER_INVALID_CREDENTIALS":
      showError(t("INVALID_CREDENTIALS"));
      break;
    case "AUTH_PASSWORD_RESET_REQUIRED":
      showWarning(t("PASSWORD_RESET_REQUIRED"));
      break;
    case "TOKEN_EXPIRED":
      showWarning(t("TOKEN_EXPIRED"));
      localStorage.clear();
      window.location.href = "/login";
      break;

    // 🧱 DATABASE
    case "DB_CONNECTION_ERROR":
    case "DB_QUERY_ERROR":
    case "DB_INSERT_ERROR":
    case "DB_UPDATE_ERROR":
    case "DB_DELETE_ERROR":
      showCriticalError(t("CRITICAL_ERROR"), t("DB_FAIL"));
      showError(t("DB_FAIL"), errorCode);
      break;

    // 📧 EMAIL
    case "SMTP_CONFIG_MISSING":
      showError(t("SMTP_CONFIG_MISSING"));
      break;
    case "EMAIL_RECIPIENT_INVALID":
    case "EMAIL_SUBJECT_INVALID":
    case "EMAIL_BODY_INVALID":
      showWarning(t("EMAIL_FORMAT_INVALID"));
      break;
    case "SMTP_RETRY_FAILED":
    case "EMAIL_UNEXPECTED_ERROR":
    case "EMAIL_WELCOME_FAILED":
    case "EMAIL_RESET_FAILED":
    case "EMAIL_CONTACT_FAILED":
    case "EMAIL_CONTACT_ACK_FAILED":
    case "EMAIL_REMINDER_FAILED":
      showError(t("EMAIL_FAILED"));
      break;

    // 🗒️ NOTES
    case "DUPLICATE_NOTE":
      showWarning(t("DUPLICATE_NOTE"));
      break;
    case "IMAGE_TOO_LARGE":
      showWarning(t("IMAGE_TOO_LARGE"));
      break;
    case "NOTE_NOT_FOUND":
      showWarning(t("NOTE_NOT_FOUND"));
      break;
    case "NOTE_UPDATE_NO_MATCH":
    case "NOTE_DELETE_NO_MATCH":
      showWarning(t("NOTE_UPDATE_FAILED"));
      break;
    case "UPLOAD_NO_FILE":
      showWarning(t("UPLOAD_NO_FILE"));
      break;
    case "REMINDER_NOT_ENABLED":
      showInfo(t("REMINDER_NOT_ENABLED"));
      break;

    // 👤 USER
    case "USER_ALREADY_EXISTS":
      showWarning(t("USER_ALREADY_EXISTS"));
      break;
    case "USER_NOT_FOUND":
      showWarning(t("USER_NOT_FOUND"));
      break;
    case "USER_UPDATE_FAILED":
      showError(t("USER_UPDATE_FAILED"));
      break;
    case "USER_DELETION_FAILED":
      showError(t("USER_DELETION_FAILED"));
      break;

    // 🔑 TOKEN
    case "TOKEN_CREATION_FAILED":
    case "TOKEN_VALIDATION_FAILED":
    case "TOKEN_INVALIDATION_FAILED":
      showError(t("TOKEN_ERROR"));
      break;

    // 🧮 COMMON
    case "INVALID_ARGUMENT":
    case "INVALID_OPERATION":
    case "HTTP_400":
      showWarning(t("INVALID_ARGUMENT"));
      break;
    case "CONFLICT":
    case "HTTP_409":
      showWarning(t("CONFLICT"));
      break;
    case "TIMEOUT":
      showWarning(t("TIMEOUT"));
      break;
    case "NOT_FOUND":
    case "HTTP_404":
      showWarning(t("NOT_FOUND"));
      break;
    case "FORBIDDEN":
    case "HTTP_403":
      showWarning(t("FORBIDDEN"));
      break;
    case "RATE_LIMITED":
      showWarning(t("RATE_LIMITED"));
      break;
    case "NETWORK_ERROR":
      showWarning(t("NETWORK_ERROR"));
      break;

    // ✅ SUCCESS
    case "OPERATION_SUCCESS":
      showSuccess(t("SUCCESS_OPERATION"));
      break;

    // ❌ DEFAULT
    default:
      if (statusCode >= 500)
        showCriticalError(t("CRITICAL_ERROR"), msg);
      else
        showError(`${msg}${hint ? ` (${hint})` : ""}`, errorCode || "SERVER_ERROR");
      break;
  }

  console.error("🌐 API Error:", { errorCode, error, statusCode });
}
