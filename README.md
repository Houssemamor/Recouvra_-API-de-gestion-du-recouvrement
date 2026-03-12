# Recouvra+ API

Projet backend Node.js/Express pour la gestion du recouvrement: clients, factures impayees, paiements manuels et suivi des actions.

## Equipe

- Wissem ben slima
- Seif Bahrouni
- Houssem Amor
- Montaha Khdhiri

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

### 6) Actions de recouvrement (Houssem Amor)

- Modele `RecoveryAction`
- Types: `call`, `email`, `visit`, `notice`, `other`
- Resultats: `pending`, `promise_to_pay`, `paid`, `no_response`, `refused`, `other`
- CRUD complet:
  - `POST /api/recovery-actions`
  - `GET /api/recovery-actions`
  - `GET /api/recovery-actions/:id`
  - `PUT /api/recovery-actions/:id`
  - `DELETE /api/recovery-actions/:id`
- Filtres: par facture, client, agent, type, resultat, plage de dates
- Validation Joi sur les entrees
- Code commente

### 7) Statistiques simples (Houssem Amor)

- `GET /api/stats/overview` — totaux (clients, factures, paiements, actions) + resume financier
- `GET /api/stats/invoices` — repartition par statut + nombre de factures en retard
- `GET /api/stats/agents` — nombre d'actions par agent
- Acces restreint aux roles `manager` et `admin`
- Code commente

## Repartition du travail restant

Le reste du projet est reparti sequentiellement entre les 2 participants restants:

### ~~Etape 1 — Houssem Amor~~ Termine

- ~~Module 6: Actions de recouvrement~~
- ~~Module 7: Statistiques simples~~

### Etape 2 —  Montaha Khdhiri

- Module 8: Documentation Swagger (`/docs`)
  - Documenter toutes les routes
- Module 9: Tests unitaires de base
  - auth login/JWT
  - validation Joi (cas invalide)
  - creation facture
  - enregistrement paiement et changement de statut facture
  - acces protege par roles

### Etape 3 — Seif Bahrouni

- Module 10: Qualite et livraison
  - Gestion d'erreurs centralisee (error middleware)
  - Reponses API coherentes
  - Nettoyage du code et revue des routes
  - Mise a jour README final
  - Verification finale de la documentation

## Etapes restantes

1. ~~Module 6 + 7: Actions de recouvrement + Statistiques (Houssem Amor)~~
2. Module 8 + 9: Swagger + Tests unitaires (Montaha Khdhiri)
3. Module 10: Qualite finale + README final (Seif Bahrouni)
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
