(() => {
  const MAX_CLOSE_STAGGER_MS = 220;
  const stage = document.getElementById('stage');
  const book = document.getElementById('book');
  const hits = document.getElementById('hits');
  const scene = document.getElementById('notre-carte');
  const hint = document.getElementById('hint');
  const sheets = [...book.querySelectorAll('.sheet')];
  const maxFlipped = sheets.length - 1;

  let flipped = 0;
  let busy = false;

  function flipDuration() {
    const duration = getComputedStyle(document.documentElement)
      .getPropertyValue('--dur')
      .trim();
    const value = Number.parseFloat(duration);
    return duration.endsWith('ms') ? value : value * 1000;
  }

  function fit() {
    const pageWidth =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--pw'),
      ) || 500;
    const pageHeight =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--ph'),
      ) || 467;
    const scale = Math.min(
      window.innerWidth / (pageWidth * 2 + 140),
      window.innerHeight / (pageHeight + 200),
      1.4,
    );
    stage.style.transform = `scale(${scale})`;
  }

  function render() {
    const open = flipped > 0;
    const pageWidth =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--pw'),
      ) || 500;
    const shift = open ? 0 : -pageWidth / 2;

    book.style.transform = `translateX(${shift}px)`;
    hits.style.transform = `translateX(${shift}px)`;
    book.classList.toggle('open', open);
    hits.classList.toggle('open', open);

    sheets.forEach((sheet, index) => {
      const isFlipped = index < flipped;
      const depth = isFlipped ? (index + 1) * 0.8 : (sheets.length - index) * 0.8;
      sheet.style.setProperty('--a', isFlipped ? '-180deg' : '0deg');
      sheet.style.setProperty('--z', `${depth}px`);
    });

    if (flipped === 0) {
      hint.textContent = 'Cliquez sur la couverture pour ouvrir le menu';
    } else if (flipped === maxFlipped) {
      hint.textContent = 'Cliquez sur la page de droite pour refermer le livre';
    } else {
      hint.textContent = 'Cliquez à droite pour avancer, à gauche pour revenir';
    }
  }

  function lock(duration) {
    busy = true;
    window.setTimeout(() => {
      busy = false;
    }, duration);
  }

  function closeBook() {
    const steps = flipped;
    const stagger = Math.min(MAX_CLOSE_STAGGER_MS, flipDuration() / 3);
    lock(flipDuration() + (steps - 1) * stagger);
    for (let step = 0; step < steps; step += 1) {
      window.setTimeout(() => {
        flipped -= 1;
        render();
      }, step * stagger);
    }
  }

  function next() {
    if (busy) return;
    if (flipped < maxFlipped) {
      flipped += 1;
      lock(flipDuration());
      render();
    } else {
      closeBook();
    }
  }

  function previous() {
    if (busy || flipped === 0) return;
    flipped -= 1;
    lock(flipDuration());
    render();
  }

  document.getElementById('hitRight').addEventListener('click', next);
  document.getElementById('hitLeft').addEventListener('click', previous);

  scene.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    } else if (event.key === 'Home' && !busy && flipped > 0) {
      event.preventDefault();
      closeBook();
    }
  });

  window.addEventListener('resize', fit);
  fit();
  render();
})();
