import { useState, useCallback, useRef, useEffect } from "react";

export default function useNoteHover() {
  const [hoverNote, setHoverNote] = useState(null);
  const [hoverAnchor, setHoverAnchor] = useState(null);
  const [hoverVisible, setHoverVisible] = useState(false);
  const hideTimer = useRef(null);
  const autoHideTimer = useRef(null);
  const hoverLocked = useRef(false);

  const showHover = useCallback((note, element) => {
    if (!note || !element) return;

    clearTimeout(hideTimer.current);
    clearTimeout(autoHideTimer.current);

    let rect;

    // ✅ Allow either DOM element or synthetic anchor object
    if (typeof element.getBoundingClientRect === "function") {
      const r = element.getBoundingClientRect();
      rect = { x: r.x, y: r.y, width: r.width, height: r.height };
    } else {
      // If element is already a manual coordinate object (mobile)
      rect = element;
    }

    setHoverNote(note);
    setHoverAnchor(rect);
    setHoverVisible(true);

    // 🕒 Auto-hide after 2 seconds if user doesn't hover into the card (desktop)
    // 📱 On mobile, extend this to 5 seconds
    const autoHideDelay = window.innerWidth < 768 ? 5000 : 2000;

    autoHideTimer.current = setTimeout(() => {
      if (!hoverLocked.current) setHoverVisible(false);
    }, autoHideDelay);
  }, []);

  const requestHideHover = useCallback(() => {
    clearTimeout(hideTimer.current);
    clearTimeout(autoHideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!hoverLocked.current) setHoverVisible(false);
    }, 200);
  }, []);

  const forceHideHover = useCallback(() => {
    clearTimeout(hideTimer.current);
    clearTimeout(autoHideTimer.current);
    hoverLocked.current = false;
    setHoverVisible(false);
  }, []);

  const lockHover = useCallback(() => {
    hoverLocked.current = true;
    clearTimeout(autoHideTimer.current);
  }, []);

  const unlockHover = useCallback(() => {
    hoverLocked.current = false;
    requestHideHover();
  }, [requestHideHover]);

  // 🧹 Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(autoHideTimer.current);
    };
  }, []);

  return {
    hoverNote,
    hoverAnchor,
    hoverVisible,
    showHover,
    requestHideHover,
    forceHideHover,
    lockHover,
    unlockHover,
  };
}
