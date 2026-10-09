// Build: single source data/foods.json -> index.html (embedded JSON + static no-JS cards).
// Usage: node scripts/build.mjs [--check]  (--check fails if index.html is stale)
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(root, "data/foods.json");
const htmlPath = resolve(root, "index.html");

const LEVEL_LABELS = { danger: "Volejte veterináře ihned", caution: "Ověřte a volejte veterináři", safe: "Obvykle netoxické — čtěte podmínky" };
const ANIMAL_NAMES = { dog: "psa", cat: "kočku" };

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCsDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

function resolveFood(food, animal, catalog) {
  const o = food.byAnimal?.[animal] || {};
  const sources = (o.sources || food.sources).map((k) => catalog[k] || { label: k, url: "#" });
  return { ...food, ...o, resolvedSources: sources };
}

function cardHtml(food, catalog) {
  const f = resolveFood(food, "dog", catalog);
  const levelLabel = LEVEL_LABELS[f.level] || f.level;
  const sources = f.resolvedSources
    .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`)
    .join("<br>");
  return [
    `<article class="food-card ${esc(f.level)}" id="jidlo-${esc(food.id)}">`,
    `<div class="card-top"><span class="badge ${esc(f.level)}">${esc(levelLabel)}</span><span class="badge">Podklady: ${esc(f.evidence)}</span></div>`,
    `<h3>${esc(f.name)}</h3>`,
    `<p class="card-summary">${esc(f.summary)}</p>`,
    `<dl class="facts">`,
    `<dt>Typ rizika</dt><dd>${esc(f.riskType || "")}</dd>`,
    `<dt>Rizikový faktor</dt><dd>${esc(f.principle)}</dd>`,
    `<dt>Možné příznaky</dt><dd>${esc(f.signs)}</dd>`,
    `</dl>`,
    `<p class="card-action"><strong>Co udělat</strong> ${esc(f.action)}</p>`,
    `<p class="card-source">Zdroj: ${sources}<br>Kontrola podkladů: ${esc(formatCsDate(f.reviewedAt))} (redakční kontrola zdrojů, nikoli veterinární atestace).</p>`,
    `</article>`,
  ].join("");
}

function buildStaticCards(data) {
  const dogFoods = data.foods.filter((f) => f.animals.includes("dog"));
  const order = { danger: 0, caution: 1, safe: 2 };
  dogFoods.sort((a, b) => (order[a.level] ?? 9) - (order[b.level] ?? 9) || a.name.localeCompare(b.name, "cs"));
  return dogFoods.map((f) => cardHtml(f, data.sourceCatalog)).join("\n");
}

const raw = readFileSync(dataPath, "utf8");
const data = JSON.parse(raw);
const jsonEmbed = `<script type="application/json" id="foods-data">\n${JSON.stringify(data).replace(/<\/script/gi, "<\\/script")}\n</script>`;
const staticCards = buildStaticCards(data);

let html = readFileSync(htmlPath, "utf8");

function replaceBetween(src, start, end, replacement) {
  const i = src.indexOf(start);
  const j = src.indexOf(end);
  if (i === -1 || j === -1 || j < i) throw new Error(`Marker missing: ${start} / ${end}`);
  return src.slice(0, i + start.length) + "\n" + replacement + "\n" + src.slice(j);
}

const DATA_START = "<!-- FOODS:DATA:START -->";
const DATA_END = "<!-- FOODS:DATA:END -->";
const STATIC_START = "<!-- FOODS:STATIC:START -->";
const STATIC_END = "<!-- FOODS:STATIC:END -->";

if (!html.includes(DATA_START) || !html.includes(STATIC_START)) {
  console.error("index.html neobsahuje FOODS markery. Nejdřív upravte index.html.");
  process.exit(1);
}

const next = replaceBetween(
  replaceBetween(html, DATA_START, DATA_END, jsonEmbed),
  STATIC_START, STATIC_END, staticCards
);

if (process.argv.includes("--check")) {
  if (next !== html) {
    console.error("index.html je zastaralé vůči data/foods.json (spusťte npm run build).");
    process.exit(1);
  } else {
    console.log("index.html je aktuální.");
  }
} else {
  writeFileSync(htmlPath, next);
  console.log(`Vygenerováno: ${data.foods.length} položek, statické karty pro psa.`);
}
