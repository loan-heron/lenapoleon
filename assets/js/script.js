(() => {
  const PW = 800;
  const FLIP_MS = 2000; // garder = --dur dans style.css
  const CLOSE_STAGGER_MS = 650; // delai entre chaque feuille au retour au debut

  const stage = document.getElementById('stage');
  const book = document.getElementById('book');
  const hits = document.getElementById('hits');
  const hint = document.getElementById('hint');
  const sheets = [...book.querySelectorAll('.sheet')];
  const last = sheets.length - 1; // la derniere feuille ne se tourne jamais
  const maxFlipped = last; // 2 feuilles tournees = pages 4-5 visibles

  let flipped = 0; // nombre de feuilles tournees
  let busy = false;

  /* ---------- mise a l'echelle de l'ecran ---------- */
  function fit() {
    const w = PW * 2 + 140;
    const h = 767 + 200;
    const s = Math.min(window.innerWidth / w, window.innerHeight / h, 1.4);
    stage.style.transform = `scale(${s})`;
  }

  /* ---------- rendu de l'etat ---------- */
  function render() {
    const open = flipped > 0;
    // livre ferme : la couverture est centree, ouvert : le dos est au milieu
    const pw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pw')) || PW;
    const shift = open ? 0 : -pw / 2;
    book.style.transform = `translateX(${shift}px)`;
    hits.style.transform = `translateX(${shift}px)`;
    book.classList.toggle('open', open);
    hits.classList.toggle('open', open);

    sheets.forEach((sheet, i) => {
      const isFlipped = i < flipped;
      // empilement : les feuilles du dessus sont les plus proches du lecteur
      const z = isFlipped ? (i + 1) * 0.8 : (sheets.length - i) * 0.8;
      sheet.style.setProperty('--a', isFlipped ? '-180deg' : '0deg');
      sheet.style.setProperty('--z', `${z}px`);
    });

    if (flipped === 0) hint.textContent = 'Cliquez sur la couverture pour ouvrir le menu';
    else if (flipped === maxFlipped)
      hint.textContent = 'Cliquez sur la page de droite pour refermer le livre';
    else hint.textContent = 'Cliquez a droite pour avancer, a gauche pour revenir';
  }

  function lock(ms) {
    busy = true;
    setTimeout(() => {
      busy = false;
    }, ms);
  }

  /* ---------- navigation ---------- */
  function next() {
    if (busy) return;
    if (flipped < maxFlipped) {
      flipped += 1;
      lock(FLIP_MS);
      render();
    } else {
      closeBook();
    }
  }

  function prev() {
    if (busy || flipped === 0) return;
    flipped -= 1;
    lock(FLIP_MS);
    render();
  }

  // retour au debut : les feuilles se rabattent l'une apres l'autre
  function closeBook() {
    const steps = flipped;
    lock(FLIP_MS + (steps - 1) * CLOSE_STAGGER_MS);
    for (let k = 0; k < steps; k++) {
      setTimeout(() => {
        flipped -= 1;
        render();
      }, k * CLOSE_STAGGER_MS);
    }
  }

  /* ---------- evenements ---------- */
  document.getElementById('hitRight').addEventListener('click', next);
  document.getElementById('hitLeft').addEventListener('click', prev);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      next();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
    if (e.key === 'Home') {
      e.preventDefault();
      if (!busy && flipped) closeBook();
    }
  });

  window.addEventListener('resize', fit);

  // premier affichage sans animation, les transitions s'activent ensuite
  document.documentElement.classList.add('no-anim');
  fit();
  render();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-anim');
    }),
  );

  const avisCards = document.getElementById('avisCards');
  const avisPrev = document.getElementById('avisPrev');
  const avisNext = document.getElementById('avisNext');

  function scrollAvis(direction) {
    if (!avisCards) return;
    const card = avisCards.querySelector('.avis-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(avisCards).columnGap) || 0;
    avisCards.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  }

  if (avisPrev && avisNext) {
    avisPrev.addEventListener('click', () => scrollAvis(-1));
    avisNext.addEventListener('click', () => scrollAvis(1));
  }
})();
