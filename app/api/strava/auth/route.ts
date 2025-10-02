import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Missing STRAVA_CLIENT_ID or STRAVA_REDIRECT_URI' }, { status: 500 });
  }
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    approval_prompt: 'auto',
    scope: 'read,activity:read,activity:read_all',
  });
  const url = `https://www.strava.com/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(url);
}
