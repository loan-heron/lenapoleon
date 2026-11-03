const clePanier = 'lenapoleon-panier-v1';
let panier = JSON.parse(localStorage.getItem(clePanier) || '[]');

// Garde les paniers enregistrés avant cette version.
panier = panier.map((article) => ({
  nom: article.nom || article.name,
  prix: article.prix ?? article.price,
  image: article.image || '',
  boutique: article.boutique || article.shop || 'Boutique',
  quantite: article.quantite || article.quantity || 1,
}));

const fenetrePanier = document.querySelector('[data-cart-dialog]');
const listePanier = document.querySelector('[data-cart-items]');
const messageVide = document.querySelector('[data-cart-empty]');
const totalPanier = document.querySelector('[data-cart-total]');
const compteurPanier = document.querySelector('[data-cart-count]');
const prixEuro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

function afficherPanier() {
  listePanier.innerHTML = '';
  let total = 0;
  let nombreArticles = 0;

  panier.forEach((article, index) => {
    total += article.prix * article.quantite;
    nombreArticles += article.quantite;

    const ligne = document.createElement('li');
    ligne.className = 'cart-item';

    const image = document.createElement('img');
    image.className = 'cart-item-image';
    image.src = article.image;
    image.alt = '';

    const details = document.createElement('div');
    details.className = 'cart-item-details';
    const nomArticle = document.createElement('strong');
    nomArticle.textContent = article.nom;
    const nomBoutique = document.createElement('span');
    nomBoutique.textContent = article.boutique;
    const prixArticle = document.createElement('span');
    prixArticle.className = 'cart-item-price';
    prixArticle.textContent = prixEuro.format(article.prix * article.quantite);
    details.append(nomArticle, nomBoutique, prixArticle);

    const boutons = document.createElement('div');
    boutons.className = 'cart-controls';

    const moins = document.createElement('button');
    moins.textContent = '-';
    moins.setAttribute('aria-label', 'Retirer un article');
    moins.onclick = () => changerQuantite(index, -1);

    const quantite = document.createElement('span');
    quantite.className = 'cart-quantity';
    quantite.textContent = article.quantite;

    const plus = document.createElement('button');
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'Ajouter un article');
    plus.onclick = () => changerQuantite(index, 1);

    const supprimer = document.createElement('button');
    supprimer.className = 'cart-remove';
    supprimer.textContent = 'Supprimer';
    supprimer.onclick = () => supprimerArticle(index);

    boutons.append(moins, quantite, plus, supprimer);
    ligne.append(image, details, boutons);
    listePanier.append(ligne);
  });

  compteurPanier.textContent = nombreArticles;
  messageVide.hidden = panier.length > 0;
  document.querySelector('[data-cart-summary]').hidden = panier.length === 0;
  totalPanier.textContent = prixEuro.format(total);
}

function enregistrerPanier() {
  localStorage.setItem(clePanier, JSON.stringify(panier));
  afficherPanier();
}

function ajouterArticle(nom, prix, image, boutique) {
  const article = panier.find((item) => item.nom === nom);

  if (article) {
    article.quantite++;
  } else {
    panier.push({ nom, prix, image, boutique, quantite: 1 });
  }

  enregistrerPanier();
}

function changerQuantite(index, changement) {
  panier[index].quantite += changement;

  if (panier[index].quantite === 0) {
    panier.splice(index, 1);
  }

  enregistrerPanier();
}

function supprimerArticle(index) {
  panier.splice(index, 1);
  enregistrerPanier();
}

document.querySelectorAll('[data-cart-open]').forEach((bouton) => {
  bouton.onclick = () => {
    afficherPanier();
    fenetrePanier.showModal();
  };
});

document.querySelector('[data-cart-close]').onclick = () => fenetrePanier.close();
document.querySelector('[data-cart-clear]').onclick = () => {
  panier = [];
  enregistrerPanier();
};

document.querySelectorAll('.produit').forEach((produit) => {
  const bouton = produit.querySelector('.produit-bas .btn');
  const nom = produit.querySelector('h4').textContent.trim();
  const prix = Number.parseFloat(
    produit.querySelector('.prix').textContent.replace(',', '.').replace(' €', ''),
  );
  const image = produit.querySelector('img').getAttribute('src');
  const boutique = document.querySelector('.intro h1').textContent.replace('Notre boutique à ', '');

  bouton.onclick = () => {
    ajouterArticle(nom, prix, image, boutique);
    bouton.textContent = 'Ajouté';
    setTimeout(() => {
      bouton.textContent = 'Ajouter';
    }, 700);
  };
});

afficherPanier();
