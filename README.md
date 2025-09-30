# Race Tracker MVP

Production-ready MVP for a standalone race-tracking site embeddable via `<iframe>`.

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Prisma + Postgres (Supabase)
- Supabase Auth (admin)
- Zod, node-fetch
- Sentry (stub ready)

## Setup
1. Install deps
```bash
npm install
```
2. Configure env
Copy `.env.example` to `.env` and fill values:
```
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
STRAVA_VERIFY_TOKEN=
STRAVA_REDIRECT_URI=
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=
```
3. Prisma
```bash
npx prisma generate
# then push or migrate when DB is reachable
# npx prisma db push
```

## Strava OAuth
- `/api/strava/auth` → redirects to Strava
- `/api/strava/callback` → exchanges code for tokens and stores athlete + tokens

## Webhook
- `GET /api/strava/webhook` → verify `hub.challenge`
- `POST /api/strava/webhook` → on activity create/update: fetch activity, check stage window, fetch segment efforts, upsert efforts

### Verify with curl
```
curl -G "http://localhost:3000/api/strava/webhook" \
  --data-urlencode "hub.mode=subscribe" \
  --data-urlencode "hub.verify_token=$STRAVA_VERIFY_TOKEN" \
  --data-urlencode "hub.challenge=abc123"
```

### Simulate event (POST)
```
curl -X POST http://localhost:3000/api/strava/webhook \
  -H 'Content-Type: application/json' \
  -d '{
    "object_type":"activity",
    "object_id":1234567890,
    "aspect_type":"create",
    "owner_id":1111111
  }'
```

## Leaderboards
- `/leaderboard` shows Overall, DH A/B, Climb A/B tables and season totals

## Admin
- `/admin` simple dashboard to view efforts, toggle validity, and recompute (stub)

## Embedding
Headers set in `next.config.js` to allow iframe embedding (`X-Frame-Options: ALLOWALL`, `CSP frame-ancestors *`).

## Notes
- Configure `config/stages.ts` and `config/segments.ts` with real values.
- Add Supabase Auth gating on admin endpoints before production.
