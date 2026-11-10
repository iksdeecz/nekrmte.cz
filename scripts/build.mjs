// Build: single source data/foods.json -> index.html (embedded JSON + static no-JS cards).
// Usage: node scripts/build.mjs [--check]  (--check fails if index.html is stale)
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(root, "data/foods.json");
const htmlPath = resolve(root, "index.html");

import { LEVEL_LABELS, normalise } from "../lib/search.mjs";

const LEVEL_ORDER = { danger: 0, caution: 1, safe: 2 };
const FOOD_PRIORITY = { chocolate: 0, xylitol: 1, grapes: 2, allium: 3, caffeine: 4, alcohol: 5, "yeast-dough": 6, macadamia: 7, bones: 8 };
const ANIMALS = {
  dog: { label: "Pes", genitive: "psa", forAnimal: "psa", subject: "pes", verb: "snědl", page: "pes" },
  cat: { label: "Kočka", genitive: "kočky", forAnimal: "kočku", subject: "kočka", verb: "snědla", page: "kocka" },
};
const TERMS = {
  chocolate: ["čokoládu", "čokoláda"], caffeine: ["kávu nebo jiný zdroj kofeinu", "kofein"],
  alcohol: ["alkohol", "alkohol"], allium: ["cibuli, česnek nebo pažitku", "cibule a česnek"],
  grapes: ["hrozny nebo rozinky", "hrozny a rozinky"], xylitol: ["výrobek s xylitolem", "xylitol"],
  "yeast-dough": ["syrové kynuté těsto", "syrové kynuté těsto"], macadamia: ["makadamové ořechy", "makadamové ořechy"],
  avocado: ["avokádo", "avokádo"], dairy: ["mléko nebo mléčný výrobek", "mléko a mléčné výrobky"],
  "fatty-foods": ["tučné jídlo", "tučná jídla"], bones: ["kost", "kosti"], salt: ["sůl", "sůl"],
  "raw-meat-eggs": ["syrové maso nebo vejce", "syrové maso a vejce"], citrus: ["citrus nebo citrusovou slupku", "citrusy"],
};
const PREVENTION = {
  caffeine: "pít kávu nebo jiný nápoj s kofeinem",
  alcohol: "pít alkohol",
  xylitol: "sníst výrobek s xylitolem",
  bones: "dostávat kosti",
  salt: "jíst velmi slané potraviny",
};

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

