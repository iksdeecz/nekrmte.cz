const postsData = [
  {
    title: "Čokoláda",
    category: "oba",
    content: "Čokoláda je toxická pro psi i kočky kvůli theobrominu a kofeinu. Může způsobit zvracení, průjem, třes, srdeční problémy nebo dokonce smrt. Nikdy nekrmte čokoládou!<br><small>Zdroj: <a href='https://www.akc.org/expert-advice/advice/dogs-health/chocolate-poisonous-dogs/' target='_blank'>AKC: Chocolate Poisonous to Dogs</a></small>"
  },
  {
    title: "Hrozny a rozinky",
    category: "oba",
    content: "Hrozny a rozinky způsobují záhadné selhání ledvin u psů a koček. I malé množství může být nebezpečné - vyhněte se jim úplně.<br><small>Zdroj: <a href='https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/grapes-rhubarb' target='_blank'>ASPCA: Grapes and Raisins</a></small>"
  },
  {
    title: "Avokádo",
    category: "oba",
    content: "Avokádo obsahuje persin, který je toxický pro zvířata. Způsobuje zvracení a průjmy. Ndřítejví zvířatům avokádový olej, chowder ani žádné části avokáda.<br><small>Zdroj: <a href='https://www.petmd.com/dog/nutrition/evr_dg_avocado_toxic_to_dogs' target='_blank'>PetMD: Avocado Toxic to Dogs</a></small>"
  },
  {
    title: "Cibule a česnek",
    category: "oba",
    content: "Cibule, pórek a česnek poškozují červené krvinky a mohou způsobit anémii. Osmička nebo více česneku obsažená biologicky může být smrtelná. Kočky jsou citlivější, vyhněte se úplně."
  },
  {
    title: "Žvýkačky a sladkosti s xylitolem",
    category: "pes",
    content: "Xylitol způsobuje u psů prudké snížení hladiny cukru v krvi, což vede k slabosti, koordinace, záchvatům nebo zástavě srdce. I malá množství (0,045 g na kg hmotností) jsou nebezpečná."
  },
  {
    title: "Mléko a mléčné výrobky",
    category: "kocka",
    content: "Mnoho dospělých koček nemá lactázu pro trávení laktózy. Komým mléko způsobuje průjmy, nadýmání a dehydrataci. Vyhněte se kravímu mléku - použijte kočičí mléko nebo mléko bez laktózy pouze na doporučení veterináře."
  },
  {
    title: "Rybí konzervy pro lidi",
    category: "kocka",
    content: "Rybí konzervy pro lidi často obsahují cibuli a další toxiny. Kloub konzumace způsobuje toxickou reakci kvůli tartár, který je v rybách. Používejte speciální konzervy pro kočky s rybami."
  },
  {
    title: "Liliové rostliny a tulipány",
    category: "kocka",
    content: "Liliové rostliny způsobují selhání ledvin u koček často fatální. I pyl nebo voda z vázy s lií bilia může být nebezpečná. Okamžitě odstraňte všechny li jiniky z domu."
  },
  {
    title: "Alkohol",
    category: "oba",
    content: "Alkohol způsobuje intoxicaci, kóma nebo smrt u zvířat. Psi a kočky metabolizují alkohol jinak než lidé a rychleji je postižením centrální nervové soustavy."
  },
  {
    title: "Kofein",
    category: "oba",
    content: "Kofein v kávě, čaji nebo Kole je stimulant, který způsobuje rychlý srdeční tep, třes, záchvaty nebo srdeční zástavu. Kočky jsou velmi citlivé."
  },
  {
    title: "Hlíva upchaná",
    category: "kocka",
    content: "Hlíva upchaná vyvolává akutní selhání ledvin u koček. Rostlina mucin způsobuje vysazení koncentrační schopnost ledvin. I malá množství mohou být fatální."
  },
  {
    title: "Vánoční koláče a vanilka",
    category: "pes",
    content: "Vánoční koláče často obsahují hrozinky, čokoládu nebo vanilku s xylitolem. Vanilka s xylitolem je stejně nebezpečná ako xylitol v žvýkačkách. Ujistěte se, že vánoční dobrůtky jsou bezpečné."
  },
  {
    title: "Macadamia oříšky",
    category: "pes",
    content: "Macadamia oříšky způsobují u psů záchvaty, zvracení, hypertermii a ochrnutí koži. Vyhněte se jim úplně."
  },
  {
    title: "Levandule",
    category: "kocka",
    content: "Levandule může být toxická pro kočky vlivem stavů orálního vetření. Může způsobit zvracení a deprese. Vyhněte se velicie množstvím."
  },
  {
    title: "Chřest",
    category: "kocka",
    content: "Chřest obsahuje asparagin, který může způsobit u koček zvracení a průjem. Vyhňte se."
  },
  {
    title: "Syrové těsto s droždím",
    category: "pes",
    content: "Syrové těsto s droždım může způsobit kvašení v žaludku, nadýmání nebo dokonce trhav ziekte. Může být život ohrozhující."
  },
  {
    title: "Tis (yew)",
    category: "oba",
    content: "Tis způsobuje srdeční zástavu, křeče a smrt u psů i koček. Všechny části jsou vysoce toxické. Vyhněte se."
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.tabs button');
  const postsDiv = document.getElementById('posts-list');
  const tipsEl = document.querySelector('.tips');

  function renderPosts(category) {
    postsDiv.innerHTML = '';
    let filtered = postsData.filter(post => post.category === category || post.category === 'oba');

    filtered.forEach(post => {
      const article = document.createElement('article');
      article.className = 'post ' + post.category;
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
