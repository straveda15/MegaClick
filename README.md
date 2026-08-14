# Victory Media Dashboard

A standalone ops dashboard extracted from the Everlive codebase, carrying over
five feature areas:

| Feature | Frontend | Backend |
| --- | --- | --- |
| Login flow | `/login` | `/api/v1/auth` |
| Adding employees | `/people/team`, `/people/staff` | `/api/v1/team`, `/api/v1/users` |
| Attendance | `/people/attendance`, `/people/admin-attendance`, `/people/work-locations`, `/self/attendance` | `/api/v1/attendance` |
| Sales leads | `/sales`, `/sales/team` | `/api/v1/sales` |
| Task management | `/tasks`, `/tasks/team-logs` | `/api/v1/tasks`, `/api/v1/worklogs` |

Leave management (`/people/hr`, `/self/leaves`) came along with attendance —
the two share the same models and the attendance calendar reads leave state.

## Layout

```
Victory Media Dashboard/
├── Backend/     Express 5 + Mongoose + Socket.IO   (port 5000)
└── Frontend/    Vite + React + TypeScript          (port 8080)
```

## Running it

**→ [SETUP.md](SETUP.md) is the step-by-step Windows PowerShell walkthrough**,
covering both terminals, the env files, and creating your first admin. Start
there if this is a fresh machine.

The short version — two terminals, backend first:

```bash
# Terminal 1 — Backend
cd Backend
cp .env.example .env      # MONGO_URI + the two JWT secrets are mandatory
npm install
node scripts/create-admin.js --email you@example.com --password yourpassword
npm run dev               # http://localhost:5000

# Terminal 2 — Frontend
cd Frontend
cp .env.example .env.local
npm install
npm run dev               # http://localhost:8080
```

Vite proxies `/api`, `/media`, and `/socket.io` to `127.0.0.1:5000`, so the
frontend works with `VITE_API_URL` left blank in local dev.

Two things bite on a fresh setup. `ACCESS_TOKEN_SECRET` and
`REFRESH_TOKEN_SECRET` must be non-empty or login returns a 500 at the
token-signing step, *after* the password check passes. And the database starts
with no users, so `scripts/create-admin.js` is the only way to get an account
that can reach the screen where employees are added.

## Notes on what carried over

**Supporting modules.** The Sales pipeline reads and writes orders, returns,
products, inventory, and shipment tracking — a sales rep converts a lead into an
order and tracks it from the same screen. Those modules came along as
dependencies and their routes are mounted, but they have no navigation entries.
Everything outside that closure (analytics, marketing, finance, P&L, CMS,
coupons, dispatch, packaging, production, chatbot) was left behind.

**Roles and permissions.** `Frontend/src/store/sidebarStore.ts` is the single
source of truth for navigation and route access — the sidebar and `RoleGuard`
both read from it. `ROLE_ALLOWED_PATHS` was rewritten for this build; the
operational-portal roles (`ops_staff`, `production`, `dispatch`) now get
self-service plus the task board rather than a portal of their own, since the
portals were not part of the extraction.

**Configure before going live.**

- `VITE_COMPANY_UPI_ID` — shown to sales reps when a lead pays online. It was a
  hardcoded Everlive UPI ID upstream; it is now env-driven and renders
  `not-configured` until you set it.
- `CONTACT_RECIPIENTS` / `RETURNS_EMAIL` — default to Everlive inboxes upstream;
  both are blank here.

**Pre-existing type errors.** `npx tsc --noEmit` reports 22 errors, all of them
inherited verbatim from the source repo (`EditOrderModal`,
`InventoryShipmentTrackingView`, `StaffLeavesView`, `SalesPage`,
`StaffManagementPage`). Vite does not typecheck, so `npm run build` succeeds.
They were not introduced by this extraction.
