import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.STRAVA_VERIFY_TOKEN && challenge) {
    return NextResponse.json({ 'hub.challenge': challenge });
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST() {
  // Simplified webhook - just return OK for now
  return NextResponse.json({ ok: true });
}
