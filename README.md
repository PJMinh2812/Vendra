# Vendra — Multi-Vendor Marketplace Backend

A multi-vendor e-commerce backend built with ASP.NET Core Web API (.NET 10), designed and implemented as a self-directed learning project to practice production-style backend patterns: layered architecture, generic Repository + Unit of Work, transactional checkout, JWT auth with role-based access control, real third-party payment gateway integration, centralized error handling, and caching.

Status: core backend (catalog, cart, checkout, orders, auth, caching) is complete and tested end-to-end. An AI Shopping Assistant (RAG-based) is planned but not yet implemented — see [Roadmap](#roadmap).

## Tech stack

- **Backend:** ASP.NET Core Web API (.NET 10), C#
- **Architecture:** 3-layer — `Vendra.Api` → `Vendra.Business` → `Vendra.DataAccess` (one-way dependency)
- **Data access:** Entity Framework Core — database-first scaffolding for business tables, code-first for Identity
- **Database:** SQL Server (via Docker)
- **Auth:** ASP.NET Core Identity + JWT (access + refresh token with rotation)
- **Payments:** MoMo Sandbox (real gateway integration, HMAC-SHA256 signed requests and webhook verification)
- **Caching:** `IMemoryCache` (catalog search, custom invalidation) + ASP.NET Core Output Caching (simple GETs)
- **Frontend:** React (Vite) — mock-data-driven UI, in `frontend/`

## Architecture

```
Vendra.Api          → Controllers, middleware, DI wiring, appsettings
Vendra.Business      → DTOs, Services (business rules), Settings (Options pattern)
Vendra.DataAccess    → EF Core models, generic Repository<T> + UnitOfWork, Identity
```

- **Generic Repository + Unit of Work**: `IRepository<T>` wraps common CRUD + an `IQueryable<T> Query()` escape hatch for filtering/paging; `IUnitOfWork` gives every `Service` a shared `DbContext` so multi-table writes (e.g. checkout) commit in a single `SaveChangesAsync()`.
- **Two `DbContext`s, one database**: `VendraDbContext` (database-first, scaffolded from `backend/db/schema.sql`) owns business tables; `AppIdentityDbContext` (code-first, EF Migrations) owns `AspNetUsers`/`AspNetRoles`/`RefreshTokens`. Both point at the same physical `VendraDb`.
- **Order model**: `Order` → many `SubOrder` (one per shop in the cart) → many `OrderItem`, so each shop can track its own shipping status independently within a single customer order.

## Project structure

```
backend/
  db/schema.sql, seed.sql       # source-of-truth SQL schema + seed data
  src/
    Vendra.Api/                 # Controllers, Middleware, Program.cs
    Vendra.Business/            # DTOs, Services, Settings
    Vendra.DataAccess/          # EF Core models, Repository/UnitOfWork, Identity
frontend/                       # React (Vite) mock frontend
docs/                           # planning docs (interview prep notes are gitignored, local only)
```

## Getting started

### Prerequisites

- .NET 10 SDK
- Docker (for SQL Server)
- Node.js (for the frontend, optional)

### 1. Start SQL Server

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<your-password>" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

Then run `backend/db/schema.sql` followed by `backend/db/seed.sql` against the `VendraDb` database (e.g. via `sqlcmd` or Azure Data Studio).

### 2. Configure secrets

From `backend/src/Vendra.Api/`:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=VendraDb;User Id=sa;Password=<your-password>;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:SecretKey" "<a long random string>"
dotnet user-secrets set "MoMo:SecretKey" "K951B6PE1waDMi640xX08PD3vg6EkVlz"
```

The MoMo secret key above is MoMo's own published Sandbox test credential (from their public [`momo-wallet/payment`](https://github.com/momo-wallet/payment) sample repo) — safe to use as-is for local testing.

Non-secret config (`Jwt:Issuer`, `MoMo:PartnerCode`/`AccessKey`/`Endpoint`, CORS origins) already lives in `appsettings.json`.

### 3. Run

```bash
cd backend/src/Vendra.Api
dotnet run --launch-profile http
```

API listens on `http://localhost:5270`. Swagger UI is available at `/swagger` in Development.

A publicly reachable `MoMo:IpnUrl` (e.g. via `cloudflared tunnel --url http://localhost:5270`) is only needed to test the MoMo IPN webhook end-to-end; checkout and payment-link creation work without it.

### 4. Frontend (optional)

```bash
cd frontend
npm install
npm run dev
```

## API overview

All endpoints are under `/api`. Auth uses `Authorization: Bearer <token>`.

| Controller | Route | Role | Notes |
|---|---|---|---|
| Auth | `POST /auth/register`, `/login`, `/refresh`, `/revoke` | — | Refresh tokens rotate on use |
| Categories | `GET /categories` | — | Output-cached |
| Products | `GET /products`, `GET /products/{id}` | — | List is `IMemoryCache`d (catalog search); detail is output-cached |
| Products | `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}` | Seller | Ownership-checked; requires an Approved shop |
| Shops | `POST /shops`, `GET /shops/mine` | Seller | Register/view own shop |
| Shops | `GET /shops`, `PUT /shops/{id}/approve`, `/reject` | Admin | Shop approval workflow |
| Cart | `GET/POST /cart`, `PUT/DELETE /cart/{productId}` | Customer | |
| Orders | `POST /orders` | Customer | Checkout — COD or MoMo, single transaction |
| Orders | `GET /orders`, `GET /orders/{id}` | Customer | Own orders only (404 if not owned) |
| Orders | `GET /orders/shop` | Seller | Suborders scoped to own shop only |
| Orders | `GET /orders/all` | Admin | All orders, paginated |
| Payments | `POST /payments/momo-ipn` | — (signature-verified) | MoMo webhook callback |

## Key design decisions

- **Mass-assignment protection**: client-controllable fields that should be server-derived (`ShopId` on product create, `OwnerUserId` on shop register) are never accepted from the request body — they're resolved from the authenticated user's JWT claims.
- **Snapshot pattern**: `OrderItem.ProductName`/`UnitPrice` are copied at order time, not live-referenced, so past orders stay accurate if a product's price or name changes later.
- **Payment security**: the MoMo IPN webhook is public (`[AllowAnonymous]`, since MoMo can't send a JWT) but every callback's HMAC-SHA256 signature is verified before any `Payment` status is trusted — forged callbacks are rejected with `400`.
- **Centralized error handling**: a single `ExceptionHandlingMiddleware` maps `InvalidOperationException` → 400, `UnauthorizedAccessException` → 401, and anything else → 500 (full details logged server-side, generic message to the client) — no per-controller try/catch.
- **Cache invalidation**: catalog search uses a shared `CancellationTokenSource` so any Product write instantly invalidates every cached search-result page, instead of waiting out a TTL.

## Roadmap

- [x] Product catalog, search/filter/paging
- [x] Identity, JWT + refresh token rotation, role-based authorization
- [x] Shop registration/approval, seller product ownership
- [x] Cart
- [x] Checkout with real DB transaction, COD + MoMo Sandbox payment
- [x] Order viewing scoped per role (Customer/Seller/Admin)
- [x] Centralized exception handling
- [x] Caching (IMemoryCache + Output Caching)
- [ ] AI Shopping Assistant (RAG, via Semantic Kernel) — paused
