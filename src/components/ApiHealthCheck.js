import React, { useEffect, useState } from "react";

const API_BASE = "https://calendarapi-yk7l.onrender.com/api/";

export default function ApiHealthCheck() {
  const [status, setStatus] = useState("Checking...");
  const [color, setColor] = useState("gray");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}health`);
        if (response.ok) {
          setStatus("✅ Connected to API");
          setColor("green");
        } else {
          setStatus("⚠️ API returned an error");
          setColor("orange");
        }
      } catch (error) {
        setStatus("❌ API Unreachable");
        setColor("red");
      }
    };

    checkHealth();
  }, []);

  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        color: color,
        fontWeight: "600",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
        margin: "1rem auto",
        width: "fit-content",
      }}
    >
      {status}
    </div>
  );
}
