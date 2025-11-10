// tailwind.config.js
module.exports = {
  darkMode: "class", // important for your body.dark setup
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Comic Neue"', '"Patrick Hand"', 'sans-serif'],
      },
      colors: {
        // ☀️ Light mode
        sticky: {
          bg: "var(--sticky-bg)",
          paper: "var(--sticky-paper)",
          highlight: "var(--sticky-highlight)",
          shadow: "var(--sticky-shadow)",
        },
        note: {
          yellow: "var(--note-yellow)",
          orange: "var(--note-orange)",
          blue: "var(--note-blue)",
        },
        gold: {
          soft: "#fdf6d5",
          warm: "#d8b45c",
          dark: "#b7933f",
        },

        // 🌙 Dark mode tokens (used via dark: classes)
        dark: {
          bg: "#1e1e1e",
          paper: "#2a2a2a",
          highlight: "#444",
          shadow: "rgba(255,255,255,0.05)",
        },
      },
      boxShadow: {
        sticky: "0 3px 6px var(--sticky-shadow)",
        stickyHover: "0 6px 10px rgba(0,0,0,0.18)",
        glowGold: "0 0 12px rgba(255, 245, 180, 0.3)",
        glowSoft: "0 0 6px rgba(255, 255, 200, 0.15)",
      },
      backgroundImage: {
        "sticky-pattern":
          "repeating-linear-gradient(-45deg, #fffef8, #fffef8 25px, #fffdea 26px, #fffef8 27px)",
        "dark-vignette":
          "radial-gradient(circle at center, #1a1a1a 20%, #0f0f0f 100%)",
      },
      transitionProperty: {
        theme:
          "background-color, color, border-color, box-shadow, transform",
      },
    },
  },
  plugins: [],
};
