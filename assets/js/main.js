const postsData = [
  {
    title: "Špenát",
    category: "pes",
    content: "Špenát obsahuje vysoké množství oxalové kyseliny, která blokuje vstřebávání vápníku a může způsobit poškození ledvin. Psi by neměli jíst špenát pravidelně, ale několik listů čerstvého syrového špenátu pravděpodobně neuškodí."
  },
  {
    title: "Hrozny a rozinky",
    category: "oba",
    edible: "nebezpečné",
    content: "Hrozny a rozinky způsobují záhadné selhání ledvin u psů a koček. I malé množství může být nebezpečné - vyhněte se jim úplně.<br><small>Zdroj: <a href='https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/grapes-rhubarb' target='_blank'>ASPCA: Grapes and Raisins</a></small>"
  },
  {
    title: "Avokádo",
    category: "oba",
    edible: "nebezpečné",
    content: "Avokádo obsahuje persin, který je toxický pro zvířata. Způsobuje zvracení a průjmy. Ndřítejví zvířatům avokádový olej, chowder ani žádné části avokáda.<br><small>Zdroj: <a href='https://www.petmd.com/dog/nutrition/evr_dg_avocado_toxic_to_dogs' target='_blank'>PetMD: Avocado Toxic to Dogs</a></small>"
  },
  {
    title: "Cibule a česnek",
    category: "oba",
    edible: "nebezpečné",
    content: "Cibule, pórek a česnek poškozují červené krvinky a mohou způsobit anémii. Osmička nebo více česneku obsažená biologicky může být smrtelná. Kočky jsou citlivější, vyhněte se úplně."
  },
  {
    title: "Žvýkačky a sladkosti s xylitolem",
    category: "pes",
    edible: "nebezpečné",
    content: "Xylitol způsobuje u psů prudké snížení hladiny cukru v krvi, což vede k slabosti, koordinace, záchvatům nebo zástavě srdce. I malá množství (0,045 g na kg hmotností) jsou nebezpečná."
  },
  {
    title: "Meloun",
    category: "pes",
    edible: "bezpečné",
    content: "Meloun je bezpečným pamlskem pro psy, ale bez slupky a semen, protože begovinky mohou způsobit žaludeční problémy. Je hydratující a nízkokalorický. Psi mohou jíst kousky dužniny melounu."
  },
  {
    title: "Špenát",
    category: "pes",
    edible: "s opatrností",
    content: "Špenát obsahuje vysoké množství oxalové kyseliny, která blokuje vstřebávání vápníku a může způsobit poškození ledvin. Psi by neměli jíst špenát pravidelně, ale několik listů čerstvého syrového špenátu pravděpodobně neuškodí."
  },
  {
    title: "Zelenina",
    category: "pes",
    edible: "bezpečné",
    content: "Psi mohou jíst listy jako římský, arugula nebo iceberg salát, ale měli by se vyhýbat špenátu a kedlíku. Římský, arugula a iceberg salát sú hydratující a křupavé pamlsky, které psi často milují. Kedl obsahuje calcium oxalate, který může vést ke kamenům v ledvinách."
  },
  {
    title: "Ovce",
    category: "pes",
    edible: "s opatrností",
    content: "Psi mohou vyjídat středně opracované oříšky jako arašídy, ovocné oříšky a kešu, ale pouze v malém množství a bez soli. Oříšky mají vysoký obsah tuku, který může způsobit trávení nebo dokonce pankreatitidu. Makadamia oříšky jsou velmi toxické pro psy."
  },
  {
    title: "Ovesná kaše",
    category: "pes",
    edible: "s opatrností",
    content: "Ovesná kaše může být bezpečným jídlem pro psy. Vysoký obsah vlákniny může způsobit žaludeční nepohodlí, plyn, zvracení a prújem, zvláště pokud pes není na vlákninu zvyklý. Psi by měli jíst pouze vanilla ovesnou kaši. Některé příchutě a přídavky jako rašeliny jsou toxické pro psy."
  },
  {
    title: "Olivy",
    category: "pes",
    edible: "s opatrností",
    content: "Olivy nejsou toxické pro psy a mohou být bezpečné v malém množství. Psi by nikdy neměli dostávat olivy s peckami, protože mohou způsobit udušení nebo střevní blokádu, a mohou způsobit zubní prasknutí. Konzervované nebo nakládané olivy by se měly vyhýbat kvůli vysokému obsahu sodíku. Olivy mají vysoký obsah tuku, který může způsobit trávení."
  },
  {
    title: "Hlíva upchaná",
    category: "kocka",
    edible: "nebezpečné",
    content: "Hlíva upchaná vyvolává akutní selhání ledvin u koček. Rostlina mucin způsobuje vysazení koncentrační schopnost ledvin. I malá množství mohou být fatální."
  },
  {
    title: "Vánoční koláče a vanilka",
    category: "pes",
    edible: "nebezpečné",
    content: "Vánoční koláče často obsahují hrozinky, čokoládu nebo vanilku s xylitolem. Vanilka s xylitolem je stejně nebezpečná ako xylitol v žvýkačkách. Ujistěte se, že vánoční dobrůtky jsou bezpečné."
  },
  {
    title: "Macadamia oříšky",
    category: "pes",
    edible: "nebezpečné",
    content: "Macadamia oříšky způsobují u psů záchvaty, zvracení, hypertermii a ochrnutí koži. Vyhněte se jim úplně."
  },
  {
    title: "Levandule",
    category: "kocka",
    edible: "nebezpečné",
    content: "Levandule může být toxická pro kočky vlivem stavů orálního vetření. Může způsobit zvracení a deprese. Vyhněte se velicie množstvím."
  },
  {
    title: "Chřest",
    category: "kocka",
    edible: "nebezpečné",
    content: "Chřest obsahuje asparagin, který může způsobit u koček zvracení a průjem. Vyhňte se."
  },
  {
    title: "Syrové těsto s droždím",
    category: "pes",
    edible: "nebezpečné",
    content: "Syrové těsto s droždım může způsobit kvašení v žaludku, nadýmání nebo dokonce trhav ziekte. Může být život ohrozhující."
  },
  {
    title: "Tis (yew)",
    category: "oba",
    edible: "nebezpečné",
    content: "Tis způsobuje srdeční zástavu, křeče a smrt u psů i koček. Všechny části jsou vysoce toxické. Vyhněte se."
  },
  {
    title: "Banány",
    category: "kocka",
    content: "Banány jsou bezpečným pamlskem pro kočky, ale bez slupky, aby se neudusily. Obsahují hodně cukru, takže v malém množství. Kočky mohou jíst malé kousky rozmělňovaných banánů, bez slupky a semen."
  },
  {
    title: "Mrkev",
    category: "kocka",
    content: "Mrkev je bezpečným pamlskem pro kočky a může pomoci zlepšit zdraví zubů. Kočky by neměly jíst celou mrkev, protože se může dusit. Malé kousky vařené nebo syrové mrkve jsou v pořádku."
  },
  {
    title: "Rajčata",
    category: "kocka",
    content: "Rajčata jsou součástí nočních rostlin a obsahují solamin. Zralé červené rajčata bez stonků a listů jsou obvykle bezpečné, ale stonky a listy jsou toxické. Vyhněte se tomu, pokud nedojde k poškození ledvin nebo žaludku."
  },
  {
    title: "Brambory",
    category: "kocka",
    content: "Syrové brambory obsahují solamin, který je toxický pro kočky. Vařené brambory bez koření nebo omáček jsou obvykle bezpečné, ale vysoký obsah škrobu může způsobit trávení. Nedoporučuje se jako pravidelný pamlsek."
  },
  {
    title: "Zelené fazole",
    category: "kocka",
    content: "Zelené fazole jsou bezpečné pro kočky, pokud jsou vařené a bez koření. Syrové fazole obsahují lektiny, které mohou způsobit žaludeční problémy. Malé kousky vařených zelených fazolí jsou v pořádku."
  },
  {
    title: "Meloun",
    category: "pes",
    content: "Meloun je bezpečným pamlskem pro psy, ale bez slupky a semen, protože begovinky mohou způsobit žaludeční problémy. Je hydratující a nízkokalorický. Psi mohou jíst kousky dužniny melounu."
  },
  {
    title: "Špenát",
    category: "pes",
    content: "Špenát obsahuje vysoké množství oxalové kyseliny, která blokuje vstřebáv Hus aní vápníku a může způsobit poškození ledvin. Psi by neměli jíst špenát pravidelně, ale několik listů pravuttosto plastického syrového špenátu pravděpodobně neuškodí."
  },
  {
    title: "Zelenina",
    category: "pes",
    content: "Psi mohou jíst listy jako římský, arugula nebo iceberg salát, ale měli by se vyhýbat špenátu a kedlíku. Římský, arugula a iceberg salát sú hydratující a křupavé pamlsky, které psi často milují. Kedl obsahuje calcium oxalate, který může vést ke kamenům v ledvinách."
  },
  {
    title: "Ovce",
    category: "pes",
    content: "Psi mohou vyjídat středně opracované oříšky jako arašídy, ovocné oříšky a kešu, ale pouze v malém množství a bez soli. Oříšky mají vysoký obsah tuku, který může způsobit trávení nebo dokonce pankreatitidu. Makadamia oříšky jsou velmi toxické pro psy."
  },
  {
    title: "Ovesná kaše",
    category: "pes",
    edible: "bezpečné",
    content: "Ovesná kaše může být bezpečným jídlem pro psy. Vysoký obsah vlákniny může způsobit žaludeční nepohodlí, plyn, zvracení a prújem, zvláště pokud pes není na vlákninu zvyklý. Psi by měli jíst pouze vanilla ovesnou kaši. Některé příchutě a přídavky jako rašeliny jsou toxické pro psy."
  },
  {
    title: "Olivy",
    category: "pes",
    edible: "s opatrností",
    content: "Olivy nejsou toxické pro psy a mohou být bezpečné v malém množství. Psi by nikdy neměli dostávat olivy s peckami, protože mohou způsobit udušení nebo střevní blokádu, a mohou způsobit zubní prasknutí. Konzervované nebo nakládané olivy by se měly vyhýbat kvůli vysokému obsahu sodíku. Olivy mají vysoký obsah tuku, který může způsobit trávení."
  },
  {
    title: "Banány",
    category: "kocka",
    edible: "bezpečné",
    content: "Banány jsou bezpečným pamlskem pro kočky, ale bez slupky, aby se neudusily. Obsahují hodně cukru, takže v malém množství. Kočky mohou jíst malé kousky rozmělňovaných banánů, bez slupky a semen."
  },
  {
    title: "Mrkev",
    category: "kocka",
    edible: "bezpečné",
    content: "Mrkev je bezpečným pamlskem pro kočky a může pomoci zlepšit zdraví zubů. Kočky by neměly jíst celou mrkev, protože se může dusit. Malé kousky vařené nebo syrové mrkve jsou v pořádku."
  },
  {
    title: "Rajčata (Tomatoes)",
    category: "kocka",
    edible: "s opatrností",
    content: "Rajčata jsou součástí nočních rostlin a obsahují solamin. Zralé červené rajčata bez stonků a listů jsou obvykle bezpečné, ale stonky a listy jsou toxické. Vyhněte se tomu, pokud nedojde k poškození ledvin nebo žaludku."
  },
  {
    title: "Brambory",
    category: "kocka",
    edible: "s opatrností",
    content: "Syrové brambory obsahují solamin, který je toxický pro kočky. Vařené brambory bez koření nebo omáček jsou obvykle bezpečné, ale vysoký obsah škrobu může způsobit trávení. Nedoporučuje se jako pravidelný pamlsek."
  },
  {
    title: "Zelené fazole",
    category: "kocka",
    edible: "bezpečné",
    content: "Zelené fazole jsou bezpečné pro kočky, pokud jsou vařené a bez koření. Syrové fazole obsahují lektiny, které mohou způsobit žaludeční problémy. Malé kousky vařených zelených fazolí jsou v pořádku."
  },
  {
    title: "Jablka",
    category: "kocka",
    edible: "bezpečné",
    content: "Jablka jsou bezpečným pamlskem pro kočky, ale bez jadřinec, stonku nebo semen, které obsahují malé množství kyanidu. Kočky mohou jíst malé kousky nakrájených i připravených příloh, bez jadřinců a semen."
  },
  {
    title: "Mrkev",
    category: "kocka",
    edible: "bezpečné",
    content: "Mrkev je bezpečným pamlskem pro kočky a může pomoci zlepšit zdraví zubů. Kočky by neměly jíst celou mrkev, protože se může dusit. Malé kousky vařené nebo syrové mrkve jsou v pořádku."
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.tabs button');
  const postsDiv = document.getElementById('posts-list');
  const tipsEl = document.querySelector('.tips');

  function renderPosts(category) {
    postsDiv.innerHTML = '';
    let filtered = postsData.filter(post => post.category === category || post.category === 'oba');

    const edibleClasses = {
      'bezpečné': 'safe',
      's opatrností': 'caution',
      'nebezpečné': 'dangerous'
    };

    filtered.forEach(post => {
      const article = document.createElement('article');
      const edibleClass = edibleClasses[post.edible] || '';
      article.className = 'post ' + post.category + ' ' + edibleClass;
      let tags = '';
      if (post.category === 'oba') {
        tags = '<span class="tag tag-kocka">Kočka</span><span class="tag tag-pes">Pes</span>';
      } else if (post.category === 'kocka') {
        tags = '<span class="tag tag-kocka">Kočka</span>';
      } else if (post.category === 'pes') {
        tags = '<span class="tag tag-pes">Pes</span>';
      }
      article.innerHTML = `
        <h2>${post.title}</h2>
        <div class="tags">${tags}</div>
        <p>${post.content}</p>
      `;
      postsDiv.appendChild(article);
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      buttons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderPosts(this.dataset.category);
      updateTips(this.dataset.category);
      tipsEl.style.display = (this.dataset.category === 'kocka' || this.dataset.category === 'pes') ? 'block' : 'none';
    });
  });

  // inicializace - zobrazit psi položky
  buttons[0].classList.add('active');
  renderPosts('pes');
  updateTips('pes');
  tipsEl.style.display = 'block';

  function updateTips(category) {
    if (category === 'kocka') {
      tipsEl.innerHTML = `
        <h2>Tipy</h2>
        <p><strong>Když sdílíte jídlo s kočkami, je důležité mít na paměti několik věcí:</strong></p>
        <ul class="tips-list">
          <li>Poraďte se s veterinářem, než kočce dáte jakékoli jídlo – obzvlášť pokud užívá léky nebo má zdravotní problémy (např. cukrovku, alergie apod.). Některé léky mohou s potravinami reagovat, takže neriskujte!</li>
          <li>Nové potraviny podávejte v malém množství. Sledujte kočku po jejich konzumaci a pokud se objeví negativní příznaky, už jí danou potravinu nedávejte.</li>
          <li>Doplňkové potraviny mimo běžnou stravu by neměly tvořit více než 10 % denního příjmu. Například pokud kočka sní denně 1 hrnček krmiva, neměla by dostat více než 1/10 hrníčku pamlsků (např. několik borůvek). Přílišné množství může vést k trávicím potížím, proto je střídmost klíčová.</li>
          <li>Potraviny by měly být nakrájené na malé kousky bez rizika zaskočení (např. pecky, slupky, semínka). Tyto překážky mohou způsobit i neprůchodnost trávicího traktu. Nikdy je kočkám nedávejte, i když jsou pro lidi zcela běžné.</li>
          <li>Kočky by neměly jíst potraviny se solí, olejem, cukrem, kořením, omáčkami nebo jinými úpravami. Tyto přísady často obsahují pro kočky škodlivé, někdy i jedovaté látky, jako je česnek, cibule či xylitol. Totéž platí i pro pokrmy připravené s těmito ingrediencemi.</li>
          <li>Potraviny s vysokým obsahem tuku dávejte jen výjimečně. I když jsou pro lidi často zdravé, u zvířat mohou způsobit zažívací potíže. U psů může nadbytek tuku vyvolat zánět slinivky (pankreatitidu). U koček se tato souvislost stále zkoumá, ale pro jistotu je vhodné tuk omezit.</li>
          <li>Kočky by neměly jíst průmyslově zpracované potraviny (pečivo, balené pochutiny, fast food apod.). Jsou nezdravé, často tučné a mohou obsahovat i jedovaté látky, například sladidlo xylitol. Pokud si nejste jistí složením, raději je kočce nedávejte.</li>
          <li>Vyhněte se konzervovaným potravinám (např. ovoce, zelenina) – obsahují konzervanty, nadbytek soli či cukru, což je škodlivé jak pro kočky, tak pro lidi. Vybírejte raději čerstvé nebo mražené varianty.</li>
          <li>Kočky postrádají enzymy k trávení sacharidů. Jsou masožravci, a proto nedokážou zpracovat cukry jako lidé nebo psi. Dlouhodobé podávání sacharidů a sladkostí vede k trávicím potížím, obezitě a cukrovce. Jejich strava by proto neměla obsahovat více než 2 % sacharidů nebo cukrů.</li>
        </ul>
      `;
    } else if (category === 'pes') {
      tipsEl.innerHTML = `
        <h2>Tipy</h2>
        <p><strong>Když sdílíte jídlo se psy, je důležité mít na paměti několik věcí:</strong></p>
        <ul class="tips-list">
          <li>Poraďte se s veterinářem, než psovi dáte jakékoli jídlo – obzvlášť pokud užívá léky nebo má zdravotní problémy (např. cukrovku, alergie apod.). Některé léky mohou s potravinami reagovat, proto neriskujte!</li>
          <li>Nové potraviny podávejte v malém množství. Sledujte psa po jejich konzumaci a pokud se objeví negativní příznaky, už mu danou potravinu nedávejte.</li>
          <li>Doplňkové potraviny mimo běžnou stravu by neměly tvořit více než 10 % denního příjmu. Například pokud pes sní denně 5 hrnků krmiva, neměl by dostat více než ½ hrnku pamlsků (např. ¼ hrnku borůvek a pár malých mrkviček). Přílišné množství může vést k zažívacím potížím, proto je střídmost zásadní.</li>
          <li>Sdílené potraviny by měly být nakrájené na malé kousky bez rizika zaskočení (např. pecky, slupky, semínka). Tyto překážky mohou způsobit i neprůchodnost trávicího traktu. Nikdy je psům nedávejte, i když jsou pro lidi běžné.</li>
          <li>Psi by neměli jíst potraviny se solí, olejem, cukrem, kořením, omáčkami či jinými úpravami. Tyto přísady mohou obsahovat škodlivé nebo přímo jedovaté látky, jako je česnek, cibule nebo xylitol. Totéž platí i pro pokrmy připravené s těmito ingrediencemi.</li>
          <li>Potraviny s vysokým obsahem tuku jsou pro psy nevhodné. Psi nejsou uzpůsobeni na velké množství tuku a takové jídlo může způsobit zažívací potíže nebo dokonce pankreatitidu (zánět slinivky), která se může projevovat zvracením, únavou, průjmem a ztrátou chuti k jídlu. Jde o vážný stav vyžadující okamžitou veterinární péči.</li>
          <li>Psi by neměly jíst průmyslově zpracované potraviny (pečivo, balené pochutiny, fast food apod.). Jsou nezdravé, tučné a mohou obsahovat i nebezpečné látky, například sladidlo xylitol. Pokud si nejste jistí složením, raději je psovi nedávejte.</li>
          <li>Vyhněte se konzervovaným potravinám (např. ovoce, zelenina), protože obsahují konzervanty, nadbytek soli a cukru, což je škodlivé pro psy i lidi. Vybírejte raději čerstvé nebo mražené varianty.</li>
          <li>Některé druhy potravin (např. hrách, luštěniny, brambory), i když nejsou přímo jedovaté, mohou při časté konzumaci souviset s rozvojem srdečního onemocnění zvaného dilatační kardiomyopatie (DCM).</li>
        </ul>
      `;
    }
  }

  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });
});
