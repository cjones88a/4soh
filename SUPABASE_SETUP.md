# Supabase Setup Guide

## 1. Get Your Supabase Credentials

1. Go to your Supabase project: https://gpgeqifprvrsqrlsxsju.supabase.co
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL**: `https://gpgeqifprvrsqrlsxsju.supabase.co`
   - **anon public key**: (starts with `eyJ...`)

## 2. Get Database Connection String

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Copy the **URI** connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.gpgeqifprvrsqrlsxsju.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual database password

## 3. Update Environment Variables

Edit `.env` file with your actual values:

```env
# Supabase Configuration
SUPABASE_URL=https://gpgeqifprvrsqrlsxsju.supabase.co
SUPABASE_ANON_KEY=eyJ...your_actual_anon_key_here

# Database URL for Prisma
DATABASE_URL="postgresql://postgres:your_actual_password@db.gpgeqifprvrsqrlsxsju.supabase.co:5432/postgres?schema=public"

# Strava Configuration (fill these in later)
STRAVA_CLIENT_ID=your_strava_client_id_here
STRAVA_CLIENT_SECRET=your_strava_client_secret_here
STRAVA_VERIFY_TOKEN=your_webhook_verify_token_here
STRAVA_REDIRECT_URI=http://localhost:3000/api/strava/callback
```

## 4. Set Up Database Schema

Run these commands to create the database tables:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Set up initial data (seasons, stages, segments)
npm run db:setup
```

## 5. Configure Strava (Optional for now)

1. Go to https://www.strava.com/settings/api
2. Create a new application
3. Set **Authorization Callback Domain** to `localhost:3000`
4. Copy the **Client ID** and **Client Secret** to your `.env` file
5. Set a random **Webhook Verify Token** (e.g., `my-secret-webhook-token`)

## 6. Configure Segments

Edit `config/segments.ts` with your actual Strava segment IDs:

```typescript
export const SEGMENTS: Record<SegmentKeys, number> = {
  OVERALL: 12345678,      // Replace with actual Strava Segment ID
  DOWNHILL_A: 87654321,   // Replace with actual ID
  DOWNHILL_B: 11223344,   // Replace with actual ID
  CLIMB_A: 55667788,      // Replace with actual ID
  CLIMB_B: 99887766,      // Replace with actual ID
};
```

## 7. Start Development Server

```bash
npm run dev
```

Your app will be available at http://localhost:3000

## 8. Test Webhook (Optional)

Once you have Strava configured, you can test the webhook:

```bash
# Verify webhook subscription
curl -G "http://localhost:3000/api/strava/webhook" \
  --data-urlencode "hub.mode=subscribe" \
  --data-urlencode "hub.verify_token=your_webhook_verify_token" \
  --data-urlencode "hub.challenge=test123"

# Should return: {"hub.challenge":"test123"}
```

## Next Steps

1. Visit `/connect` to test Strava OAuth
2. Visit `/leaderboard` to see the leaderboard (will be empty until you have data)
3. Visit `/admin` to manage efforts (once you have some data)
4. Set up your Strava webhook to point to your deployed URL
