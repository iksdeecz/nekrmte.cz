(() => {
  "use strict";
  document.documentElement.classList.add("js");
  function applyTheme(isDark) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    const toggle = document.getElementById("theme-toggle");
    if (toggle) toggle.setAttribute("aria-label", isDark ? "Zapnout světlý režim" : "Zapnout tmavý režim");
  }
  try {
    const saved = localStorage.getItem("nekrmte-theme");
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(dark);
  } catch {
    // Keep the light theme if storage or media preferences are unavailable.
  }
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    toggle?.addEventListener("click", () => {
      const isDark = document.documentElement.dataset.theme !== "dark";
      applyTheme(isDark);
      try {
        localStorage.setItem("nekrmte-theme", isDark ? "dark" : "light");
      } catch {
        // Theme preference is optional.
      }
    });
  });
})();
