import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { filterFoods, normalise } from "../lib/search.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(resolve(root, "data/foods.json"), "utf8"));

describe("vyhledávání", () => {
  it("diakritika i bez diakritiky", () => {
    const withDia = filterFoods(data.foods, "dog", "čokoláda");
    const without = filterFoods(data.foods, "dog", "cokolada");
    assert.ok(withDia.some((f) => f.id === "chocolate"));
    assert.ok(without.some((f) => f.id === "chocolate"));
    assert.equal(withDia.map((f) => f.id).sort().join(), without.map((f) => f.id).sort().join());
  });

  it("částečné výrazy", () => {
    assert.ok(filterFoods(data.foods, "dog", "čokol").some((f) => f.id === "chocolate"));
    assert.ok(filterFoods(data.foods, "dog", "kakao").some((f) => f.id === "chocolate"));
  });

  it("hledání příznaku nabídne relevantní karty", () => {
    const res = filterFoods(data.foods, "dog", "třes");
    assert.ok(res.length >= 2, "třes musí najít více karet");
    assert.ok(res.some((f) => f.id === "chocolate"));
  });

  it("hledání rizikové látky", () => {
    assert.ok(filterFoods(data.foods, "dog", "theobromin").some((f) => f.id === "chocolate"));
    assert.ok(filterFoods(data.foods, "dog", "xylitol").some((f) => f.id === "xylitol"));
    assert.ok(filterFoods(data.foods, "dog", "E967").some((f) => f.id === "xylitol"));
  });

  it("výsledky odpovídají druhu zvířete", () => {
    const dogAll = filterFoods(data.foods, "dog", "");
    const catAll = filterFoods(data.foods, "cat", "");
    assert.ok(dogAll.some((f) => f.id === "macadamia"), "makadamie je pro psa");
    assert.ok(!catAll.some((f) => f.id === "macadamia"), "makadamie se nesmí ukázat pro kočku");
    const grapesCat = filterFoods(data.foods, "cat", "hrozny");
    assert.ok(grapesCat.some((f) => f.id === "grapes"));
    assert.equal(grapesCat.find((f) => f.id === "grapes").level, "caution", "kočka: hrozny jsou caution, ne danger");
  });

  it("prázdný dotaz vrátí vše pro zvíře, seřazeno danger→caution→safe", () => {
    const res = filterFoods(data.foods, "dog", "");
    assert.equal(res.length, 15, "pes má 15 položek");
    const order = { danger: 0, caution: 1, safe: 2 };
    for (let i = 1; i < res.length; i++) {
      assert.ok(order[res[i - 1].level] <= order[res[i].level], "řazení podle naléhavosti");
    }
  });

  it("jeden výsledek vs. více vs. žádný", () => {
    assert.equal(filterFoods(data.foods, "dog", "theobromin").length >= 1, true);
    assert.equal(filterFoods(data.foods, "dog", "xyzn neexistuje 123").length, 0);
    assert.ok(filterFoods(data.foods, "dog", "zvracení").length > 1, "zvracení je v mnoha kartách");
  });

  it("nenalezený záznam není bezpečný (prázdný výsledek + UI text)", () => {
    const res = filterFoods(data.foods, "dog", "neexistující potravina");
    assert.equal(res.length, 0);
    const app = readFileSync(resolve(root, "app.js"), "utf8");
    assert.ok(
      /neznamená, že je (potravina bezpečná|to bezpečné)|Nenalezený záznam neznamená/i.test(app) ||
        app.includes("neznamená, že je potravina bezpečná") ||
        app.includes("Nenalezený záznam"),
      "app.js musí u prázdného výsledku uvést, že to neznamená bezpečnost"
    );
    assert.ok(!res.some((f) => f.level === "safe"), "prázdný výsledek nesmí nést klasifikaci safe");
  });

  it("normalise je stabilní", () => {
    assert.equal(normalise("Čokoláda"), normalise("cokolada"));
    assert.equal(normalise("Káva"), normalise("kava"));
  });
});
