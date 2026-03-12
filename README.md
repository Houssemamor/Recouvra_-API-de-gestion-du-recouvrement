# Recouvra+ API

API REST de gestion du recouvrement construite avec Node.js et Express.
Le projet couvre la gestion des clients, des factures impayees, des paiements,
des actions de recouvrement et des statistiques de suivi.

## Sommaire

- [Presentation](#presentation)
- [Fonctionnalites](#fonctionnalites)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Securite et controle d'acces](#securite-et-controle-dacces)
- [Installation et lancement](#installation-et-lancement)
- [Documentation API (Swagger)](#documentation-api-swagger)
- [Endpoints principaux](#endpoints-principaux)
- [Tests](#tests)
- [Qualite et conventions](#qualite-et-conventions)
- [Equipe](#equipe)

## Presentation

Recouvra+ centralise le cycle de recouvrement:

- creation et suivi des clients
- creation et mise a jour des factures
- enregistrement des paiements manuels
- suivi des actions de relance (appel, email, visite, etc.)
- exposition de statistiques metier pour le pilotage

L'API suit une structure en couches claire: `routes -> controllers -> services -> models`.

## Fonctionnalites

- Authentification JWT avec gestion de roles (`agent`, `manager`, `admin`)
- CRUD Clients
- CRUD Factures avec statuts (`unpaid`, `partial`, `paid`, `in_collection`)
- Paiements manuels avec mise a jour automatique du montant paye et du statut facture
- CRUD Actions de recouvrement avec filtres metier
- Statistiques globales, par facture et par agent
- Validation des entrees via Joi
- Gestion centralisee des erreurs
- Documentation interactive Swagger

## Architecture

Structure du projet:

```text
src/
  app.js
  server.js
  config/
  controllers/
  docs/
  middlewares/
  models/
  routes/
  services/
  validators/
tests/
```

Flux d'une requete:

1. `routes` mappe l'URL a un controller
2. `middlewares` (auth/roles/erreurs) s'appliquent
3. `controller` valide les donnees et appelle le service
4. `service` execute la logique metier et l'acces base via `models`
5. reponse JSON coherente retournee au client

## Stack technique

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Hashage mot de passe avec `argon2` (argon2id)
- Joi pour la validation
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- Tests: Jest + Supertest

## Securite et controle d'acces

- Authentification via Bearer token JWT
- Autorisation par role avec middleware `authorize([...roles])`
- Roles supportes:
  - `agent`
  - `manager`
  - `admin`

Exemples de restrictions:

- `manager`/`admin`: creation ou suppression d'entites sensibles
- `agent`: acces en lecture ou actions de recouvrement selon routes

## Installation et lancement

### 1) Prerequis

- Node.js installe
- MongoDB local ou distant

### 2) Installer les dependances

```bash
npm install
```

### 3) Configurer l'environnement

Creer un fichier `.env` a partir de `.env.example`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/recouvra_plus
JWT_SECRET=change_this_secret
```

### 4) Lancer l'application

Mode developpement:

```bash
npm run dev
```

Mode standard:

```bash
npm start
```

### 5) Verifier l'etat API

```text
GET http://localhost:3000/api/health
```

## Documentation API (Swagger)

Swagger UI est disponible a l'URL:

```text
http://localhost:3000/api/docs
```

Fonctionnalites disponibles:

- test interactif des endpoints (Try it out)
- injection du JWT via bouton `Authorize`
- schemas de requete/reponse
- documentation des parametres

Base URL API:

```text
http://localhost:3000/api
```

## Endpoints principaux

Authentification:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Clients:

- `POST /api/clients`
- `GET /api/clients`
- `GET /api/clients/:id`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

Factures:

- `POST /api/invoices`
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `PUT /api/invoices/:id`
- `DELETE /api/invoices/:id`

Paiements:

- `POST /api/payments`

Actions de recouvrement:

- `POST /api/recovery-actions`
- `GET /api/recovery-actions`
- `GET /api/recovery-actions/:id`
- `PUT /api/recovery-actions/:id`
- `DELETE /api/recovery-actions/:id`

Statistiques:

- `GET /api/stats/overview`
- `GET /api/stats/invoices`
- `GET /api/stats/agents`

## Tests

Lancer toute la suite:

```bash
npm test
```

## Qualite et conventions

- validation d'entrees centralisee via Joi
- gestion d'erreurs centralisee via middleware
- architecture modulaire pour faciliter la maintenance
- reponses JSON homogenes (`success`, `message`, `data`)

## Equipe

- Wissem Ben Slima
- Seif Bahrouni
- Houssem Amor
- Montaha Khdhiri

Tous les modules prevus dans le plan de projet sont completes.
