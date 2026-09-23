/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Work Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#0e131a",
        sidebar: "#0a0e14",
        card: "#141a22",
        field: "#161c26",
        border: "rgba(255,255,255,.06)",
        borderStrong: "rgba(255,255,255,.08)",
        muted: "#8b95a3",
        subtle: "#5f6a78",
        faint: "#4a5563",
        ink: "#e9edf1",
        brand: {
          navy: "#242F40",
          teal: "#17968F",
          tealDark: "#15827C",
          tealLight: "#3ecbc0",
        },
        status: {
          critical: "#e8536b",
          high: "#f0b429",
          medium: "#6fa8f5",
          low: "#3ecbc0",
        },
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};
