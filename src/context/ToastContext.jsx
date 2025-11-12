import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";
import CriticalToast from "../components/CriticalToast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [critical, setCritical] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast) => {
      const id = Date.now();

      // avoid duplicates
      setToasts((prev) => {
        if (prev.some((t) => t.message === toast.message && t.type === toast.type)) return prev;
        return [...prev, { id, ...toast }];
      });

      if (!toast.persistent) {
        setTimeout(() => removeToast(id), toast.duration || 5000);
      }
    },
    [removeToast]
  );

  const showCriticalError = useCallback((title, message) => {
    setCritical({ title, message });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showSuccess: (message) => addToast({ type: "success", message, duration: 4000 }),
        showError: (message, code) => addToast({ type: "error", message, code, duration: 10000 }),
        showWarning: (message, code) => addToast({ type: "warning", message, code, duration: 6000 }),
        showInfo: (message) => addToast({ type: "info", message, duration: 5000 }),
        showCriticalError,
      }}
    >
      {children}

      {/* 🔴 Critical system banner */}
      <CriticalToast
        critical={critical}
        onClose={() => setCritical(null)}
      />

      {/* Standard corner toasts */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-[340px]">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
