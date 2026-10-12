# CampusEats – SE3090 Lab 11 (DevOps & Cloud Hosting)

Full-stack CampusEats app prepared for cloud deployment.

| Tier | Folder | Tech | Host |
|------|--------|------|------|
| Frontend | `campuseats-web/` | React 18 + Vite | Vercel (or Netlify) |
| Backend API | `campuseats-api/` | ASP.NET Core 8 Web API + EF Core | Render (Docker) (or Railway) |
| Database | – | PostgreSQL 16 | Neon (or Supabase) |

```
Browser → Frontend (Vercel) → Backend API (Render) → Database (Neon)
          VITE_API_URL ─────┘   ConnectionStrings__Default ─┘
```

## Environment variables

| Tier | Variable | Example / notes |
|------|----------|-----------------|
| Frontend | `VITE_API_URL` | `https://campuseats-api.onrender.com` (no trailing slash; baked in at build time → redeploy after changing) |
| Backend | `ConnectionStrings__Default` | `Host=<neon-host>;Database=campuseats;Username=<user>;Password=<pwd>;SSL Mode=Require;Trust Server Certificate=true` |
| Backend | `Jwt__Key` | long random secret, ≥ 32 chars, different from dev |
| Backend | `Jwt__Issuer` / `Jwt__Audience` | `CampusEats` / `CampusEatsUsers` |
| Backend | `Cors__AllowedOrigins` | `https://campuseats-web.vercel.app` (exact origin, comma-separate several) |
| Backend | `ASPNETCORE_ENVIRONMENT` | `Production` |
| Backend (optional) | `Database__MigrateOnStartup` | `true` to apply EF migrations when the container starts |

No secret is committed: `appsettings.json` leaves the connection string and JWT key empty, and the API refuses to start without them.

## Run locally

```bash
# Postgres
docker run -d --name ce-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=campuseats -p 5432:5432 postgres:16-alpine

# API (http://localhost:8080, Swagger at /swagger)
cd campuseats-api
dotnet ef database update
dotnet run

# Frontend (http://localhost:5173, /api is proxied to :8080)
cd campuseats-web
npm install
npm run dev
```

## Deploy

1. **Neon** – create project `campuseats`, copy the connection details, then from `campuseats-api/`:
   ```powershell
   $env:ConnectionStrings__Default="Host=<neon-host>;Database=campuseats;Username=<user>;Password=<pwd>;SSL Mode=Require;Trust Server Certificate=true"
   dotnet ef database update
   ```
2. **Render** – New → Web Service → this repo, Root Directory `campuseats-api`, Runtime Docker, Health Check Path `/health`; add the backend env vars above. (Or New → Blueprint, which reads `render.yaml`.)
3. **Vercel** – Add New → Project → this repo, Root Directory `campuseats-web`, preset Vite (`npm run build` → `dist`); add `VITE_API_URL` = Render URL.
4. Put the Vercel URL into Render's `Cors__AllowedOrigins`, and the Render URL into Vercel's `VITE_API_URL`; redeploy both.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | – (DB health check) |
| GET | `/api/menu` | – |
| GET | `/api/menuItems?q=&category=&_page=&_limit=` | – (`X-Total-Count` header) |
| PATCH | `/api/menuItems/{id}` | – |
| POST | `/api/auth/login` `{ "role": "student" \| "admin" }` | – returns JWT |
| GET | `/api/orders` | JWT (students see only their own) |
| PATCH | `/api/orders/{id}` | JWT |
