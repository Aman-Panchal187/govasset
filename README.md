# GovAsset

GovAsset is a local, end-to-end government physical asset lifecycle system built for a reliable hackathon demo. It uses React + TypeScript + Vite, Express + TypeScript, PostgreSQL, and Prisma.

## Prerequisites

- Node.js 20 or newer (Node 22 is tested)
- npm 10 or newer
- PostgreSQL 14 or newer, or Docker Desktop

## Setup

1. Start PostgreSQL. The included Docker option creates the database automatically:

   ```bash
   docker compose up -d
   ```

   Without Docker, create it with PostgreSQL tools:

   ```bash
   createdb -U postgres govasset
   ```

2. Create the server environment file:

   ```bash
   cp server/.env.example server/.env
   ```

   On PowerShell: `Copy-Item server/.env.example server/.env`.

3. Install packages:

   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

4. Create the schema and seed realistic demo data:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Run both applications from the repository root:

   ```bash
   npm run dev
   ```

Open http://localhost:5173. The API listens at http://localhost:4000.

## Environment variables

Server (`server/.env`):

- `DATABASE_URL`: PostgreSQL connection URL (the included Docker setup uses host port `5433` to avoid common local PostgreSQL conflicts)
- `JWT_SECRET`: long random signing secret (replace the development example)
- `PORT`: API port, default `4000`
- `CLIENT_URL`: allowed browser origin, default `http://localhost:5173`

Client (`client/.env`, optional):

- `VITE_API_URL`: API prefix, default `/api`; do not put secrets here

## Demo accounts

All seeded accounts use password **Demo@123**.

| Role | Email | Scope |
|---|---|---|
| System Admin | admin@govasset.local | All departments |
| Asset Officer | officer@govasset.local | Health Department |
| Field Verifier | verifier@govasset.local | Health Department |
| Viewer / Auditor | viewer@govasset.local | Health Department, read-only |

Additional seeded users include Education Officer (`education.officer@govasset.local`) and PWD Verifier (`pwd.verifier@govasset.local`) with the same password.

## Lifecycle rules

Registration starts at `PENDING_ACCEPTANCE`. Admin acceptance activates the asset; rejection creates a retained, read-only record. Maintenance moves an active asset to `UNDER_MAINTENANCE` and completion returns it to `ACTIVE`. A missing verification moves it to `MISSING`; only a later Found verification with a resolution note restores it (and any unfinished maintenance remains open). Disposal has separate request, admin decision, and completion stages. Transfers are historical events, not statuses. Missing assets cannot be transferred or disposed. `DISPOSED` and `REJECTED` records are read-only.

Every lifecycle operation updates the asset and writes related history in one database transaction. The API independently enforces roles, department access, valid transitions, and duplicate serial/registration checks.

Verification is due for an accepted, non-final asset that has never been verified or whose latest verification is older than 365 days. This calculation is kept in the backend dashboard/report logic.

## Useful commands

```bash
npm run build                  # build server and client
npm run dev                    # run both in development
npm run db:migrate             # apply/create Prisma migrations
npm run db:seed                # reset and seed demo records
npm run start --prefix server  # run compiled API
npm run preview --prefix client
```

Uploads are stored locally under `server/uploads` with generated UUID filenames. JPG, PNG, WebP, and PDF files are accepted up to 5 MB.

## Known hackathon limitations

- Local file storage is intended for a single local server, not clustered production deployment.
- JWT logout is client-side; production should add rotation/revocation and HTTPS.
- Administration intentionally provides simple create/list flows rather than full directory integration.
- The UI uses browser confirmation-style action forms and does not implement bulk asset import.
