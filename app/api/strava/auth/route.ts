import { NextResponse } from 'next/server';

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
