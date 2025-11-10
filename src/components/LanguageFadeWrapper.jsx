import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This wrapper ensures the dashboard always renders
 * and adds a smooth cross-fade when language changes.
 */
export default function LanguageFadeWrapper({ children }) {
  const { i18n } = useTranslation();

  return (
    <div
      key={i18n.language}
      className="animate-fadeLang"
      style={{
        animationDuration: "0.4s",
        animationTimingFunction: "ease-in-out",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
