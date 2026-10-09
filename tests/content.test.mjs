import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateFoods, normalise } from "../lib/search.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(resolve(root, "data/foods.json"), "utf8"));

describe("content model", () => {
  it("validateFoods hlásí 0 chyb", () => {
    const errors = validateFoods(data);
    assert.deepEqual(errors, [], `Chyby modelu:\n${errors.join("\n")}`);
  });

  it("rybíz se nepřiřadí ke hroznům/rozinkám", () => {
    const grapes = data.foods.find((f) => f.id === "grapes");
    const allAliases = (grapes.aliases || []).map(normalise);
    assert.ok(!allAliases.some((a) => a.includes("rybiz")), "grapes nesmí obsahovat alias rybíz");
    assert.ok(
      normalise(grapes.summary).includes("ribes") || normalise(grapes.summary).includes("zante"),
      "karta hroznů musí rozlišit Ribes vs. Zante currants"
    );
  });

  it("rozinky najdou správnou kartu (i bez diakritiky)", async () => {
    const { filterFoods } = await import("../lib/search.mjs");
    for (const q of ["rozinky", "rozinka", "hrozny", "ROZINKY", "rozínky"]) {
      const res = filterFoods(data.foods, "dog", q);
      assert.ok(res.some((f) => f.id === "grapes"), `dotaz "${q}" musí najít grapes`);
    }
    const rybiz = filterFoods(data.foods, "dog", "rybíz");
    assert.ok(!rybiz.some((f) => f.id === "grapes"), "rybíz nesmí vrátit grapes");
  });

  it("obecné arašídové máslo není klasifikováno jako xylitol", async () => {
    const { filterFoods } = await import("../lib/search.mjs");
    const xyl = data.foods.find((f) => f.id === "xylitol");
    const aliases = (xyl.aliases || []).map(normalise);
    for (const generic of ["arasidove maslo", "proteinova tycinka", "zvykacka", "sladkosti", "zubni pasta"]) {
      assert.ok(
        !aliases.includes(normalise(generic)),
        `xylitol nesmí mít generický alias "${generic}"`
      );
    }
    const res = filterFoods(data.foods, "dog", "arašídové máslo");
    assert.ok(!res.some((f) => f.id === "xylitol"), "arašídové máslo nesmí vrátit xylitol jako jistý nález");
    assert.ok(
      normalise(xyl.summary).includes("slozeni") || normalise(xyl.summary).includes("složení") || normalise(xyl.summary).includes("slozeni"),
      "xylitol karta musí vyžadovat kontrolu složení"
    );
  });

  it("odstraněny další zavádějící aliasy", () => {
    const get = (id) => data.foods.find((f) => f.id === id);
    const norm = (arr) => (arr || []).map(normalise);
    assert.ok(!norm(get("grapes").aliases).includes(normalise("vánočka")), "vánočka pryč z grapes");
    assert.ok(!norm(get("grapes").aliases).includes(normalise("štola")), "štola pryč z grapes");
    assert.ok(!norm(get("macadamia").aliases).some((a) => a.includes("cokolade")), "ořechy v čokoládě pryč z macadamia");
    assert.ok(!norm(get("raw-meat-eggs").aliases).includes(normalise("kuřecí maso")) || norm(get("raw-meat-eggs").aliases).includes(normalise("syrové kuřecí maso")), "holé kuřecí maso nesmí být aliasem syrového");
    assert.ok(!norm(get("salt").aliases).includes(normalise("slaný")) || norm(get("salt").aliases).some((a) => a.length > 6), "holé slaný odstraněno");
    assert.ok(!norm(get("fatty-foods").aliases).includes(normalise("ořechy")) || norm(get("fatty-foods").aliases).includes(normalise("vlašské ořechy")), "holé ořechy nemá být samostatný alias");
    assert.ok(!norm(get("caffeine").aliases).includes(normalise("cola")), "cola odstraněna z kofeinu");
  });

  it("každá karta má data, zdroj, datum a typ rizika", () => {
    for (const f of data.foods) {
      assert.ok(f.id && f.name, `${f.id}: jméno`);
      assert.ok(f.riskType, `${f.id}: chybí riskType`);
      assert.ok(f.reviewedAt, `${f.id}: chybí reviewedAt`);
      assert.equal(f.vetReview, null, `${f.id}: vetReview musí být null (nevymýšlet recenzenta)`);
      assert.ok(Array.isArray(f.sources) && f.sources.length, `${f.id}: zdroj`);
      for (const s of f.sources) {
        const cat = data.sourceCatalog[s];
        assert.ok(cat, `${f.id}: neznámý zdroj ${s}`);
        assert.ok(/^https:\/\//.test(cat.url), `${f.id}: zdroj ${s} není https`);
      }
    }
  });

  it("žádné nechtěné duplicity aliasů", () => {
    const seen = new Map();
    for (const f of data.foods) {
      for (const a of f.aliases || []) {
        const n = normalise(a);
        if (seen.has(n)) {
          assert.fail(`alias "${a}" (${f.id}) koliduje s ${seen.get(n)}`);
        }
        seen.set(n, f.id);
      }
    }
  });

  it("důkazy pro psy vs. kočky jsou rozlišeny", () => {
    const grapes = data.foods.find((f) => f.id === "grapes");
    const xyl = data.foods.find((f) => f.id === "xylitol");
    assert.match(grapes.evidence, /psů/i);
    assert.ok(grapes.byAnimal?.cat?.evidence, "grapes musí mít cat evidence");
    assert.ok(xyl.byAnimal?.cat, "xylitol musí mít cat override");
  });
});
