(() => {
  "use strict";
  const key = "nekrmte-vet-phone";
  const input = document.getElementById("vet-phone");
  const status = document.getElementById("vet-phone-status");
  const form = document.querySelector(".vet-phone-form");

  function readPhone() {
    try {
      return localStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function cleanPhone(value) {
    const cleaned = String(value || "").replace(/[^+\d]/g, "").replace(/(?!^)\+/g, "");
    return cleaned.replace(/\D/g, "").length >= 6 ? cleaned : "";
  }

  function updateLinks() {
    const phone = cleanPhone(readPhone());
    document.querySelectorAll("[data-vet-link]").forEach((link) => {
      link.href = phone ? `tel:${phone}` : "#veterinar";
      link.setAttribute("aria-label", phone ? `Volat veterináře na číslo ${readPhone()}` : "Uložit číslo veterináře pro zavolání");
    });
  }

  window.updateVetLinks = updateLinks;
  if (!form || !input) return;

  input.value = readPhone();
  updateLinks();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = cleanPhone(input.value);
    if (input.value.trim() && !value) {
      status.textContent = "Zadejte platné telefonní číslo.";
      input.focus();
      return;
    }
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    } catch {
      status.textContent = "Číslo se nepodařilo uložit. Zkontrolujte nastavení prohlížeče.";
      return;
    }
    input.value = value;
    status.textContent = value ? "Číslo je uložené pouze v tomto prohlížeči." : "Uložené číslo bylo odstraněno.";
    updateLinks();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-vet-link]");
    if (!link || cleanPhone(readPhone())) return;
    event.preventDefault();
    input.focus();
    status.textContent = "Nejdřív uložte číslo svého veterináře.";
  });
})();
