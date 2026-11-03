(() => {
  const STORAGE_KEY = 'lenapoleon-panier-v1';
  const dialog = document.querySelector('[data-cart-dialog]');
  if (!dialog) return;

  const list = dialog.querySelector('[data-cart-items]');
  const empty = dialog.querySelector('[data-cart-empty]');
  const summary = dialog.querySelector('[data-cart-summary]');
  const total = dialog.querySelector('[data-cart-total]');
  const countBadges = [...document.querySelectorAll('[data-cart-count]')];
  const money = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

  function readCart() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value.filter((item) => item && item.id && item.name) : [];
    } catch {
      return [];
    }
  }

  let cart = readCart();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    render();
  }

  function render() {
    list.replaceChildren();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    countBadges.forEach((badge) => {
      badge.textContent = itemCount;
      badge.setAttribute('aria-label', `${itemCount} article${itemCount > 1 ? 's' : ''} dans le panier`);
    });

    empty.hidden = cart.length > 0;
    summary.hidden = cart.length === 0;
    let amount = 0;

    cart.forEach((item, index) => {
      amount += item.price * item.quantity;
      const row = document.createElement('li');
      row.className = 'cart-item';

      const image = document.createElement('img');
      image.className = 'cart-item-image';
      image.src = item.image || './assets/img/logo.png';
      image.alt = '';

      const details = document.createElement('div');
      details.className = 'cart-item-details';
      const name = document.createElement('strong');
      name.textContent = item.name;
      const shop = document.createElement('span');
      shop.textContent = item.shop;
      const price = document.createElement('span');
      price.className = 'cart-item-price';
      price.textContent = money.format(item.price * item.quantity);
      details.append(name, shop, price);

      const controls = document.createElement('div');
      controls.className = 'cart-controls';
      controls.setAttribute('aria-label', `Quantité de ${item.name}`);
      const minus = makeControl('−', 'Diminuer la quantité', index, 'minus');
      const quantity = document.createElement('span');
      quantity.className = 'cart-quantity';
      quantity.textContent = item.quantity;
      const plus = makeControl('+', 'Augmenter la quantité', index, 'plus');
      const remove = makeControl('Supprimer', `Supprimer ${item.name}`, index, 'remove');
      remove.className = 'cart-remove';
      controls.append(minus, quantity, plus, remove);

      row.append(image, details, controls);
      list.append(row);
    });

    total.textContent = money.format(amount);
  }

  function makeControl(label, accessibleName, index, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', accessibleName);
    button.dataset.cartAction = action;
    button.dataset.cartIndex = index;
    return button;
  }

  document.querySelectorAll('[data-cart-open]').forEach((button) => {
    button.addEventListener('click', () => {
      cart = readCart();
      render();
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-cart-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;
    const index = Number(button.dataset.cartIndex);
    const item = cart[index];
    if (!item) return;

    if (button.dataset.cartAction === 'plus') item.quantity += 1;
    if (button.dataset.cartAction === 'minus') item.quantity -= 1;
    if (button.dataset.cartAction === 'remove' || item.quantity <= 0) cart.splice(index, 1);
    save();
  });

  dialog.querySelector('[data-cart-clear]').addEventListener('click', () => {
    cart = [];
    save();
  });

  document.querySelectorAll('.produit').forEach((card) => {
    const button = card.querySelector('.produit-bas .btn');
    const name = card.querySelector('h4')?.textContent.trim();
    const priceText = card.querySelector('.prix')?.textContent || '';
    const price = Number.parseFloat(priceText.replace(/[^\d,.-]/g, '').replace(',', '.'));
    if (!button || !name || !Number.isFinite(price)) return;

    button.addEventListener('click', () => {
      const image = card.querySelector('img')?.getAttribute('src') || '';
      const shop = document.querySelector('.intro h1')?.textContent.replace('Notre boutique à ', '').trim() || 'Boutique';
      const id = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const existing = cart.find((item) => item.id === id);

      if (existing) existing.quantity += 1;
      else cart.push({ id, name, price, quantity: 1, image, shop });

      save();
      button.classList.remove('button-feedback');
      requestAnimationFrame(() => button.classList.add('button-feedback'));
      button.addEventListener('animationend', () => button.classList.remove('button-feedback'), { once: true });
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    cart = readCart();
    render();
  });

  render();
})();
