import React, { useRef, useState, useEffect } from "react";
import { uploadImage } from "../api";
import { X, Upload, ZoomIn } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ImageUploader({ noteId, imageBase64, imageType, onChange }) {
  const [preview, setPreview] = useState(
    imageBase64 ? `data:${imageType};base64,${imageBase64}` : null
  );
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation("uploader");

  useEffect(() => {
    if (imageBase64) setPreview(`data:${imageType};base64,${imageBase64}`);
  }, [imageBase64, imageType]);

  // 📤 Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload(file);
  };

  // 📋 Handle pasted image
  useEffect(() => {
    const handlePaste = async (e) => {
      const file = Array.from(e.clipboardData.files || [])[0];
      if (file && file.type.startsWith("image/")) {
        await upload(file);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const upload = async (file) => {
    try {
      setLoading(true);
      toast.loading(t("uploading"), { id: "upload" });
      const res = await uploadImage(file, noteId);
      toast.success(t("success"), { id: "upload" });
      setPreview(`data:${res.imageType};base64,${res.imageBase64}`);
      onChange(res.imageBase64, res.imageType);
    } catch {
      toast.error(t("failed"), { id: "upload" });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null, null);
    toast(t("removed"));
  };

  // 🧭 Handle closing lightbox with Escape
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {t("label")}
      </label>

      {!preview ? (
        <div
          className={`
            border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer
            bg-[#fdfcf9] hover:bg-[#f8f6ef] border-[#f0e8d8]
            transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]
            dark:bg-[#2b2b2b] dark:border-[#555] dark:hover:bg-[#3a3a3a]
            ${loading ? "opacity-60 pointer-events-none" : ""}
          `}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload size={28} className="mx-auto text-[#d8b45c] mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("clickOrPaste")} <br />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {t("maxSize")}
            </span>
          </p>
        </div>
      ) : (
        <div
          className="
            relative group bg-[#fdfcf9] border border-[#f0e8d8] rounded-xl
            shadow-[0_2px_6px_rgba(0,0,0,0.06)] p-1
            dark:bg-[#2b2b2b] dark:border-[#555]
          "
        >
          <img
            src={preview}
            alt="Preview"
            className="
              rounded-lg border border-[#f0e8d8] shadow-sm
              w-full object-cover max-h-56 cursor-pointer
              hover:shadow-[0_3px_8px_rgba(0,0,0,0.1)] transition
              dark:border-[#555]
            "
            onClick={() => setLightboxOpen(true)}
          />

          {/* Remove button */}
          <button
            type="button"
            className="
              absolute top-2 right-2 bg-[#d9534f] text-white p-1 rounded-full
              opacity-0 group-hover:opacity-100 transition
              hover:bg-[#b33b38]
            "
            onClick={removeImage}
          >
            <X size={14} />
          </button>

          {/* Zoom button */}
          <button
            type="button"
            className="
              absolute bottom-2 right-2 bg-[#d8b45c] text-[#333] p-1 rounded-full
              opacity-0 group-hover:opacity-100 transition
              hover:bg-[#b7933f]
            "
            onClick={() => setLightboxOpen(true)}
          >
            <ZoomIn size={14} />
          </button>
        </div>
      )}

      {/* 🖼️ Fullscreen Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={preview}
            alt="Full View"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="
              absolute top-5 right-5 bg-[#d9534f] text-white p-2 rounded-full
              hover:bg-[#b33b38] transition
            "
            onClick={() => setLightboxOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
