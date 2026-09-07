(() => {
  "use strict";

  const reviewedAt = "7. 9. 2026";
  const sources = {
    aspca: ["ASPCA · People Foods to Avoid Feeding Your Pets", "https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets"],
    merckFoods: ["Merck Veterinary Manual · Food Hazards", "https://www.merckvetmanual.com/special-pet-topics/poisoning/food-hazards"],
    merckGrapes: ["Merck Veterinary Manual · Grape and Raisin Toxicosis", "https://www.merckvetmanual.com/toxicology/food-hazards/grape-raisin-and-tamarind-vitis-spp-tamarindus-spp-toxicosis-in-dogs"],
    merckChocolate: ["Merck Veterinary Manual · Chocolate Toxicosis", "https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-toxicosis-in-animals"],
    cornell: ["Cornell University · Small Animal Toxins", "https://www.vet.cornell.edu/hospitals/pharmacy/consumer-clinical-care-guidelines-animals/small-animal-toxins"],
    cornellCats: ["Cornell University · Feeding Your Cat", "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feeding-your-cat"],
    poisonHelp: ["Pet Poison Helpline · Avocado", "https://www.petpoisonhelpline.com/poison/avocado/"]
  };

  // Content model: aliases, species-specific facts, evidence and review date are mandatory.
  const foods = [
    {
      id: "chocolate",
      name: "Čokoláda a kakao",
      aliases: ["kakao", "čokoládový", "brownie", "kakaový prášek", "theobromin"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo",
      principle: "theobromin a kofein",
      summary: "Tmavá, pečicí čokoláda a kakao jsou koncentrovanější než mléčná; riziko závisí na druhu výrobku a množství.",
      signs: "zvracení, neklid, třes, zrychlený nebo nepravidelný tep, záchvaty",
      action: "Zavolejte veterináři a mějte po ruce obal, druh čokolády, množství, čas požití a hmotnost zvířete.",
      source: sources.merckChocolate
    },
    {
      id: "caffeine",
      name: "Káva, čaj a kofein",
      aliases: ["kafe", "espresso", "kávová sedlina", "energetický nápoj", "energy drink", "cola", "guarana", "kofeinové tablety"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo",
      principle: "kofein (methylxanthin)",
      summary: "Kofein je stimulant; koncentrované zdroje jako sedlina, tablety a energetické nápoje představují vyšší riziko.",
      signs: "neklid, zvracení, zrychlený tep, třes, záchvaty",
      action: "Kontaktujte veterináře bez čekání na příznaky; vezměte s sebou obal nebo informaci o koncentraci.",
      source: sources.cornell
    },
    {
      id: "alcohol",
      name: "Alkohol",
      aliases: ["pivo", "víno", "likér", "panák", "etanol", "alkoholický nápoj"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo",
      principle: "etanol",
      summary: "Alkohol se rychle vstřebává. Rizikové mohou být také výrobky a potraviny obsahující alkohol.",
      signs: "zvracení, nekoordinovanost, útlum, potíže s dýcháním, třes, kóma",
      action: "Vyhledejte veterinární pomoc ihned; při poruše vědomí, křečích či dýchání jeďte na pohotovost.",
      source: sources.aspca
    },
    {
      id: "allium",
      name: "Cibule, česnek a pažitka",
      aliases: ["cibule", "česnek", "pórek", "šalotka", "pažitka", "cibulový prášek", "česnekový prášek", "allium"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo",
      principle: "sloučeniny rodu Allium poškozující červené krvinky",
      summary: "Rizikové jsou čerstvé, sušené i práškové formy a ochucená hotová jídla. Kočky jsou citlivější, riziko však existuje i u psů.",
      signs: "zažívací potíže, únava, bledé sliznice, zrychlené dýchání nebo tep",
      action: "Zavolejte veterináři, zvlášť po požití koncentrované nebo neznámé dávky; příznaky anémie se mohou objevit později.",
      source: sources.aspca
    },
    {
      id: "grapes",
      name: "Hrozny a rozinky",
      aliases: ["hrozny", "rozinky", "vinné hrozny", "sušené hrozny", "rybíz", "vánočka", "štola"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo u psů",
      principle: "pravděpodobně kyselina vinná; obsah se mezi plody liší",
      summary: "U psů mohou hrozny a rozinky vést k akutnímu poškození ledvin. Nelze spolehlivě určit bezpečné množství.",
      signs: "zvracení nebo průjem, letargie, nechutenství, žízeň; následně potíže s ledvinami",
      action: "U psa kontaktujte veterináře ihned, i když snědl malé množství a zatím nemá příznaky.",
      source: sources.merckGrapes,
      byAnimal: {
        cat: {
          level: "caution",
          evidence: "omezené podklady u koček",
          summary: "Závažné případy jsou dobře popsány u psů. U koček existují anekdotická hlášení, ale nejsou publikované případy; neznamená to, že je požití bezpečné.",
          signs: "zvracení, průjem, letargie nebo jiné potíže po požití",
          action: "Zavolejte veterináři a sdělte množství a čas požití; postup se určuje individuálně."
        }
      }
    },
    {
      id: "xylitol",
      name: "Xylitol ve sladkostech a žvýkačkách",
      aliases: ["xylitol", "březový cukr", "žvýkačka", "bonbon bez cukru", "sladkosti", "zubní pasta", "proteinová tyčinka", "arašídové máslo"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo u psů",
      principle: "xylitol",
      summary: "Xylitol se objevuje v žvýkačkách, bonbonech, pečivu, zubních pastách a některých ořechových máslech. U psů může rychle vyvolat hypoglykemii a ve vyšších dávkách poškození jater.",
      signs: "zvracení, slabost, nekoordinovanost, útlum, záchvaty",
      action: "U psa volejte veterináři okamžitě. Nevyvolávejte doma zvracení ani nečekejte na příznaky.",
      source: sources.merckFoods,
      byAnimal: {
        cat: {
          level: "caution",
          evidence: "nejasné specifické riziko u koček",
          summary: "Závažný účinek xylitolu je doložen především u psů. U kočky může výrobek obsahovat i jiné problémové složky, proto ověřte složení a volejte veterináři.",
          signs: "záleží na výrobku, množství a dalších složkách",
          action: "Kontaktujte veterináře s názvem a složením výrobku; neodhadujte riziko jen podle toho, že kočka vypadá v pořádku.",
          source: sources.cornell
        }
      }
    },
    {
      id: "yeast-dough",
      name: "Syrové kynuté těsto",
      aliases: ["kynuté těsto", "droždí", "kvásek", "těsto na chleba", "syrové těsto", "pizza těsto"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo",
      principle: "rozpínání těsta a tvorba etanolu",
      summary: "Těsto se může v žaludku dále rozpínat a při kvašení vytváří alkohol. Jde o mechanické i toxikologické riziko.",
      signs: "nafouklé břicho, neúspěšné dávení, útlum, nekoordinovanost, třes",
      action: "Volejte veterináři ihned; při nafouknutém břiše, útlumu nebo dávení jeďte rovnou na pohotovost.",
      source: sources.merckFoods
    },
    {
      id: "macadamia",
      name: "Makadamové ořechy",
      aliases: ["makadamie", "macadamia", "makadamové", "ořechy v čokoládě"],
      animals: ["dog"],
      level: "danger",
      evidence: "dobře doloženo u psů",
      principle: "neobjasněný toxin; vysoký obsah tuku je další riziko",
      summary: "Onemocnění po makadamiových ořeších je popsané u psů. Často se objeví slabost, nekoordinovanost a třes.",
      signs: "slabost, zvracení, nekoordinovanost, třes, zvýšená teplota",
      action: "Kontaktujte veterináře; sdělte množství a zda výrobek obsahoval čokoládu, xylitol nebo další složky.",
      source: sources.merckFoods
    },
    {
      id: "avocado",
      name: "Avokádo",
      aliases: ["avokádo", "avocado", "guacamole", "pecka avokáda"],
      animals: ["dog", "cat"],
      level: "safe",
      evidence: "dobře doloženo pro psy a kočky",
      principle: "nejde o systémový toxin pro psy a kočky; rizikem je pecka a obsah tuku",
      summary: "Dužina avokáda není pro psy a kočky považována za toxickou. Pecka však může způsobit neprůchodnost a vysoký obsah tuku může vyvolat zažívací obtíže.",
      signs: "zvracení, průjem, bolest břicha; po spolknutí pecky také známky neprůchodnosti",
      action: "Po spolknutí pecky, větším množství nebo při potížích kontaktujte veterináře. Avokádo nepodávejte ptákům, králíkům ani hospodářským zvířatům.",
      source: sources.poisonHelp
    },
    {
      id: "dairy",
      name: "Mléko a mléčné výrobky",
      aliases: ["mléko", "smetana", "sýr", "jogurt", "zmrzlina", "laktóza"],
      animals: ["dog", "cat"],
      level: "caution",
      evidence: "dobře doloženo",
      principle: "laktóza a často také vysoký obsah tuku",
      summary: "Mnohá zvířata mají málo enzymu laktázy, a mléčné výrobky jim proto mohou způsobit zažívací potíže. Nejde obvykle o akutní otravu.",
      signs: "průjem, zvracení, plynatost nebo bolest břicha",
      action: "Sledujte zvíře a nabídněte vodu. Při opakovaném zvracení, průjmu nebo požití výrobku s dalšími rizikovými složkami volejte veterináři.",
      source: sources.aspca,
      byAnimal: { cat: { source: sources.cornellCats } }
    },
    {
      id: "fatty-foods",
      name: "Tučná jídla a běžné ořechy",
      aliases: ["tučné maso", "výpek", "slaninový tuk", "ořechy", "vlašské ořechy", "pekany", "mandle", "mastné jídlo"],
      animals: ["dog", "cat"],
      level: "caution",
      evidence: "dobře doloženo",
      principle: "vysoký obsah tuků; podle výrobku i další složky",
      summary: "Tučná lidská jídla a některé ořechy mohou vyvolat zvracení, průjem a u citlivých zvířat i zánět slinivky. Makadamové ořechy mají vlastní kartu.",
      signs: "zvracení, průjem, bolest břicha, nechutenství, apatie",
      action: "Pokud zvíře snědlo větší porci, má bolest břicha nebo opakovaně zvrací, kontaktujte veterináře.",
      source: sources.aspca
    },
    {
      id: "bones",
      name: "Kosti",
      aliases: ["kost", "kuřecí kost", "vařená kost", "grilovací kost", "rybí kost", "kost z vývaru"],
      animals: ["dog", "cat"],
      level: "danger",
      evidence: "dobře doloženo",
      principle: "mechanické poranění nebo neprůchodnost, nikoli klasický toxin",
      summary: "Kosti se mohou zaseknout, způsobit poranění nebo neprůchodnost zažívacího traktu. Riziko se týká i kostí podávaných jako pamlsek.",
      signs: "dávení, slinění, zvracení, bolest břicha, namáhavé vyprazdňování nebo apatie",
      action: "Při spolknutí větší kosti, dávení nebo potížích volejte veterináři. Nezkoušejte kost vytahovat ani vyvolávat zvracení.",
      source: sources.aspca
    },
    {
      id: "salt",
      name: "Sůl a velmi slané potraviny",
      aliases: ["sůl", "slaný", "chipsy", "preclíky", "solené ořechy", "slaný nálev", "mořská voda"],
      animals: ["dog", "cat"],
      level: "caution",
      evidence: "dobře doloženo",
      principle: "nadbytek sodíku",
      summary: "Nadměrné množství soli může narušit rovnováhu elektrolytů. Samotné ochutnání obvykle neznamená stejnou situaci jako velká dávka nebo slaný nálev.",
      signs: "silná žízeň, zvracení, průjem, útlum, třes nebo záchvaty",
      action: "Při větším množství, vypití slaného nálevu nebo jakýchkoli neurologických příznacích volejte veterináři ihned.",
      source: sources.aspca
    },
    {
      id: "raw-meat-eggs",
      name: "Syrové maso a vejce",
      aliases: ["syrové maso", "syrové vejce", "tatarák", "kuřecí maso", "raw dieta"],
      animals: ["dog", "cat"],
      level: "caution",
      evidence: "dobře doloženo",
      principle: "bakteriální a parazitární kontaminace",
      summary: "Syrové živočišné produkty mohou obsahovat bakterie, například Salmonella nebo E. coli. Riziko se týká zvířete i lidí v domácnosti.",
      signs: "zvracení, průjem, nechutenství, únava nebo horečka",
      action: "Při příznacích, u mláděte, seniora či nemocného zvířete kontaktujte veterináře. Dodržujte hygienu při úklidu.",
      source: sources.aspca
    },
    {
      id: "citrus",
      name: "Citrusy a citrusové slupky",
      aliases: ["citron", "pomeranč", "limetka", "grep", "grapefruit", "citrusová kůra", "citrusový olej"],
      animals: ["dog", "cat"],
      level: "caution",
      evidence: "dobře doloženo",
      principle: "kyselina citronová a esenciální oleje, hlavně ve slupce a rostlině",
      summary: "Malé množství dužiny obvykle vede nanejvýš k mírnému podráždění. Větší množství slupky, listů nebo koncentrovaného oleje je rizikovější.",
      signs: "slinění, zvracení, průjem, podráždění nebo útlum",
      action: "Po požití oleje, většího množství slupek nebo při potížích kontaktujte veterináře.",
      source: sources.aspca
    }
  ];

  const animalNames = { dog: "psa", cat: "kočku" };
  const levelLabels = { danger: "Jednejte ihned", caution: "Riziko / opatrnost", safe: "Obvykle netoxické" };
  const sortOrder = { danger: 0, caution: 1, safe: 2 };
  const state = { animal: "dog", query: "" };
  const foodsElement = document.getElementById("foods");
  const search = document.getElementById("food-search");
  const summary = document.getElementById("results-summary");
  const resultsTitle = document.getElementById("results-title");
  const animalButtons = [...document.querySelectorAll(".animal-button")];
  const themeToggle = document.getElementById("theme-toggle");

  function normalise(value) {
    return value.toLocaleLowerCase("cs").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function forAnimal(food) {
    return { ...food, ...(food.byAnimal?.[state.animal] || {}) };
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
    const top = makeElement("div", "card-top");
    top.append(makeElement("span", `badge ${food.level}`, levelLabels[food.level]));
    top.append(makeElement("span", "badge", `Podklady: ${food.evidence}`));
    const title = makeElement("h3", "", food.name);
    const description = makeElement("p", "card-summary", food.summary);
    const facts = makeElement("dl", "facts");
    appendFact(facts, "Rizikový faktor", food.principle);
    appendFact(facts, "Možné příznaky", food.signs);
    const action = makeElement("p", "card-action");
    action.append(makeElement("strong", "", "Co udělat"), document.createTextNode(food.action));
    const source = makeElement("p", "card-source");
    source.append("Zdroj: ");
    const link = makeElement("a", "", food.source[0]);
    link.href = food.source[1];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    source.append(link, document.createElement("br"), document.createTextNode(`Kontrola obsahu: ${reviewedAt}`));
    card.append(top, title, description, facts, action, source);
    return card;
  }

  function renderFoods() {
    const query = normalise(state.query.trim());
    const filtered = foods
      .filter((food) => food.animals.includes(state.animal))
      .map(forAnimal)
      .filter((food) => {
        const haystack = normalise([food.name, ...food.aliases, food.summary, food.principle].join(" "));
        return !query || haystack.includes(query);
      })
      .sort((a, b) => sortOrder[a.level] - sortOrder[b.level] || a.name.localeCompare(b.name, "cs"));

    foodsElement.replaceChildren();
    resultsTitle.textContent = `Vybrané potraviny pro ${animalNames[state.animal]}`;
    summary.textContent = filtered.length === 1 ? "Nalezena 1 položka." : `Nalezeno ${filtered.length} položek.`;
    if (!filtered.length) {
      const empty = makeElement("div", "empty-state");
      empty.append(makeElement("strong", "", "Tuto potravinu v ověřeném výběru nemáme."), makeElement("p", "", "Neznamená to, že je bezpečná. Pokud ji zvíře snědlo, ověřte složení a kontaktujte veterináře."));
      foodsElement.append(empty);
      return;
    }
    foodsElement.append(...filtered.map(renderCard));
  }

  function setAnimal(animal) {
    state.animal = animal;
    animalButtons.forEach((button) => {
      const active = button.dataset.animal === animal;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderFoods();
  }

  function setTheme(isDark) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-label", isDark ? "Zapnout světlý režim" : "Zapnout tmavý režim");
    themeToggle.title = isDark ? "Zapnout světlý režim" : "Zapnout tmavý režim";
  }

  animalButtons.forEach((button) => button.addEventListener("click", () => setAnimal(button.dataset.animal)));
  search.addEventListener("input", () => { state.query = search.value; renderFoods(); });
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme !== "dark";
    setTheme(isDark);
    try { localStorage.setItem("nekrmte-theme", isDark ? "dark" : "light"); } catch { /* Theme preference is optional. */ }
  });

  setTheme(document.documentElement.dataset.theme === "dark");
  renderFoods();
})();
