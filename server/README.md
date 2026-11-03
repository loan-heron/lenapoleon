# Le Napoléon — API

API REST Express pour gérer les menus du restaurant. Les données sont stockées dans PostgreSQL.

## Prérequis

- Node.js compatible avec `node --watch` (Node.js 18 ou ultérieur).
- PostgreSQL accessible avec une base contenant une table `menus` dotée au minimum d’un identifiant `id` et d’un champ `nom`.

Le projet ne contient pas actuellement de migration de base de données. Pour une base neuve, le schéma minimal attendu est :

```sql
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL
);
```

## Installation et démarrage

Depuis le dossier `server` :

```bash
npm ci
```

Créez un fichier `.env` local, ignoré par Git, avec l’URL de connexion à votre base :

```env
DATABASE_URL=postgresql://utilisateur:mot-de-passe@hote:5432/base
PORT=3000
```

`PORT` est facultatif et vaut `3000` par défaut. Démarrez l’API avec :

```bash
npm start
```

En développement, `npm run dev` redémarre le serveur lors des changements de fichiers. Le serveur vérifie la connexion PostgreSQL avant d’écouter les requêtes.

## Routes

Toutes les routes sont préfixées par `/api/menu`.

| Méthode | URL | Description | Réponse |
| --- | --- | --- | --- |
| `GET` | `/api/menu` | Liste les menus (noms uniquement). | `200` |
| `GET` | `/api/menu/:id` | Récupère un menu par identifiant. | `200` ou `404` |
| `POST` | `/api/menu` | Crée un menu à partir de `{ "nom": "..." }`. | `201` |
| `PUT` | `/api/menu/:id` | Modifie le nom à partir de `{ "nom": "..." }`. | `200` ou `404` |
| `DELETE` | `/api/menu/:id` | Supprime un menu. | `204` ou `404` |

Les requêtes `POST` et `PUT` attendent un corps JSON. Les erreurs de base de données sont renvoyées avec le statut `500`.

## Tester les routes

La collection Postman est disponible dans `postman/lenapoleon.postman_collection.json`. Exécutez-la dans l’ordre pour créer un menu puis réutiliser son identifiant dans les requêtes suivantes.

Il n’y a pas de commande de tests automatisés configurée dans `package.json`.

## Structure

- `app.js` : configuration Express, connexion à la base et chargement des routes.
- `routes/` : définition des routes HTTP.
- `controllers/` : opérations CRUD sur les menus.
- `database/db.config.js` : pool de connexions PostgreSQL.
- `postman/` : collection de requêtes d’API.
