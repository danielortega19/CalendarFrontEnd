import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useGlobalFetchInterceptor from "./utils/globalFetchInterceptor";
import ChangePassword from "./pages/ChangePassword";
import ApiHealthCheck from "./components/ApiHealthCheck";

// Lazy load pages
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/ContactUs"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"))

export default function App() {
  useGlobalFetchInterceptor();

  return (
    <div
      className="
        min-h-screen
        bg-[var(--sticky-paper)]
        text-gray-800
        dark:bg-[#1e1e1e]
        dark:text-gray-100
        transition-colors duration-500
      "
    >
      
      {/* ✅ API Health Check */}
      <ApiHealthCheck />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-yellow-600 dark:text-yellow-300 text-lg font-semibold">
            Loading your workspace…
          </div>
        }
      >
        <Routes>
          {/* 🏠 Default route → Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* 📝 Register */}
          <Route path="/register" element={<Register />} />

          {/* 👤 Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* 📩 Contact Us */}
          <Route path="/contact-us" element={<Contact />} />

            {/* 📩 Reset Password */}
          <Route path="/reset-password" element={<ResetPassword />} />

            {/* 📩 Change Password */}
          <Route path="/change-password" element={<ChangePassword />} />

          {/* 🔁 Redirects */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/change-password" element={<Navigate to="/" replace />} />

          {/* 🚫 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300">
      <h1 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
        404
      </h1>
      <p className="text-sm mb-4">Page not found</p>
      <a
        href="/"
        className="text-yellow-600 hover:text-yellow-500 font-medium transition-colors"
      >
        Go back home
      </a>
    </div>
  );
}
