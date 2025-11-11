import React, { useEffect, useState } from "react";

const API_BASE = "https://calendarapi-yk7l.onrender.com/api/";

export default function ApiHealthCheck() {
  const [apiDown, setApiDown] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}health`, { timeout: 4000 });

        // If not OK, mark as down
        if (!response.ok) {
          setApiDown(true);
        } else {
          setApiDown(false);
        }
      } catch (error) {
        console.warn("⚠️ API unreachable:", error.message);
        setApiDown(true);
      }
    };

    checkHealth();
  }, []);

  // ✅ Render nothing unless API is down
  if (!apiDown) return null;

  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        color: "red",
        fontWeight: "600",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
        margin: "1rem auto",
        width: "fit-content",
      }}
    >
      ❌ API Unreachable
    </div>
  );
}
