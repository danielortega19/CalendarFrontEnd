import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18n";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";

// ✅ Wrapper that can safely use hooks
function AppWrapper() {
  return (
    <BrowserRouter>
      <Header />
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "8px",
            padding: "12px 16px",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
      <Footer />
    </BrowserRouter>
  );
}

// ✅ Root render
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <AppWrapper />
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
