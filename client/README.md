# Le Napoléon — front-end

Site vitrine statique du restaurant : page d’accueil, choix d’une boutique et pages de commande pour Chartres et Clévilliers.

Site en ligne : [lenapoleon-theta.vercel.app](https://lenapoleon-theta.vercel.app/index.html)

## Lancer le site

Aucune compilation ni installation de dépendances n’est nécessaire. Ouvrez `index.html` dans un navigateur ou servez le dossier `client` avec un serveur HTTP local. L’accueil renvoie vers les pages dans `pages/` ; utilisez un serveur local si votre navigateur limite la navigation entre fichiers.

## Contenu

- `index.html` : accueil, diaporama, réservation et menu interactif.
- `pages/boutiques.html` : sélection d’un point de retrait.
- `pages/page-produit-chartres.html` et `pages/page-produit-clevilliers.html` : informations, réservation et produits des boutiques.
- `assets/css/` : styles partagés et styles du site.
- `assets/js/menu.js` : animation du livre-menu sur la page d’accueil. C’est le seul script JavaScript du front.
- `assets/img/` et `assets/fonts/` : images et polices locales.

Le front est statique : les formulaires de réservation ne sont pas reliés à un service d’envoi ou à l’API du serveur.
