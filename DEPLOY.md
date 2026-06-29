# Guía de Despliegue — Dominican HCI Club

Web **premium-only** (Astro 5 SSR + adaptador Node standalone). Build con **Bun** vía Nixpacks en Dokploy.

## Builder (Nixpacks + Bun)

`nixpacks.toml` fuerza Bun (Nixpacks usaría npm por defecto) y conserva `node`
auto-detectado porque el `start` corre `node ./dist/server/entry.mjs`:

1. **Install:** `bun install --frozen-lockfile`
2. **Build:** `bun run build`
3. **Start:** `bun run start`

> Si el servicio en Dokploy define Build/Start commands explícitos, esos ganan;
> replicá los de arriba.

## Variables de entorno (Dokploy)

**Validación de env de Astro (importante):**
- Las `PUBLIC_*` se inlinean en **build** → deben ir como **Build-time variables / build args**, no solo runtime.
- Los secrets (`SERVER_URL`, `BUSINESS_API_KEY`, `SECRET_KEY`) se validan en runtime → runtime env.

| Variable | Valor prod | Cuándo |
|---|---|---|
| `SERVER_URL` | `https://api.llovio.com/` | runtime (secret) |
| `BUSINESS_API_KEY` | live key del negocio 9 (rotada) — **solo en Dokploy** | runtime (secret) |
| `SECRET_KEY` | secreto real (`openssl rand -hex 32`) | runtime (secret) |
| `REDIS_URL` | `redis://<redis-clientes>:6379` (instancia compartida; prefijo `hci` en config) | runtime |
| `PUBLIC_PREMIUM_PLAN_ID` | `2` | **build arg** + runtime |
| `NODE_ENV` | `production` | build + runtime |
| `HOST` / `PORT` | `0.0.0.0` / `4321` (o el que inyecte Dokploy) | runtime |
| `GMAIL_USER` / `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` / `GMAIL_REFRESH_TOKEN` | credenciales del negocio | runtime |

Nunca commitear valores reales — solo placeholders en `.env.example`.

## Sesiones (Redis)

Astro Sessions con driver **Redis** (`astro.config.mjs`), instancia **compartida entre
clientes** con prefijo `base: 'hci'`. Requiere `REDIS_URL` + la dep `ioredis`. Sin
`REDIS_URL`, ioredis cae a `localhost:6379` y las sesiones no persisten (todos los
miembros logueados se desloguean en cada restart).

## Dominio

`dominicanhciclub.com` (DNS + cert en Dokploy/Traefik). Los emails de bienvenida
hardcodean `https://dominicanhciclub.com/...` → el dominio de deploy debe coincidir.

## Verificación local del build de prod

```bash
bun install
bun run build
REDIS_URL=redis://localhost:6379 bun run start   # necesita un Redis local
# App en http://localhost:4321
```
