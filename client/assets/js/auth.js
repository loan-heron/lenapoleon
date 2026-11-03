(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Apparition progressive des sections et des produits pendant le défilement.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealItems = document.querySelectorAll(
      '.intro, .reserver, .carteTitle, .sous-titre, .produit, .footer',
    );
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -35px 0px' },
    );

    revealItems.forEach((item, index) => {
      item.classList.add('reveal-on-scroll');
      if (item.classList.contains('produit')) {
        item.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
      }
      revealObserver.observe(item);
    });
  }

  const dialog = document.querySelector('[data-auth-dialog]');
  if (!dialog) return;

  const title = dialog.querySelector('[data-auth-title]');
  const description = dialog.querySelector('[data-auth-description]');
  const nameField = dialog.querySelector('[data-auth-name]');
  const nameInput = nameField.querySelector('input');
  const passwordField = dialog.querySelector('[data-auth-password]');
  const passwordInput = passwordField.querySelector('input');
  const submit = dialog.querySelector('[data-auth-submit]');
  const forgot = dialog.querySelector('[data-auth-forgot]');
  const feedback = dialog.querySelector('[data-auth-feedback]');
  const tabs = [...dialog.querySelectorAll('[data-auth-mode]')];
  let mode = 'login';

  function setMode(nextMode) {
    mode = nextMode;
    feedback.textContent = '';
    const reset = mode === 'reset';
    const signup = mode === 'signup';
    tabs.forEach((tab) => {
      const active = tab.dataset.authMode === mode;
      tab.hidden = reset;
      tab.setAttribute('aria-selected', String(active));
    });
    nameField.hidden = !signup;
    nameInput.required = signup;
    passwordField.hidden = reset;
    passwordInput.required = !reset;
    passwordInput.autocomplete = signup ? 'new-password' : 'current-password';
    forgot.hidden = reset;

    if (reset) {
      title.textContent = 'Réinitialiser le mot de passe';
      description.textContent =
        'Indiquez votre adresse e-mail pour recevoir un lien de réinitialisation.';
      submit.textContent = 'Envoyer le lien';
    } else if (signup) {
      title.textContent = 'Créer votre compte';
      description.textContent = 'Retrouvez vos commandes et vos informations au même endroit.';
      submit.textContent = 'Créer mon compte';
    } else {
      title.textContent = 'Bienvenue';
      description.textContent = 'Connectez-vous pour retrouver vos commandes et vos informations.';
      submit.textContent = 'Se connecter';
    }
  }

  document.querySelectorAll('[data-auth-open]').forEach((button) => {
    button.addEventListener('click', () => {
      setMode('login');
      dialog.showModal();
      dialog.querySelector('input').focus();
    });
  });
  dialog.querySelector('[data-auth-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  tabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.authMode)));
  forgot.addEventListener('click', () => setMode('reset'));
  dialog.querySelector('[data-auth-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    feedback.textContent =
      'L’espace client sera activé dès que le service de compte sera connecté au site.';
  });
  setMode('login');
})();
