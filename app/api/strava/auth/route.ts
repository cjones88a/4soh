import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Missing STRAVA_CLIENT_ID' }, { status: 500 });
  }
  
  // Use environment variable with fallback for flexibility
  const redirectUri = process.env.STRAVA_REDIRECT_URI || 'https://race-tracker-mb6mlvmq9-cjones88as-projects.vercel.app/api/strava/callback';
  
  // Validate redirect URI in production
  if (process.env.NODE_ENV === 'production' && !redirectUri.startsWith('https://')) {
    return NextResponse.json({ error: 'Invalid redirect URI for production' }, { status: 500 });
  }
  
  // Generate state for CSRF protection
  const state = randomUUID();
  
  // Store state in secure cookie
  const cookieStore = await cookies();
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  });
  
  const params = new URLSearchParams({
    client_id: clientId.trim(),
    response_type: 'code',
    redirect_uri: redirectUri,
    approval_prompt: 'auto',
    scope: 'profile:read,activity:read,activity:read_all', // Updated scopes
    state: state, // CSRF protection
  });
  const url = `https://www.strava.com/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(url);
}
