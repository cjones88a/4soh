import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) return NextResponse.json({ error: 'OAuth error', details: error }, { status: 400 });
  if (!code) return NextResponse.json({ error: 'No authorization code' }, { status: 400 });

  const clientId = process.env.STRAVA_CLIENT_ID!;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET!;
  const redirectUri = process.env.STRAVA_REDIRECT_URI!; // include in token exchange

  try {
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri, // REQUIRED to match authorize step
    });

    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      // Helpful logging while debugging:
      console.error('Token exchange failed', tokenResponse.status, tokens);
      return NextResponse.json({ error: 'Token exchange failed', details: tokens }, { status: 400 });
    }

    const athleteId = tokens.athlete?.id;
    if (!athleteId) return NextResponse.json({ error: 'No athlete in token' }, { status: 400 });

    const name = [tokens.athlete?.firstname, tokens.athlete?.lastname].filter(Boolean).join(' ').trim() || tokens.athlete?.username || String(athleteId);

    const athlete = await prisma.athlete.upsert({
      where: { stravaAthleteId: String(athleteId) },
      update: { name },
      create: { stravaAthleteId: String(athleteId), name },
    });

    await prisma.stravaToken.upsert({
      where: { stravaAthleteId: String(athleteId) },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expires_at * 1000),
      },
      create: {
        stravaAthleteId: String(athleteId),
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expires_at * 1000),
      },
    });

    return NextResponse.redirect('/connect?connected=true');
  } catch (e: any) {
    return NextResponse.json({ error: 'OAuth failed', details: e?.message ?? String(e) }, { status: 500 });
  }
}
