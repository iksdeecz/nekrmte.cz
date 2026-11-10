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

  const state = { animal: null, query: "" };

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
    card.dataset.animal = state.animal;
    const top = makeElement("div", "card-top");
    top.append(makeElement("span", `badge ${food.level}`, LEVEL_LABELS[food.level] || food.level));
    top.append(makeElement("span", "animal-context", `Pro ${ANIMAL_NAMES[state.animal]}`));
    const title = makeElement("h3", "", food.name);
    const description = makeElement("p", "card-summary", food.summary);
    const action = makeElement("p", "card-action");
    action.append(makeElement("strong", "", "Co udělat teď"), document.createTextNode(`: ${food.action}`));
    const callVet = makeElement("a", "card-call-vet", "📞 Volat veterináře");
    callVet.href = "#veterinar";
    callVet.dataset.vetLink = "";
    const prepare = makeElement("p", "card-prepare");
    prepare.append(makeElement("strong", "", "Co mít po ruce"), document.createTextNode(": obal nebo přesný název, odhad množství, čas požití, hmotnost zvířete a případné příznaky."));
    const signs = makeElement("p", "card-signs");
    signs.append(makeElement("strong", "", "Možné příznaky"), document.createTextNode(`: ${food.signs}`));
    const details = makeElement("details", "card-details");
    details.append(makeElement("summary", "", "Proč je to nebezpečné"));
    details.append(makeElement("p", "", `${food.riskType || "Riziko"}: ${food.principle}.`));
    const source = makeElement("p", "card-source");
    source.append(document.createTextNode("Zdroj: "));
    const srcs = resolvedSources(
      foods.find((f) => f.id === food.id) || food,
      state.animal,
      catalog
    );
    srcs.forEach((s, i) => {
      const link = makeElement("a", "", `${s.label} (EN)`);
      link.href = s.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      source.append(link);
      if (i < srcs.length - 1) source.append(document.createTextNode("; "));
    });
    source.append(
      document.createElement("br"),
      document.createTextNode(`Redakční kontrola zdroje: ${formatCsDate(food.reviewedAt)}. `)
    );
    const permalink = makeElement("a", "card-link", "Odkaz na kartu");
    permalink.href = `#jidlo-${food.id}`;
    source.append(permalink);
    const detailLink = makeElement("a", "card-link", "Podrobná stránka");
    detailLink.href = `/${state.animal === "dog" ? "pes" : "kocka"}/${food.seoSlug}/`;
    source.append(document.createTextNode(" · "), detailLink);
    const relatedIds = { chocolate: ["xylitol"], xylitol: ["chocolate"], "fatty-foods": ["macadamia"], macadamia: ["fatty-foods"] }[food.id] || [];
    let related = null;
    if (relatedIds.length) {
      related = makeElement("p", "card-related");
      related.append(document.createTextNode("Související: "));
      relatedIds.forEach((id) => {
        const item = foods.find((entry) => entry.id === id);
        if (!item || !item.animals.includes(state.animal)) return;
        const link = makeElement("a", "", item.name);
        link.href = `/${state.animal === "dog" ? "pes" : "kocka"}/${item.seoSlug}/`;
        related.append(link);
      });
    }
    card.append(top, title, description, action, callVet, prepare, signs, details, source);
    if (related) card.append(related);
    return card;
  }

  function addEmergencyLinks(container, query) {
    const actions = makeElement("div", "empty-actions");
    const call = makeElement("a", "card-call-vet", "Volat veterináře");
    call.href = "#veterinar";
    call.dataset.vetLink = "";
    const map = makeElement("a", "emergency-map", "Najít nonstop pohotovost v okolí");
    map.href = "https://www.google.com/maps/search/?api=1&query=nonstop+veterin%C3%A1rn%C3%AD+pohotovost";
    map.target = "_blank";
    map.rel = "noopener noreferrer";
    const suggest = makeElement("a", "suggest-food", "Navrhnout doplnění");
    const issue = new URL("https://github.com/iksdeecz/nekrmte.cz/issues/new");
    issue.searchParams.set("title", `Návrh položky: ${query}`);
    issue.searchParams.set("body", `V přehledu chybí: ${query}\n\nDruh zvířete: ${ANIMAL_NAMES[state.animal] || "neuveden"}`);
    suggest.href = issue.href;
    suggest.target = "_blank";
    suggest.rel = "noopener noreferrer";
    actions.append(call, map, suggest);
    container.append(actions);
  }

  function emptyState(query) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("strong", "", "Tohle v přehledu nemáme."),
      makeElement(
        "p",
        "",
        "To neznamená, že je to bezpečné. Ověřte přesný název a složení výrobku, odhad množství, čas požití a příznaky. Zavolejte veterináři."
      ),
      makeElement(
        "p",
        "",
        `Hledali jste „${query}“ pro ${ANIMAL_GEN[state.animal]}. Připravte si obal, množství, čas požití, hmotnost zvířete a případné příznaky.`
      )
    );
    addEmergencyLinks(empty, query);
    return empty;
  }

  function renderFoods() {
    if (!state.animal) {
      document.documentElement.classList.remove("animal-selected");
      foodsElement.replaceChildren();
      resultsTitle.textContent = "Nejdřív vyberte zvíře";
      summary.textContent = "Vyberte psa nebo kočku, aby se zobrazily správné informace.";
      const prompt = makeElement("div", "empty-state");
      prompt.append(makeElement("strong", "", "O jaké zvíře jde?"), makeElement("p", "", "Vyberte psa nebo kočku nad vyhledáváním. Riziko se může mezi druhy lišit."));
      foodsElement.append(prompt);
      return;
    }
    document.documentElement.classList.add("animal-selected");
    const filtered = filterFoods(foods, state.animal, state.query);
    foodsElement.replaceChildren();
    resultsTitle.textContent = `Vybrané potraviny pro ${ANIMAL_NAMES[state.animal]}`;
    const q = state.query.trim();
    if (!filtered.length) {
      summary.textContent = q
        ? `Pro ${ANIMAL_GEN[state.animal]} nic neodpovídá dotazu „${q}“. Neznamená to, že je to bezpečné.`
        : `Pro ${ANIMAL_GEN[state.animal]} nebyla nalezena žádná položka.`;
      foodsElement.append(emptyState(q || "—"));
      window.updateVetLinks?.();
      return;
    }
    const names = filtered.map((f) => f.name).join(", ");
    summary.textContent =
      filtered.length === 1
        ? `Nalezena 1 položka pro ${ANIMAL_GEN[state.animal]}: ${names}.`
        : `Nalezeno ${filtered.length} položek pro ${ANIMAL_GEN[state.animal]}: ${names}.`;
    foodsElement.append(...filtered.map(renderCard));
    window.updateVetLinks?.();
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
