(() => {
  "use strict";
  try {
    const saved = localStorage.getItem("nekrmte-theme");
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch {
    // Keep the light theme if storage or media preferences are unavailable.
  }
})();
