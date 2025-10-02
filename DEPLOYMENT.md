# Deployment Guide

## Deploy to Vercel

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add all variables from `.env`:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `DATABASE_URL`
     - `STRAVA_CLIENT_ID`
     - `STRAVA_CLIENT_SECRET`
     - `STRAVA_VERIFY_TOKEN`
     - `STRAVA_REDIRECT_URI` (update to your Vercel domain)

3. **Update Strava App Settings:**
   - Go to https://www.strava.com/settings/api
   - Update **Authorization Callback Domain** to your Vercel domain
   - Update **Webhook URL** to `https://your-app.vercel.app/api/strava/webhook`

## Embed in 4SOH.org

Once deployed, you can embed the race tracker in your 4SOH project:

### Option 1: Direct iframe
```html
<iframe 
  src="https://your-race-tracker.vercel.app/leaderboard" 
  width="100%" 
  height="800px"
  frameborder="0"
  title="Race Leaderboards">
</iframe>
```

### Option 2: Responsive iframe
```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
  <iframe 
    src="https://your-race-tracker.vercel.app/leaderboard"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    title="Race Leaderboards">
  </iframe>
</div>
```

### Option 3: Multiple Pages
You can embed different pages:
- `/leaderboard` - Main leaderboards
- `/connect` - Strava connection page
- `/admin` - Admin dashboard (if needed)

## Custom Domain (Optional)

1. **Add Custom Domain in Vercel:**
   - Project Settings → Domains
   - Add your custom domain (e.g., `race-tracker.4soh.org`)

2. **Update DNS:**
   - Point your domain to Vercel's servers
   - Update Strava callback URL to use custom domain

## Post-Deployment Setup

1. **Run Database Setup:**
   ```bash
   # Connect to your deployed app and run:
   npm run db:setup
   ```

2. **Configure Segments:**
   - Edit `config/segments.ts` with real Strava segment IDs
   - Redeploy or update via admin interface

3. **Test Webhook:**
   ```bash
   curl -G "https://your-app.vercel.app/api/strava/webhook" \
     --data-urlencode "hub.mode=subscribe" \
     --data-urlencode "hub.verify_token=your_webhook_verify_token" \
     --data-urlencode "hub.challenge=test123"
   ```

## Monitoring

- **Vercel Analytics:** Built-in performance monitoring
- **Sentry:** Error tracking (configured but not active)
- **Database:** Monitor via Supabase dashboard

## Security Notes

- All admin endpoints should be protected with Supabase Auth
- Webhook verification is implemented
- Rate limiting handled by Strava API
- CORS configured for iframe embedding
