# Recouvra+ API

Projet backend Node.js/Express pour la gestion du recouvrement: clients, factures impayees, paiements manuels et suivi des actions.

## Equipe

- Wissem ben slima
- Houssem Amor
- Montah Khdhiri

## Stack technique

- Node.js 22
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Joi (validation)
- Jest + Supertest

## Travail deja realise

Les modules suivants sont deja implementes dans ce repository:

### 1) Cadrage et setup

- Initialisation du projet Express
- Structure propre mise en place:
  - `src/config`
  - `src/models`
  - `src/controllers`
  - `src/services`
  - `src/routes`
  - `src/middlewares`
  - `src/validators`
  - `tests`
- Configuration environnement (`.env.example`)
- Connexion MongoDB avec statut expose dans `GET /api/health`
- Scripts npm (`dev`, `start`, `test`)

### 2) Authentification et roles

- Modele `User` avec roles `agent`, `manager`, `admin`
- Endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Middleware `auth` (JWT)
- Middleware `authorize(roles)`

### 3) Gestion des clients

- Modele `Client`
- CRUD complet:
  - `POST /api/clients`
  - `GET /api/clients`
  - `GET /api/clients/:id`
  - `PUT /api/clients/:id`
  - `DELETE /api/clients/:id`
- Validation Joi sur les entrees

### 4) Gestion des factures impayees

- Modele `Invoice`
- Statuts: `unpaid`, `partial`, `paid`, `in_collection`
- CRUD + filtres (`status`, `date`, `client`)

### 5) Paiements manuels

- Modele `Payment`
- Endpoint:
  - `POST /api/payments`
- Logique metier implementee:
  - mise a jour automatique de `invoice.amountPaid`
  - mise a jour automatique du statut facture (`partial` ou `paid`)

## Repartition du travail restant

Le reste du projet est reparti comme suit:

### Houssem Amor

- Module 6: Actions de recouvrement (complet)
  - Modele `CollectionAction`
  - Types: `call`, `email`, `visit`, `notice`
  - Endpoints: creation + historique par client/facture
- Module 9: Tests unitaires de base (partie recouvrement + auth)
- Module 10: Qualite finale (partie backend)
  - Revue des routes
  - Harmonisation des reponses API
  - Nettoyage du code

### Montaha Khdhiri

- Module 7: Statistiques simples (complet)
  - `GET /api/stats/overview`
  - `GET /api/stats/invoices`
  - `GET /api/stats/agents`
- Module 8: Documentation Swagger (`/docs`) (complet)
- Module 9: Tests unitaires de base (partie factures + paiements + stats)
- Module 10: Livraison finale
  - Mise a jour README final
  - Verification finale de la documentation

## Etapes restantes

- Module 6: Actions de recouvrement (Houssem Amor)
- Module 7: Statistiques (Montaha Khdhiri)
- Module 8: Swagger (Montaha Khdhiri)
- Module 9: Tests unitaires de base complets (Houssem Amor + Montaha Khdhiri)
- Module 10: Qualite finale + README final (Houssem Amor + Montaha Khdhiri)

## Lancer le projet en local

1. Installer les dependances:

```bash
npm install
```

2. Creer un fichier `.env` (a partir de `.env.example`) avec au minimum:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/recouvra_plus
JWT_SECRET=change_this_secret
```

3. Demarrer MongoDB localement

4. Lancer l'API:

```bash
npm run dev
```

5. Tester l'etat API + DB:

```bash
GET http://localhost:3000/api/health
```

## Tests

```bash
npm test
```

## Notes de collaboration Git

- Travailler par branche: `feature/module-6`, `feature/module-7`, `feature/module-8`, etc.
- Faire des commits courts, clairs et atomiques
- Ouvrir des Pull Requests pour une validation croisee
