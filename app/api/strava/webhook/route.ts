import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { refreshAccessToken, fetchActivity, fetchSegmentEfforts } from '@/lib/strava';
import { isDisallowedSportType, isWithinAnyStageWindow } from '@/lib/validation';
import { SEGMENTS } from '@/config/segments';

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

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const aspect_type = payload?.aspect_type as string | undefined;
  const object_type = payload?.object_type as string | undefined;
  const object_id = payload?.object_id as number | undefined;
  const owner_id = payload?.owner_id as number | undefined;

  if (object_type !== 'activity' || !object_id || !owner_id) {
    return NextResponse.json({ ok: true });
  }
  if (aspect_type !== 'create' && aspect_type !== 'update') {
    return NextResponse.json({ ok: true });
  }

  const athlete = await prisma.athlete.findUnique({ where: { stravaAthleteId: owner_id }, include: { tokens: true } });
  if (!athlete || !athlete.tokens) return NextResponse.json({ ok: true });

  let accessToken = athlete.tokens.accessToken;
  if (athlete.tokens.expiresAt * 1000 < Date.now() + 60_000) {
    try {
      const refreshed = await refreshAccessToken({
        clientId: process.env.STRAVA_CLIENT_ID!,
        clientSecret: process.env.STRAVA_CLIENT_SECRET!,
        refreshToken: athlete.tokens.refreshToken,
      });
      await prisma.stravaToken.update({
        where: { athleteId: athlete.id },
        data: {
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token,
          expiresAt: refreshed.expires_at,
          tokenScope: refreshed.scope,
        },
      });
      accessToken = refreshed.access_token;
    } catch (e) {
      return NextResponse.json({ ok: true });
    }
  }

  const activity = await fetchActivity({ accessToken, activityId: object_id });
  if (isDisallowedSportType(activity.sport_type)) return NextResponse.json({ ok: true });

  const startDate = new Date(activity.start_date);
  const win = isWithinAnyStageWindow(startDate);
  if (!win.inWindow) return NextResponse.json({ ok: true });

  const stage = await prisma.stage.findFirst({ where: { name: win.stageName } });
  if (!stage) return NextResponse.json({ ok: true });

  const segmentIds = Object.values(SEGMENTS).filter((id) => id && id > 0);

  for (const segId of segmentIds) {
    const efforts = await fetchSegmentEfforts({ accessToken, segmentId: segId, athleteId: owner_id, startDate, endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 24) });
    for (const eff of efforts) {
      try {
        const segment = await prisma.segment.upsert({
          where: { stravaSegmentId: eff.segment.id },
          update: {},
          create: {
            name: String(eff.segment.id),
            stravaSegmentId: eff.segment.id,
            type: 'OVERALL',
            lane: 'NONE',
          },
        });

        await prisma.effort.upsert({
          where: { stravaEffortId: eff.id },
          update: {},
          create: {
            athleteId: athlete.id,
            stageId: stage.id,
            segmentId: segment.id,
            stravaEffortId: eff.id,
            activityId: eff.activity.id,
            activityDate: new Date(eff.start_date),
            elapsedSec: eff.elapsed_time,
          },
        });
      } catch (e) {
        // ignore duplicates or minor errors
      }
    }
  }

  return NextResponse.json({ ok: true });
}
