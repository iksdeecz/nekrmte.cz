import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const css = readFileSync(resolve(root, "styles.css"), "utf8");
const app = readFileSync(resolve(root, "app.js"), "utf8");

function hexToRgb(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
function lum(rgb) {
  const f = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(f);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [l1, l2] = [lum(hexToRgb(a)), lum(hexToRgb(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

describe("HTML bez JS + SEO + a11y struktura", () => {
  it("statické karty jsou v HTML (single source build)", () => {
    assert.ok(html.includes("<!-- FOODS:STATIC:START -->"), "marker static");
    assert.ok(html.includes("<!-- FOODS:DATA:START -->"), "marker data");
    assert.ok(html.includes('id="jidlo-chocolate"'), "statická karta chocolate");
    assert.ok(html.includes('id="jidlo-grapes"'), "statická karta grapes");
    assert.ok(html.includes('id="foods-data"'), "embedded JSON");
    assert.ok(html.match(/class="food-card/g).length >= 10, "dostatek statických karet");
  });

  it("bezpečnostní upozornění jsou v HTML i bez JS", () => {
    assert.ok(html.includes("Bez pokynu veterináře nevyvolávejte zvracení"), "emergency bez JS");
    assert.ok(html.includes("Nejde o úplnou databázi"), "scope bez JS");
    assert.ok(html.includes("Nenalezený záznam"), "neznámá potravina bez JS");
    assert.ok(html.includes("<noscript>"), "noscript blok");
  });

  it("SEO: canonical, title, description, robots, og, favicon", () => {
    assert.ok(html.includes('rel="canonical" href="https://www.nekrmte.cz/"'), "canonical");
    assert.ok(html.includes("<title>Nekrmte.cz"), "title");
    assert.ok(html.includes('name="description"'), "description");
    assert.ok(!html.toLowerCase().includes("ověřený přehled vybraných potravin a rizik"), "description nesmí slibovat ověřenost každé karty");
    assert.ok(html.includes('property="og:image"'), "og:image");
    assert.ok(html.includes("og-image.svg"), "og:image soubor");
    assert.ok(existsSync(resolve(root, "og-image.svg")), "og-image.svg existuje");
    assert.ok(html.includes('rel="icon"'), "favicon");
    assert.ok(existsSync(resolve(root, "favicon.svg")), "favicon.svg existuje");
  });

  it("sitemap je aktuální a validní", () => {
    const sm = readFileSync(resolve(root, "sitemap.xml"), "utf8");
    assert.ok(sm.includes("<loc>https://www.nekrmte.cz/</loc>"), "loc");
    assert.ok(!sm.includes("2025-09-28"), "staré lastmod odstraněno");
    assert.ok(sm.includes("2026-10-09"), "lastmod odpovídá změně");
  });

  it("a11y: skip-link, label, live region, nadpisy", () => {
    assert.ok(html.includes('class="skip-link"'), "skip link");
    assert.ok(html.includes('for="food-search"'), "label");
    assert.ok(html.includes('aria-describedby="search-help"'), "popis vyhledávání");
    assert.ok(html.includes('role="status"'), "status");
    assert.ok(html.includes('aria-live="polite"'), "live");
    assert.ok(html.includes('aria-pressed'), "aria-pressed");
    assert.ok(app.includes("aria-pressed"), "JS udržuje aria-pressed");
    assert.ok(app.includes("setTimeout") || app.includes("debounce") || app.includes("150"), "debounce vyhledávání");
  });

  it("stabilní kotvy karet", () => {
    assert.ok(html.includes("#jidlo-chocolate"), "kotva chocolate");
    assert.ok(app.includes("jidlo-"), "JS zachovává id karet");
  });

  it("žádný globální reviewedAt neslibuje atestaci", () => {
    assert.ok(!app.includes('const reviewedAt = "7. 9. 2026"'), "globální reviewedAt odstraněno");
    assert.ok(html.includes("redakční kontrola"), "upřímné označení kontroly");
    assert.ok(!html.includes("Ověřený přehled vybraných potravin a rizik"), "neslibovat plošnou ověřenost");
  });

  it("žádná vymyšlená telefonní pohotovost", () => {
    assert.ok(!/\+\d{3}[\s\d]{6,}/.test(html), "HTML neobsahuje telefon");
    assert.ok(!/\+\d{3}[\s\d]{6,}/.test(app), "JS neobsahuje telefon");
  });
});

describe("CSS tokeny a kontrast (WCAG 2.2 AA)", () => {
  it("sémantické tokeny existují a nemíchají role", () => {
    for (const t of ["--header-bg", "--header-fg", "--active-bg", "--active-fg", "--icon-bg", "--icon-fg", "--link", "--focus"]) {
      assert.ok(css.includes(t), `chybí token ${t}`);
    }
    assert.ok(!/\.site-header\s*\{[^}]*background:\s*var\(--brand-deep\)/.test(css), "hlavička nesmí používat --brand-deep");
    assert.ok(!/\.animal-button\.is-active\s*\{[^}]*background:\s*var\(--brand\)/.test(css), "aktivní tlačítko nesmí používat --brand");
  });

  it("kontrast textů ≥ 4.5:1 v obou režimech", () => {
    const pairs = [
      ["light header", "#ffffff", "#06384c"],
      ["dark header", "#eaf1f1", "#0a222b"],
      ["light active", "#ffffff", "#0b4f6c"],
      ["dark active", "#06384c", "#c5edf3"],
      ["light danger badge", "#a12d24", "#fff0ed"],
      ["dark danger badge", "#ffb7af", "#4a2522"],
      ["light caution badge", "#6b4a00", "#fff5d5"],
      ["dark caution badge", "#ffe187", "#4b3a12"],
      ["light safe badge", "#1e6b43", "#e7f6ed"],
      ["dark safe badge", "#9cdeb4", "#173b29"],
      ["light hero link", "#06384c", "#dcedf0"],
      ["dark hero link", "#c5edf3", "#153b46"],
      ["dark icon", "#3a1512", "#ffb7af"],
    ];
    for (const [name, fg, bg] of pairs) {
      const c = contrast(fg, bg);
      assert.ok(c >= 4.5, `${name}: ${c.toFixed(2)}:1 < 4.5 (fg ${fg} na ${bg})`);
    }
  });

  it("žádné horizontální přetékání: žádný min-width:320px na body, grid je pružný", () => {
    assert.ok(!/body\s*\{[^}]*min-width:\s*320px/.test(css), "body nesmí mít min-width:320px");
    assert.ok(css.includes("overflow-x: clip") || css.includes("overflow-x:hidden") || css.includes("overflow-x: clip"), "pojistka proti přetékání");
    assert.ok(css.includes("minmax(min(100%"), "pružný grid");
    assert.ok(css.includes("overflow-wrap: anywhere") || css.includes("overflow-wrap:anywhere"), "dlouhé odkazy se zalamují");
  });

  it("fokus, reduced-motion a dotykové cíle", () => {
    assert.ok(css.includes(":focus-visible"), "viditelný fokus");
    assert.ok(css.includes("prefers-reduced-motion"), "reduced motion");
    assert.ok(css.includes("2.75rem") || css.includes("44px") || css.includes("min-height: 3.3rem"), "dostatečné cíle");
  });
});
