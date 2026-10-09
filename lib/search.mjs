// Pure helpers — single source for app.js (browser) i Node testy.
// Bez závislostí na DOM.

export const LEVEL_LABELS = {
  danger: "Volejte veterináře ihned",
  caution: "Ověřte a volejte veterináři",
  safe: "Obvykle netoxické — čtěte podmínky",
};

export const SORT_ORDER = { danger: 0, caution: 1, safe: 2 };

export function normalise(value) {
  return String(value ?? "")
    .toLocaleLowerCase("cs")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function resolveFood(food, animal) {
  return { ...food, ...(food.byAnimal?.[animal] || {}) };
}

export function resolvedSources(food, animal, catalog) {
  const override = food.byAnimal?.[animal]?.sources;
  const keys = override || food.sources || [];
  return keys.map((k) =>
    catalog?.[k] ? { key: k, ...catalog[k] } : { key: k, label: String(k), url: "#" }
  );
}

/** Vrátí filtrovaný + seřazený seznam pro dané zvíře a dotaz.
 * Záměrně NEprohledává `summary`: shrnutí obsahuje i podmíněné příklady
 * („zkontrolujte složení žvýkaček…“, „rybíz do této karty nepatří“),
 * které by jinak vytvářely falešně jisté shody. Relevantní popis je
 * pokryt přes `principle`, `signs` a `riskType`. */
export function filterFoods(foods, animal, query) {
  const q = normalise(String(query ?? "").trim());
  return foods
    .filter((f) => (f.animals || []).includes(animal))
    .map((f) => resolveFood(f, animal))
    .filter((f) => {
      if (!q) return true;
      const haystack = normalise(
        [f.name, ...(f.aliases || []), f.principle, f.signs, f.riskType]
          .filter(Boolean)
          .join(" ")
      );
      return haystack.includes(q);
    })
    .sort(
      (a, b) =>
        (SORT_ORDER[a.level] ?? 9) - (SORT_ORDER[b.level] ?? 9) ||
        String(a.name).localeCompare(String(b.name), "cs")
    );
}

/** Validace datového modelu. Vrátí pole chyb (prázdné = OK). */
export function validateFoods(data) {
  const errors = [];
  const foods = data?.foods || [];
  const ids = new Set();
  const aliasOwner = new Map(); // normalizovaný alias -> id

  for (const f of foods) {
    if (!f.id || !/^[a-z0-9-]+$/.test(f.id)) errors.push(`${f.id || "?"}: nevalidní id`);
    if (ids.has(f.id)) errors.push(`${f.id}: duplicitní id`);
    ids.add(f.id);
    for (const field of ["name", "principle", "summary", "signs", "action", "evidence", "riskType", "reviewedAt"]) {
      if (!f[field] || !String(f[field]).trim()) errors.push(`${f.id}: chybí ${field}`);
    }
    if (!Array.isArray(f.animals) || !f.animals.length) errors.push(`${f.id}: chybí animals`);
    if (!["danger", "caution", "safe"].includes(f.level)) errors.push(`${f.id}: nevalidní level`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.reviewedAt || "")) errors.push(`${f.id}: reviewedAt není YYYY-MM-DD`);
    if (!Array.isArray(f.sources) || !f.sources.length) errors.push(`${f.id}: chybí sources`);
    for (const s of f.sources || []) {
      if (!data.sourceCatalog?.[s]) errors.push(`${f.id}: neznámý zdroj ${s}`);
    }
    for (const a of f.aliases || []) {
      if (!String(a).trim()) errors.push(`${f.id}: prázdný alias`);
      const n = normalise(a);
      if (aliasOwner.has(n) && aliasOwner.get(n) !== f.id) {
        errors.push(`alias "${a}" ve ${f.id} koliduje s ${aliasOwner.get(n)}`);
      } else if (!aliasOwner.has(n)) {
        aliasOwner.set(n, f.id);
      }
      if (normalise(f.name).includes(n) || n.includes(normalise(f.name))) {
        // shoda názvu s aliasem je v pořádku, nehlásit
      }
    }
    // Konzistence level vs. action
    const action = normalise(f.action || "");
    if (f.level === "danger" && !/(ihned|okamzite|pohotovost)/.test(action)) {
      errors.push(`${f.id}: danger musí v akci obsahovat ihned/okamžitě/pohotovost`);
    }
    if (f.level === "caution" && !/(pokud|pri|podle|overte|kontaktujte|volejte|sledujte|zavolejte)/.test(action)) {
      errors.push(`${f.id}: caution musí obsahovat podmínku/pokyn k ověření`);
    }
    // byAnimal
    for (const [animal, o] of Object.entries(f.byAnimal || {})) {
      if (o.level && !["danger", "caution", "safe"].includes(o.level)) {
        errors.push(`${f.id}.byAnimal.${animal}: nevalidní level`);
      }
    }
  }
  return errors;
}
