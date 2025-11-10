import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function NoteHoverCard({
  note,
  anchor,
  onEdit,
  onDelete,
  onRequestClose,
  lockHover,
  unlockHover,
}) {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [position, setPosition] = useState({ top: 0, left: 0, flipX: false, arrowOffset: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧮 Calculate desktop position (popover)
  useEffect(() => {
    if (!anchor || isMobile) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const margin = 10;
    const cardWidth = 320;
    const cardHeight = 220;

    let top = anchor.y + scrollY + anchor.height / 2 - cardHeight / 2;
    let left = anchor.x + anchor.width + margin;
    let flipX = false;

    if (left + cardWidth > viewportWidth - margin) {
      left = anchor.x - cardWidth - margin;
      flipX = true;
    }

    // Clamp inside viewport
    if (top + cardHeight > viewportHeight + scrollY) {
      top = viewportHeight + scrollY - cardHeight - margin;
    }
    if (top < scrollY + margin) top = scrollY + margin;

    // 🔧 Calculate arrow offset (where the pointer should align vertically)
    const noteCenterY = anchor.y + anchor.height / 2 + scrollY;
    const arrowOffset = noteCenterY - top;

    setPosition({ top, left, flipX, arrowOffset });
  }, [anchor, isMobile]);

  const imageSrc =
    note?.imageBase64 && note?.imageType
      ? `data:${note.imageType};base64,${note.imageBase64}`
      : null;

  // 🖼️ Enlarged image overlay
  const renderImagePreview = () =>
    createPortal(
      <div
        className="fixed inset-0 z-[20000] bg-black/70 flex items-center justify-center"
        onClick={() => setShowImagePreview(false)}
      >
        <img
          src={imageSrc}
          alt="Preview"
          className="max-w-[95%] max-h-[90vh] object-contain rounded-lg border border-[#f3e8b3]
                     dark:border-[#d1b866] shadow-2xl transition-transform duration-300 ease-in-out scale-100 hover:scale-[1.03]"
        />
      </div>,
      document.body
    );

  // 🧩 Mobile full-screen modal
  if (isMobile) {
    return createPortal(
      <div
        className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center px-4"
        onClick={onRequestClose}
      >
        <div
          className="bg-[var(--sticky-paper)] dark:bg-[#222]
                     border border-[#f3e8b3] dark:border-[#d1b866]
                     rounded-2xl p-4 w-full max-w-[380px] max-h-[80vh]
                     overflow-y-auto relative shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {imageSrc && (
            <div className="mb-3 relative">
              <img
                src={imageSrc}
                alt="Note"
                className="w-full rounded-md border border-[#f3e8b3] dark:border-[#d1b866]
                           cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                onClick={() => setShowImagePreview(true)}
              />
            </div>
          )}

          <h4 className="font-semibold text-[16px] mb-2 text-[#3b3414] dark:text-[#ffe98b]">
            {note?.title || "Untitled Note"}
          </h4>
          <p className="text-[14px] text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
            {note?.content || "No content."}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                onEdit?.(note);
                onRequestClose?.();
              }}
              className="px-3 py-1.5 rounded-md text-sm bg-[#d8b45c] hover:bg-[#b7933f] text-[#333]"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete?.(note.id);
                onRequestClose?.();
              }}
              className="px-3 py-1.5 rounded-md text-sm bg-[#f4d7a1] hover:bg-[#eac27e] text-[#333]"
            >
              Delete
            </button>
          </div>
          {showImagePreview && renderImagePreview()}
        </div>
      </div>,
      document.body
    );
  }

  // 🖥️ Desktop Smart Popover
  return createPortal(
    <div
      className="absolute z-[10001] animate-fade-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={lockHover}
      onMouseLeave={onRequestClose}
    >
      {/* 🧭 Pointer arrow — dynamically positioned */}
      <div
        className="absolute z-[1]"
        style={{
          top: `${Math.min(
            Math.max(position.arrowOffset, 16),
            220 - 16
          )}px`, // clamp arrow inside bounds
          [position.flipX ? "right" : "left"]: "-6px",
          transform: "translateY(-50%)",
        }}
      >
        <div
          className={`w-0 h-0 border-t-[6px] border-b-[6px] ${
            position.flipX
              ? "border-l-[6px] border-l-[#f3e8b3] dark:border-l-[#d1b866]"
              : "border-r-[6px] border-r-[#f3e8b3] dark:border-r-[#d1b866]"
          } border-t-transparent border-b-transparent`}
        />
      </div>

      {/* Card container */}
      <div
        className="rounded-2xl border border-[#f3e8b3] bg-[var(--sticky-paper)]
                   dark:bg-[#222] dark:border-[#d1b866] shadow-lg
                   p-4 text-sm w-[300px] max-w-[90vw]
                   transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                   transform-gpu hover:scale-[1.01] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                   animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        {imageSrc && (
          <div className="mb-3 relative">
            <img
              src={imageSrc}
              alt="Note"
              className="w-full rounded-md border border-[#f3e8b3] dark:border-[#d1b866]
                         cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              onClick={() => setShowImagePreview(true)}
            />
          </div>
        )}

        <h4 className="font-semibold text-[15px] mb-1 text-[#3b3414] dark:text-[#ffe98b]">
          {note?.title || "Untitled Note"}
        </h4>
        <p className="text-[13px] text-gray-700 dark:text-gray-300 mb-3">
          {note?.content || "No content."}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onEdit?.(note);
              onRequestClose?.();
            }}
            className="px-3 py-1 text-sm rounded-md bg-[#d8b45c] hover:bg-[#b7933f] text-[#333]"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete?.(note.id);
              onRequestClose?.();
            }}
            className="px-3 py-1 text-sm rounded-md bg-[#f4d7a1] hover:bg-[#eac27e] text-[#333]"
          >
            Delete
          </button>
        </div>
        {showImagePreview && renderImagePreview()}
      </div>
    </div>,
    document.body
  );
}
