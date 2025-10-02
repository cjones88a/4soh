import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/strava';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const clientId = process.env.STRAVA_CLIENT_ID!;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET!;

  try {
    const token = await exchangeCodeForToken({ clientId, clientSecret, code });
    const athleteId = token.athlete?.id;
    if (!athleteId) return NextResponse.json({ error: 'No athlete in token' }, { status: 400 });

    const name = [token.athlete?.firstname, token.athlete?.lastname].filter(Boolean).join(' ').trim() || token.athlete?.username || String(athleteId);

    const athlete = await prisma.athlete.upsert({
      where: { stravaAthleteId: athleteId },
      update: { name },
      create: { stravaAthleteId: athleteId, name },
    });

    await prisma.stravaToken.upsert({
      where: { athleteId: athlete.id },
      update: {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt: token.expires_at,
        tokenScope: token.scope,
      },
      create: {
        athleteId: athlete.id,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt: token.expires_at,
        tokenScope: token.scope,
      },
    });

    const redirect = new URL('/connect?connected=1', req.nextUrl.origin);
    redirect.searchParams.set('name', encodeURIComponent(name));
    return NextResponse.redirect(redirect);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'OAuth failed', details: errorMessage }, { status: 500 });
  }
}
