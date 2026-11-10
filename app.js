import {
  LEVEL_LABELS,
  normalise,
  resolveFood,
  resolvedSources,
  filterFoods,
} from "./lib/search.mjs";

(() => {
  "use strict";

  const ANIMAL_NAMES = { dog: "psa", cat: "kočku" };
  const ANIMAL_GEN = { dog: "psa", cat: "kočku" };

  const foodsElement = document.getElementById("foods");
  const search = document.getElementById("food-search");
  const searchForm = document.getElementById("search-form");
  const summary = document.getElementById("results-summary");
  const resultsTitle = document.getElementById("results-title");
  const resultsElement = document.querySelector(".results");
  const animalButtons = [...document.querySelectorAll(".animal-button")];
  const themeToggle = document.getElementById("theme-toggle");

  const state = { animal: "dog", query: "" };

  // Data: jediný zdroj je <script type="application/json" id="foods-data">,
  // generovaný z data/foods.json (scripts/build.mjs). Žádná druhá kopie v JS.
  function loadData() {
    const el = document.getElementById("foods-data");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent || "");
    } catch {
      return null;
    }
  }

  const data = loadData();
  const foods = data?.foods || [];
  const catalog = data?.sourceCatalog || {};

  function formatCsDate(iso) {
    const parts = String(iso || "").split("-");
    if (parts.length !== 3) return String(iso || "");
    return `${Number(parts[2])}. ${Number(parts[1])}. ${Number(parts[0])}`;
  }

  function makeElement(name, className, text) {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function appendFact(list, term, description) {
    list.append(makeElement("dt", "", term), makeElement("dd", "", description));
  }

  function renderCard(food) {
    const card = makeElement("article", `food-card ${food.level}`);
    card.id = `jidlo-${food.id}`;
    const top = makeElement("div", "card-top");
    top.append(makeElement("span", `badge ${food.level}`, LEVEL_LABELS[food.level] || food.level));
    top.append(makeElement("span", "badge", `Podklady: ${food.evidence}`));
    const title = makeElement("h3", "", food.name);
    const description = makeElement("p", "card-summary", food.summary);
    const facts = makeElement("dl", "facts");
    appendFact(facts, "Typ rizika", food.riskType || "—");
    appendFact(facts, "Rizikový faktor", food.principle);
    appendFact(facts, "Možné příznaky", food.signs);
    const action = makeElement("p", "card-action");
    action.append(makeElement("strong", "", "Co udělat"), document.createTextNode(`: ${food.action}`));
    const source = makeElement("p", "card-source");
    source.append(document.createTextNode("Zdroj: "));
    const srcs = resolvedSources(
      foods.find((f) => f.id === food.id) || food,
      state.animal,
      catalog
    );
    srcs.forEach((s, i) => {
      const link = makeElement("a", "", s.label);
      link.href = s.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      source.append(link);
      if (i < srcs.length - 1) source.append(document.createTextNode("; "));
    });
    source.append(
      document.createElement("br"),
      document.createTextNode(`Kontrola podkladů: ${formatCsDate(food.reviewedAt)} (redakční kontrola zdrojů, nikoli veterinární atestace). `)
    );
    const permalink = makeElement("a", "card-link", "Odkaz na kartu");
    permalink.href = `#jidlo-${food.id}`;
    source.append(permalink);
    card.append(top, title, description, facts, action, source);
    return card;
  }

  function emptyState(query) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("strong", "", "Tuto položku v ověřeném výběru nemáme."),
      makeElement(
        "p",
        "",
        "Nenalezený záznam neznamená, že je potravina bezpečná. " +
          "Ověřte přesný název a složení výrobku (obal), odhad množství, čas požití a příznaky."
      ),
      makeElement(
        "p",
        "",
        "U neznámé potraviny, a vždy u léků, chemikálií a rostlin, kontaktujte veterináře. " +
          "Obecný výrobek (např. žvýkačka, sladkost, ořechový krém) bez přečtení složení nepovažujte za důkaz obsahu xylitolu, čokolády ani rozinek."
      ),
      makeElement(
        "p",
        "",
        `Hledali jste „${query}“ pro ${ANIMAL_GEN[state.animal]}. Připravte si pro veterináře: druh a hmotnost zvířete, název a složení, množství, čas a příznaky.`
      )
    );
    return empty;
  }

  function renderFoods() {
    const filtered = filterFoods(foods, state.animal, state.query);
    foodsElement.replaceChildren();
    resultsTitle.textContent = `Vybrané potraviny pro ${ANIMAL_NAMES[state.animal]}`;
    const q = state.query.trim();
    if (!filtered.length) {
      summary.textContent = q
        ? `Pro ${ANIMAL_GEN[state.animal]} nic neodpovídá dotazu „${q}“. Neznamená to, že je to bezpečné.`
        : `Pro ${ANIMAL_GEN[state.animal]} nebyla nalezena žádná položka.`;
      foodsElement.append(emptyState(q || "—"));
      return;
    }
    const names = filtered.map((f) => f.name).join(", ");
    summary.textContent =
      filtered.length === 1
        ? `Nalezena 1 položka pro ${ANIMAL_GEN[state.animal]}: ${names}.`
        : `Nalezeno ${filtered.length} položek pro ${ANIMAL_GEN[state.animal]}: ${names}.`;
    foodsElement.append(...filtered.map(renderCard));
  }

  function setAnimal(animal, opts = {}) {
    state.animal = animal;
    animalButtons.forEach((button) => {
      const active = button.dataset.animal === animal;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderFoods();
    if (opts.focus !== false && document.activeElement?.dataset?.animal) {
      // ponechat fokus na tlačítku, nekrást ho
    }
  }

  function setTheme(isDark) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-label", isDark ? "Zapnout světlý režim" : "Zapnout tmavý režim");
    themeToggle.title = isDark ? "Zapnout světlý režim" : "Zapnout tmavý režim";
  }

  // Debounce: neoznamovat celou databázi při každém stisku klávesy.
  let inputTimer = null;
  animalButtons.forEach((button) =>
    button.addEventListener("click", () => setAnimal(button.dataset.animal))
  );
  search.addEventListener("input", () => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      state.query = search.value;
      renderFoods();
    }, 150);
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(inputTimer);
    state.query = search.value;
    renderFoods();
    resultsElement.scrollIntoView({ block: "start" });
    resultsTitle.focus({ preventScroll: true });
  });

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme !== "dark";
    setTheme(isDark);
    try {
      localStorage.setItem("nekrmte-theme", isDark ? "dark" : "light");
    } catch {
      // Uložené nastavení je volitelné (např. soukromý režim).
    }
  });

  // Hluboké odkazy #jidlo-<id>: po načtení ukázat správné zvíře a skrolovat.
  function handleHash() {
    const m = /^#jidlo-([a-z0-9-]+)$/.exec(location.hash || "");
    if (!m) return;
    const target = foods.find((f) => f.id === m[1]);
    if (!target) return;
    if (!target.animals.includes(state.animal)) {
      setAnimal(target.animals[0]);
    } else {
      renderFoods();
    }
    requestAnimationFrame(() => {
      document.getElementById(`jidlo-${m[1]}`)?.scrollIntoView({ block: "start" });
    });
  }

  if (!foods.length) {
    resultsTitle.textContent = "Obsah se nepodařilo načíst";
    summary.textContent = "Data se nenačetla. Zkuste stránku obnovit; při potížích volejte veterináře.";
    foodsElement.replaceChildren(
      (() => {
        const d = makeElement("div", "empty-state");
        d.append(
          makeElement("strong", "", "Obsah se nepodařilo načíst."),
          makeElement("p", "", "Základní bezpečnostní pokyny výše na stránce platí i bez načtených karet. Při podezření na nebezpečné požití volejte veterináře.")
        );
        return d;
      })()
    );
  } else {
    // Podpora ?q= a ?zvire= pro sdílení dotazu.
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get("q");
      const zvire = params.get("zvire");
      if (zvire === "dog" || zvire === "cat") state.animal = zvire;
      if (q) {
        state.query = q;
        search.value = q;
      }
      animalButtons.forEach((button) => {
        const active = button.dataset.animal === state.animal;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    } catch {
      // Parametry URL jsou volitelné.
    }
    setTheme(document.documentElement.dataset.theme === "dark");
    renderFoods();
    handleHash();
    window.addEventListener("hashchange", handleHash);
  }

  // Export pro případné ladění (ne pro UI).
  window.__nekrmte = { filterFoods, normalise, resolveFood };
})();
