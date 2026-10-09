# Metodika klasifikace rizika — Nekrmte.cz

Poslední revize metodiky: 2026-10-09.
Stav: redakční kontrola veřejně dostupných odborných zdrojů. **Nejde o individuální
veterinární posouzení jednotlivých karet.** Pokud údaj není doložen, je to v datech
explicitně uvedeno (`evidence` obsahuje „omezené podklady" / „nejasné" a karta uvádí,
že postup se určuje individuálně s veterinářem).

## 1. Co klasifikujeme

Rozlišujeme dvě nezávislé osy, které se v původní verzi míchaly:

1. **Typ rizika (`riskType`)** — _čím_ hrozí poškození.
2. **Naléhavost (`level`)** — _jak rychle_ má uživatel kontaktovat veterináře.

Mechanické nebezpečí (kost, pecka) není otrava toxickou látkou, ale může vyžadovat
stejně rychlý zásah. Proto je typ a naléhavost uvedena vždy obě.

### Typy rizika

| `riskType` | Význam | Příklad |
|---|---|---|
| `toxické` | Doložený toxický účinek u daného druhu. | čokoláda (theobromin), cibule/česnek, alkohol, kofein |
| `toxické u psů / nejasné u koček` | Závažný účinek doložen u psů; u koček omezené nebo žádné publikované případy. Neznamená „bezpečné pro kočky". | hrozny/rozinky, xylitol |
| `toxické + mechanické` | Kombinace (kvašení + rozpínání). | syrové kynuté těsto |
| `mechanické` | Poranění, ucpání nebo neprůchodnost, nikoli klasická otrava. | kosti |
| `podmíněné` | Riziko závisí na složení výrobku, množství, zdravotním stavu apod. | mléčné výrobky, tučná jídla, sůl, syrové maso/vejce, citrusy, zubní pasty s xylitolem |
| `obvykle nízké za popsaných podmínek` | Za výslovně popsaných podmínek se nepovažuje za systémově toxické pro psy/kočky; jiné riziko (pecka, tuk) trvá. | dužina avokáda |

### Úrovně naléhavosti

| `level` | Štítek v UI | Kdy použít |
|---|---|---|
| `danger` | „Volejte veterináře ihned" | Doložené závažné riziko, i malé množství může být problém, nebo mechanické riziko s rychlým zhoršením. Akce vždy obsahuje „volejte ihned / jeďte na pohotovost při příznacích". |
| `caution` | „Ověřte a volejte veterináři" | Podmíněné riziko, nejasné podklady pro daný druh, nebo mírnější průběh. Akce vždy obsahuje podmínku („podle složení / množství / příznaků volejte"). |
| `safe` | „Obvykle netoxické — čtěte podmínky" | Pouze když zdroje pro psy a kočky shodně uvádějí, že daná část/příprava není systémově toxická, **a** karta zároveň popisuje zbývající rizika (pecka, tuk, množství). Nikdy neznamená „libovolné množství je bezpečné". |

Pravidla konzistence (vynuceno testy):

