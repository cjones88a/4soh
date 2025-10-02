# Strava OAuth Issue Analysis

## Current Problem
Strava OAuth is returning "Bad Request" with `"field":"redirect_uri","code":"invalid"` despite clean URLs.

## Project Overview
- **Framework**: Next.js 14 with App Router, TypeScript
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **OAuth**: Strava OAuth 2.0 flow

## Current OAuth Implementation

### OAuth Route (`app/api/strava/auth/route.ts`)
```typescript
export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Missing STRAVA_CLIENT_ID' }, { status: 500 });
  }
  
  // Use the current production URL directly - no environment variable to avoid line breaks
  const redirectUri = 'https://race-tracker-mb6mlvmq9-cjones88as-projects.vercel.app/api/strava/callback';
  
  const params = new URLSearchParams({
    client_id: clientId.trim(),
    response_type: 'code',
    redirect_uri: redirectUri,
    approval_prompt: 'auto',
    scope: 'read,activity:read,activity:read_all',
  });
  const url = `https://www.strava.com/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(url);
}
```

### OAuth Callback Route (`app/api/strava/callback/route.ts`)
```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error: 'OAuth error', details: error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Token exchange failed', details: tokens }, { status: 400 });
    }

    // Store tokens in database
    await prisma.stravaToken.upsert({
      where: { stravaAthleteId: tokens.athlete.id.toString() },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expires_at * 1000),
      },
      create: {
        stravaAthleteId: tokens.athlete.id.toString(),
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expires_at * 1000),
      },
    });

    return NextResponse.redirect('/connect?connected=true');
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'OAuth failed', details: errorMessage }, { status: 500 });
  }
}
```

## Environment Variables (Vercel)
- `STRAVA_CLIENT_ID`: 179098
- `STRAVA_CLIENT_SECRET`: [REDACTED]
- `STRAVA_VERIFY_TOKEN`: [REDACTED]
- `DATABASE_URL`: [Supabase connection string]
- `NEXT_PUBLIC_SUPABASE_URL`: [Supabase URL]
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: [Supabase anon key]

## Current Production URLs
- **Latest deployment**: https://race-tracker-mb6mlvmq9-cjones88as-projects.vercel.app
- **OAuth redirect URI**: https://race-tracker-mb6mlvmq9-cjones88as-projects.vercel.app/api/strava/callback

## Error Details
When visiting `/connect` and clicking "Connect with Strava", the OAuth URL generated is:
```
https://www.strava.com/oauth/authorize?client_id=179098&response_type=code&redirect_uri=https%3A%2F%2Frace-tracker-mb6mlvmq9-cjones88as-projects.vercel.app%2Fapi%2Fstrava%2Fcallback&approval_prompt=auto&scope=read%2Cactivity%3Aread%2Cactivity%3Aread_all
```

This URL is clean (no line breaks), but Strava returns:
```json
{
  "message": "Bad Request",
  "errors": [
    {
      "resource": "Application",
      "field": "redirect_uri",
      "code": "invalid"
    }
  ]
}
```

## Strava App Configuration
- **Client ID**: 179098
- **Authorization Callback Domain**: Currently set to `race-tracker-j2aaeeffv-cjones88as-projects.vercel.app` (old URL)
- **Website**: [Not set]
- **Application Description**: [Not set]

## Previous Issues Resolved
1. ✅ **Line breaks in URLs**: Fixed by hardcoding redirect URI
2. ✅ **Environment variable issues**: Resolved by using direct URL
3. ✅ **Build errors**: Fixed by removing problematic scripts
4. ✅ **TypeScript errors**: Resolved schema and type issues

## Current Hypothesis
The issue is likely that the **Authorization Callback Domain** in the Strava app settings doesn't match the current production URL. The domain is set to the old Vercel URL, but we're using a new deployment URL.

## Next Steps for Investigation
1. **Update Strava App Settings**: Change Authorization Callback Domain to `race-tracker-mb6mlvmq9-cjones88as-projects.vercel.app`
2. **Verify URL encoding**: Ensure the redirect_uri is properly URL-encoded
3. **Check Strava API documentation**: Verify the exact format requirements for redirect_uri
4. **Test with different redirect URIs**: Try with and without trailing slashes, different protocols, etc.

## Files to Review
- `app/api/strava/auth/route.ts` - OAuth initiation
- `app/api/strava/callback/route.ts` - OAuth callback handling
- `app/connect/page.tsx` - Connect page UI
- `prisma/schema.prisma` - Database schema
- `config/segments.ts` - Segment configuration

## Database Schema
```prisma
model StravaToken {
  id              String   @id @default(cuid())
  stravaAthleteId String   @unique
  accessToken     String
  refreshToken    String
  expiresAt       DateTime
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Target Segment
- **Segment ID**: 3407862085591628422 (Overall segment)
- **Goal**: Fetch September 2025 activities for 2025/2026 season