function slugify(value) {
  return normalise(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function resolveFood(food, animal, catalog) {
  const o = food.byAnimal?.[animal] || {};
  const sources = (o.sources || food.sources).map((k) => catalog[k] || { label: k, url: "#" });
  return { ...food, ...o, resolvedSources: sources };
}

function cardHtml(food, catalog, animal = "dog", detailedPage = false) {
  const f = resolveFood(food, animal, catalog);
  const levelLabel = LEVEL_LABELS[f.level] || f.level;
  const sources = f.resolvedSources
    .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} (EN)</a>`)
    .join("<br>");
  const animalLabel = ANIMALS[animal].forAnimal;
  const relatedIds = { chocolate: ["xylitol"], xylitol: ["chocolate"], "fatty-foods": ["macadamia"], macadamia: ["fatty-foods"] }[food.id] || [];
  const related = relatedIds.map((id) => {
    const item = data.foods.find((entry) => entry.id === id);
    return item?.animals.includes(animal) ? `<a href="/${ANIMALS[animal].page}/${esc(item.seoSlug)}/">${esc(item.name)}</a>` : "";
  }).filter(Boolean).join(", ");
  const titleTag = detailedPage ? "h2" : "h3";
  const actionHtml = detailedPage
    ? `<h3>Co udělat teď</h3><p class="card-action">${esc(f.action)}</p>`
    : `<p class="card-action"><strong>Co udělat teď</strong>: ${esc(f.action)}</p>`;
  const prepareHtml = detailedPage
    ? `<h3>Co mít po ruce</h3><p class="card-prepare">Obal nebo přesný název, odhad množství, čas požití, hmotnost zvířete a případné příznaky.</p>`
    : `<p class="card-prepare"><strong>Co mít po ruce</strong>: obal nebo přesný název, odhad množství, čas požití, hmotnost zvířete a případné příznaky.</p>`;
  const signsHtml = detailedPage
    ? `<h3>Příznaky</h3><p class="card-signs">${esc(f.signs)}</p>`
    : `<p class="card-signs"><strong>Možné příznaky</strong>: ${esc(f.signs)}</p>`;
  const sourcesHeading = detailedPage ? "<h3>Zdroje</h3>" : "";
  return [
    `<article class="food-card ${esc(f.level)}" id="jidlo-${esc(food.id)}">`,
    `<div class="card-top"><span class="badge ${esc(f.level)}">${esc(levelLabel)}</span><span class="animal-context">Pro ${esc(animalLabel)}</span></div>`,
    `<${titleTag}>${esc(f.name)}</${titleTag}>`,
    `<p class="card-summary">${esc(f.summary)}</p>`,
    actionHtml,
    `<a class="card-call-vet" data-vet-link href="#veterinar">📞 Volat veterináře</a>`,
    prepareHtml,
    signsHtml,
    `<details class="card-details"><summary>Proč je to nebezpečné</summary><p>${esc(f.riskType || "Riziko")}: ${esc(f.principle)}. Podklady: ${esc(f.evidence)}.</p></details>`,
    sourcesHeading,
    `<p class="card-source">Zdroj: ${sources}<br>Redakční kontrola zdroje: ${esc(formatCsDate(f.reviewedAt))}. <a class="card-link" href="/${ANIMALS[animal].page}/${esc(food.seoSlug)}/">Podrobná stránka</a></p>`,
    related ? `<p class="card-related">Související: ${related}</p>` : "",
    `</article>`,
  ].join("");
}

function buildStaticCards(data) {
  const dogFoods = data.foods.filter((f) => f.animals.includes("dog"));
  dogFoods.sort((a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9) || (FOOD_PRIORITY[a.id] ?? 99) - (FOOD_PRIORITY[b.id] ?? 99) || a.name.localeCompare(b.name, "cs"));
  return dogFoods.map((f) => cardHtml(f, data.sourceCatalog, "dog")).join("\n");
}

function phoneForm() {
  return `<form class="vet-phone-form" id="veterinar" aria-label="Uložit číslo veterináře"><label for="vet-phone">Uložit číslo mého veterináře</label><div><input id="vet-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Např. +420 123 456 789"><button type="submit">Uložit číslo</button></div><p class="vet-phone-status" id="vet-phone-status" role="status" aria-live="polite">Číslo zůstává uložené jen v tomto prohlížeči.</p></form>`;
}

function siteHeader() {
  return `<header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="Nekrmte.cz, domovská stránka"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><ellipse cx="24" cy="31" rx="12" ry="10"/><ellipse cx="10" cy="19" rx="4.5" ry="6"/><ellipse cx="20" cy="12" rx="4.5" ry="6"/><ellipse cx="30" cy="12" rx="4.5" ry="6"/><ellipse cx="39" cy="19" rx="4.5" ry="6"/></svg></span>Nekrmte.cz</a><nav class="site-nav" aria-label="Hlavní navigace"><a href="/pes/">Pes</a><a href="/kocka/">Kočka</a><a href="/#nouzove">Nouzově</a><a href="/o-projektu/">O projektu</a></nav><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Změnit barevný režim">◐</button></div></header>`;
}

function siteFooter() {
  return `<footer><div class="footer-inner"><nav aria-label="Odkazy v patičce"><a href="/o-projektu/">O projektu</a><a href="/metodika/">Metodika</a><a href="/metodika/#zdroje">Zdroje</a><a href="https://github.com/iksdeecz/nekrmte.cz/issues/new" target="_blank" rel="noopener noreferrer">Kontakt a nahlášení chyby</a><a href="/o-projektu/#soukromi">Ochrana soukromí</a></nav><p>© Nekrmte.cz · Podklady jsou redakčně kontrolované; nejde o veterinární atestaci.</p></div></footer>`;
}

function pageShell({ title, description, path, body, lastReviewed, reviewer, type = "WebPage" }) {
  const schema = { "@context": "https://schema.org", "@type": type, name: title, url: `https://www.nekrmte.cz${path}`, lastReviewed };
  if (reviewer?.name) schema.reviewedBy = { "@type": "Person", name: reviewer.name, ...(reviewer.url ? { url: reviewer.url } : {}) };
  return `<!doctype html>\n<html lang="cs" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(description)}"><link rel="canonical" href="https://www.nekrmte.cz${path}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${type === "Article" ? "article" : "website"}"><meta property="og:url" content="https://www.nekrmte.cz${path}"><meta property="og:image" content="https://www.nekrmte.cz/og-image.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="https://www.nekrmte.cz/og-image.png"><title>${esc(title)}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><script type="application/ld+json">${JSON.stringify(schema).replace(/<\/script/gi, "<\\/script")}</script><script src="/theme.js"></script><script src="/vet-phone.js" defer></script><link rel="stylesheet" href="/styles.css"></head><body><a class="skip-link" href="#content">Přeskočit na obsah</a>${siteHeader()}<main id="content">${body}</main>${siteFooter()}</body></html>`;
}

function pageEmergency() {
  return `<aside class="emergency" aria-labelledby="page-emergency-title"><div class="emergency-icon" aria-hidden="true">!</div><div><p class="eyebrow">Nejdřív bezpečí</p><h2 id="page-emergency-title">Zvíře kolabuje, má křeče nebo se dusí? Jeďte hned na pohotovost.</h2><p>Při podezření na nebezpečné požití volejte veterináři. Bez jeho pokynu nevyvolávejte zvracení.</p><a class="emergency-map" href="https://www.google.com/maps/search/?api=1&amp;query=nonstop+veterin%C3%A1rn%C3%AD+pohotovost" target="_blank" rel="noopener noreferrer">Najít nonstop pohotovost v okolí</a>${phoneForm()}</div></aside>`;
}

function termFor(food) {
  return TERMS[food.id] || [food.name.toLocaleLowerCase("cs"), food.name.toLocaleLowerCase("cs")];
}

function buildFoodPage(food, animal, data) {
  const species = ANIMALS[animal];
  const [accusative, term] = termFor(food);
  const title = `Co dělat, když ${species.subject} ${species.verb} ${accusative}? | Nekrmte.cz`;
  const description = `${species.label} a ${term}: přehled rizik, příznaků a toho, kdy volat veterináře. Nenalezený záznam neznamená bezpečí.`;
  const f = resolveFood(food, animal, data.sourceCatalog);
  const prevention = PREVENTION[food.id] || `jíst ${accusative}`;
  const breadcrumbs = `<nav class="breadcrumbs" aria-label="Drobečková navigace"><a href="/">Domů</a><span aria-hidden="true">›</span><a href="/${species.page}/">${esc(species.label)}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(term)}</span></nav>`;
  const body = `${pageEmergency()}<section class="editorial-page">${breadcrumbs}<p class="eyebrow">${esc(species.label)} · přehled potravin</p><h1>${esc(species.label)} ${species.verb} ${esc(accusative)}: co dělat?</h1><p>Možná jste hledali také: <strong>Může ${species.subject} ${esc(prevention)}?</strong> Záleží na přesné potravině, množství a okolnostech. Níže najdete přehled a doporučený další krok.</p>${cardHtml(food, data.sourceCatalog, animal, true)}<p><a href="/${species.page}/">Zpět na přehled pro ${esc(species.genitive)}</a></p><p class="content-date">Obsah zpracován podle uvedených zdrojů; odbornou veterinární revizi zatím nemáme doloženou.</p></section>`;
  return pageShell({ title, description, path: `/${species.page}/${food.seoSlug}/`, body, lastReviewed: f.reviewedAt, reviewer: food.vetReview });
}

function buildAnimalPage(animal, data) {
  const species = ANIMALS[animal];
  const title = `Co může ${species.subject} jíst? Přehled rizik | Nekrmte.cz`;
  const foods = data.foods.filter((food) => food.animals.includes(animal)).map((food) => ({ ...food, ...resolveFood(food, animal, data.sourceCatalog) })).sort((a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9) || (FOOD_PRIORITY[a.id] ?? 99) - (FOOD_PRIORITY[b.id] ?? 99) || a.name.localeCompare(b.name, "cs"));
  const ate = animal === "dog" ? "snědl" : "snědla";
  const body = `${pageEmergency()}<section class="editorial-page"><p class="eyebrow">Přehled potravin</p><h1>Co může ${species.subject} jíst a co dělat po požití?</h1><p>Vyberte položku pro informace o riziku, příznacích a dalším postupu. Přehled není úplný a neurčuje bezpečnou dávku. Nenalezená položka neznamená, že je bezpečná.</p><ul class="directory-list">${foods.map((food) => `<li><a href="/${species.page}/${esc(food.seoSlug)}/">${esc(food.name)}</a> <span class="badge ${esc(food.level)}">${esc(LEVEL_LABELS[food.level])}</span></li>`).join("")}</ul><p>Co dělat, když ${species.subject} něco ${ate}? <a href="/#nouzove">Nouzový postup a cesta k veterináři</a></p></section>`;
  const lastReviewed = foods.map((item) => item.reviewedAt).sort().at(-1) || data.foods[0].reviewedAt;
  return pageShell({ title, description: `Přehled rizikových potravin pro ${species.genitive}. Co dělat, když ${species.subject} něco ${ate}, a kdy volat veterináře.`, path: `/${species.page}/`, body, lastReviewed });
}

function buildEditorialPages(data) {
  const lastReviewed = data.meta.lastModified || data.foods[0].reviewedAt;
  const aboutBody = `<article class="editorial-page"><p class="eyebrow">Nekrmte.cz</p><h1>O projektu</h1><p>Nekrmte.cz je rychlý orientační přehled pro situaci, kdy pes nebo kočka snědli něco nevhodného. Nenahrazuje veterinární vyšetření, neurčuje bezpečnou dávku a nepokrývá všechny potraviny, léky, rostliny ani chemikálie.</p><h2>Jak obsah vzniká</h2><p>U každé položky uvádíme zdroj a datum redakční kontroly. Toto datum označuje kontrolu veřejných podkladů, nikoli veterinární atestaci. Odbornou veterinární recenzi zatím nemáme doloženou a autora ani recenzenta proto neuvádíme.</p><p>Pokud požití může být nebezpečné, kontaktujte veterináře. Bez jeho pokynu nevyvolávejte zvracení ani nepodávejte domácí protijedy.</p><p><a href="/metodika/">Přečíst metodiku v češtině</a> · <a href="https://github.com/iksdeecz/nekrmte.cz/issues/new" target="_blank" rel="noopener noreferrer">Kontaktovat projekt, nahlásit chybu nebo navrhnout doplnění</a></p><h2 id="soukromi">Ochrana soukromí</h2><p>Telefonní číslo veterináře se ukládá pouze do místního úložiště prohlížeče a web ho neodesílá. Návrhy obsahu se otevírají jako nové hlášení na GitHubu; před odesláním je můžete zkontrolovat.</p></article>`;
  const methodologyBody = `<article class="editorial-page"><p class="eyebrow">Jak číst přehled</p><h1>Metodika a zdroje</h1><p>Rozlišujeme <strong>typ rizika</strong> (čím může poškození vzniknout) a <strong>naléhavost</strong> (jak rychle kontaktovat veterináře). Barevné štítky vždy doplňuje text.</p><h2>Jak vyhledáváme</h2><p>Hledání nerozlišuje velikost písmen ani diakritiku a zohledňuje přesné názvy a synonyma. Obecný výrobek, například žvýkačka, se nepovažuje za důkaz obsahu rizikové látky bez kontroly složení.</p><h2>Kontrola podkladů</h2><p>Datum u položky označuje redakční kontrolu zdroje, ne veterinární posouzení. Odkazy označené EN vedou na stránky v angličtině; karta obsahuje české shrnutí.</p><h2 id="zdroje">Zdroje</h2><ul><li><a href="https://www.merckvetmanual.com/" target="_blank" rel="noopener noreferrer">Merck Veterinary Manual (EN)</a></li><li><a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer">ASPCA Animal Poison Control (EN)</a></li><li><a href="https://www.vet.cornell.edu/hospitals/pharmacy/consumer-clinical-care-guidelines-animals/small-animal-toxins" target="_blank" rel="noopener noreferrer">Cornell University College of Veterinary Medicine (EN)</a></li><li><a href="https://www.petpoisonhelpline.com/" target="_blank" rel="noopener noreferrer">Pet Poison Helpline (EN)</a></li></ul><p>Podrobnější pravidla a výběr zdrojů: <a href="https://github.com/iksdeecz/nekrmte.cz/blob/main/docs/METODIKA.md" target="_blank" rel="noopener noreferrer">úplná metodika na GitHubu</a>.</p><h2>Omezení</h2><p>Neuvádíme bezpečné dávky ani individuální diagnózu. U neznámého požití, léku, rostliny nebo chemikálie volejte veterináři i tehdy, když přehled nic nenajde.</p></article>`;
  return {
    "public/o-projektu/index.html": pageShell({ title: "O projektu a redakční pravidla | Nekrmte.cz", description: "Jak vzniká obsah Nekrmte.cz, jaké jsou jeho limity a jak nahlásit chybu.", path: "/o-projektu/", body: aboutBody, lastReviewed }),
    "public/metodika/index.html": pageShell({ title: "Metodika a zdroje | Nekrmte.cz", description: "Jak Nekrmte.cz hodnotí zdroje, naléhavost a omezení vyhledávání.", path: "/metodika/", body: methodologyBody, lastReviewed }),
  };
}

function generatedFiles(data) {
  const files = buildEditorialPages(data);
  for (const animal of Object.keys(ANIMALS)) {
    files[`public/${ANIMALS[animal].page}/index.html`] = buildAnimalPage(animal, data);
    for (const food of data.foods.filter((item) => item.animals.includes(animal))) {
      files[`public/${ANIMALS[animal].page}/${food.seoSlug}/index.html`] = buildFoodPage(food, animal, data);
    }
  }
  return files;
}

function buildSitemap(data) {
  const date = data.meta.lastModified || data.foods[0].reviewedAt;
  const paths = ["/", "/pes/", "/kocka/", "/o-projektu/", "/metodika/"];
  for (const animal of Object.keys(ANIMALS)) {
    for (const food of data.foods.filter((item) => item.animals.includes(animal))) paths.push(`/${ANIMALS[animal].page}/${food.seoSlug}/`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `<url><loc>https://www.nekrmte.cz${path}</loc><lastmod>${date}</lastmod></url>`).join("\n")}\n</urlset>\n`;
}

function writeGeneratedFiles(files, check = false) {
  const stale = [];
  for (const [relativePath, content] of Object.entries(files)) {
    const outputPath = resolve(root, relativePath);
    if (check) {
      if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== content) stale.push(relativePath);
    } else {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, content);
    }
  }
  if (stale.length) throw new Error(`Vygenerované stránky jsou zastaralé: ${stale.join(", ")}`);
}

const raw = readFileSync(dataPath, "utf8");
const data = JSON.parse(raw);
const slugOwners = new Set();
for (const food of data.foods) {
  food.seoSlug = slugify(food.aliases?.[0] || food.id);
  if (!food.seoSlug || slugOwners.has(food.seoSlug)) throw new Error(`SEO slug chybí nebo se opakuje: ${food.seoSlug}`);
  slugOwners.add(food.seoSlug);
}
const jsonEmbed = `<script type="application/json" id="foods-data">\n${JSON.stringify(data).replace(/<\/script/gi, "<\\/script")}\n</script>`;
const staticCards = buildStaticCards(data);
const sitemap = buildSitemap(data);
const generated = generatedFiles(data);
const latestReviewed = data.foods.map((food) => food.reviewedAt).sort().at(-1) || data.meta.lastModified;
const rootSchema = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "Co když pes nebo kočka snědli něco nevhodného? | Nekrmte.cz", url: "https://www.nekrmte.cz/", lastReviewed: latestReviewed })}</script>`;

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
const SCHEMA_START = "<!-- PAGE:SCHEMA:START -->";
const SCHEMA_END = "<!-- PAGE:SCHEMA:END -->";

if (!html.includes(DATA_START) || !html.includes(STATIC_START) || !html.includes(SCHEMA_START)) {
  console.error("index.html neobsahuje všechny generovací markery.");
  process.exit(1);
}

const next = replaceBetween(
  replaceBetween(
    replaceBetween(html, DATA_START, DATA_END, jsonEmbed),
    STATIC_START, STATIC_END, staticCards
  ),
  SCHEMA_START, SCHEMA_END, rootSchema
);

if (process.argv.includes("--check")) {
  if (next !== html) {
    console.error("index.html je zastaralé vůči data/foods.json (spusťte npm run build).");
    process.exit(1);
  } else {
    console.log("index.html je aktuální.");
  }
  const sitemapPath = resolve(root, "sitemap.xml");
  if (!existsSync(sitemapPath) || readFileSync(sitemapPath, "utf8") !== sitemap) {
    console.error("sitemap.xml je zastaralý (spusťte npm run build).");
    process.exit(1);
  }
  checkPublicDir(root);
  writeGeneratedFiles(generated, true);
} else {
  writeFileSync(htmlPath, next);
  writeFileSync(resolve(root, "sitemap.xml"), sitemap);
  console.log(`Vygenerováno: ${data.foods.length} položek, statické karty pro psa.`);
  syncPublicDir(root);
  writeGeneratedFiles(generated);
  console.log(`Vygenerováno ${Object.keys(generated).length} statických vstupních a obsahových stránek.`);
}

// public/ je jediný adresář, který Cloudflare Workers nahrává (wrangler.jsonc
// -> assets.directory). Bez toho by při assets.directory="." nahrál i
// node_modules (workerd ~129 MiB) a .git a build by padl na limitu 25 MiB.
function syncPublicDir(rootDir) {
  const files = [
    "index.html",
    "app.js",
    "styles.css",
    "theme.js",
    "vet-phone.js",
    "favicon.svg",
    "og-image.svg",
    "og-image.png",
    "robots.txt",
    "sitemap.xml",
    "lib/search.mjs",
  ];
  for (const f of files) {
    const src = resolve(rootDir, f);
    const dest = resolve(rootDir, "public", f);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
  }
  console.log(`Zkopírováno do public/: ${files.length} souborů.`);
}

function checkPublicDir(rootDir) {
  const files = [
    "index.html",
    "app.js",
    "styles.css",
    "theme.js",
    "vet-phone.js",
    "favicon.svg",
    "og-image.svg",
    "og-image.png",
    "robots.txt",
    "sitemap.xml",
    "lib/search.mjs",
  ];
  const stale = [];
  for (const f of files) {
    const src = resolve(rootDir, f);
    const dest = resolve(rootDir, "public", f);
    let a, b;
    try {
      a = readFileSync(src, "utf8");
    } catch {
      stale.push(`${f} (chybí zdroj)`);
      continue;
    }
    try {
      b = readFileSync(dest, "utf8");
    } catch {
      stale.push(`${f} (chybí v public/)`);
      continue;
    }
    if (a !== b) stale.push(f);
  }
  if (stale.length) {
    console.error(`public/ je zastaralé vůči kořenu (spusťte npm run build): ${stale.join(", ")}`);
    process.exit(1);
  } else {
    console.log("public/ je aktuální.");
  }
}