- `danger` musí v `action` obsahovat „ihned" / „okamžitě" / „pohotovost".
- `caution` musí v `action` obsahovat podmínku („pokud" / „při" / „podle" / „ověřte" / „kontaktujte").
- `safe` nesmí slibovat bezpečnost bez podmínek; musí obsahovat „za popsaných podmínek" nebo výčet zbývajících rizik.
- Text, barva a akce musí souhlasit: červená = danger, žlutá = caution, zelená = safe.

## 2. Aliasy a vyhledávání

- `aliases` smí obsahovat **pouze přesná synonyma a tvary téže suroviny/látky**
  (jednotné/množné číslo, „kakaový prášek", „E967" pro xylitol).
- **Obecné názvy výrobků se nesmí tvářit jako důkaz obsahu rizikové látky.**
  Proto byly odstraněny např.:
  - `rybíz` u hroznů/rozinek (pravý rybíz _Ribes_ ≠ Zante currants = drobné sušené hrozny),
  - `vánočka`, `štola` (mohou, ale nemusí obsahovat rozinky),
  - `žvýkačka`, `sladkosti`, `arašídové máslo`, `proteinová tyčinka`, `zubní pasta`, `bonbon bez cukru` jako aliasy xylitolu,
  - `ořechy v čokoládě` u makadamie,
  - `kuřecí maso` bez „syrové" u syrového masa,
  - holé `slaný` a holé `ořechy` / `cola`.
- Výrobky, u nichž záleží na složení, jsou vyjmenovány **v textu karty** („zkontrolujte
  složení: žvýkačky, bonbony, …"), nikoli jako alias. Hledání obecného výrobku pak
  správně vrátí „nenalezeno" s pokynem ověřit složení a volat veterináři — a netvrdí,
  že výrobek xylitol obsahuje, ani že je bezpečný.
- Pravý rybíz (_Ribes_, např. červený/černý rybíz) není záminkou pro riziko hroznů.
  Karta hroznů to výslovně rozlišuje. Hledání `rybíz` proto nesmí vrátit kartu hroznů.

Vyhledávání (viz `lib/search.mjs` → `filterFoods`):

- normalizace: lowercase `cs` + NFD + odstranění diakritiky → „čokoláda" = „cokolada",
- částečná shoda podřetězcem,
- prohledávaná pole: `name`, `aliases`, `principle`, `signs` (+ `riskType`),
- `summary` se záměrně NEprohledává: obsahuje i podmíněné příklady
  („zkontrolujte složení žvýkaček…", „rybíz do této karty nepatří"),
  které by jinak vytvářely falešně jisté shody,
- nejdřív filtr druhu (`animals`), pak dotaz, řazení `danger → caution → safe`, pak abecedně.

## 3. Evidence zdrojů

- Každá karta má `sources[]` s uvedením, které tvrzení zdroj podporuje (komentář v JSON).
- Společné `reviewedAt` bylo zrušeno. Každá položka má vlastní `reviewedAt`
  (formát `YYYY-MM-DD`, v UI „Kontrola podkladů: D. M. YYYY").
- `reviewedAt` znamená **redakční kontrolu veřejných zdrojů k datu**, nikoli
  veterinární atestaci. V patičce a u karet je to výslovně uvedeno.
- `vetReview` je `null`, dokud neproběhne doložené odborné posouzení.
  Nevymýšlíme recenzenta, kvalifikaci ani datum.
- Rozlišujeme důkazy pro psy a kočky (`evidence` vs. `byAnimal.cat.evidence`).
  Hlavní zdroje: Merck Veterinary Manual, ASPCA Poison Control, Cornell University
  College of Veterinary Medicine, Pet Poison Helpline (avokádo).

## 4. Bezpečnostní sdělení

- Emergency box a sekce „Nejde o úplnou databázi" jsou v HTML i bez JS.
- Prázdný výsledek nikdy netvrdí bezpečnost. Vždy uvádí: ověřte složení, množství,
  čas, příznaky a volejte veterináři — zvlášť u léků, chemikálií a rostlin, které
  databáze nepokrývá.
- Seznam pro veterináře: druh a hmotnost zvířete, přesný název a složení výrobku,
  odhad množství, čas požití, pozorované příznaky, obal s sebou.
- Bez pokynu veterináře nevyvolávat zvracení ani nepodávat domácí „protijedy".
- Nevymýšlíme telefonní čísla ani pohotovosti. Odkaz na externí vyhledávač pomoci
  není přidán, protože nebyla ověřena důvěryhodná česká služba.

## 5. Co zbývá na veterinární posouzení

- Validace všech `caution`/`safe` klasifikací pro kočky (omezené publikované údaje).
- Případné dávkovací prahy — záměrně neuvádíme; kalkulačku toxicity nepřidávat
  bez validovaných podkladů a specifikace druhu.
- Rozšíření o léky, chemikálie a rostliny — zatím pouze obecný pokyn volat veterináře.
