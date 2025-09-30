import { z } from 'zod';

const STRAVA_BASE = 'https://www.strava.com/api/v3';

const TokenSchema = z.object({
  token_type: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  expires_in: z.number(),
  athlete: z.object({ id: z.number(), firstname: z.string().optional(), lastname: z.string().optional(), username: z.string().nullable().optional() }).optional(),
  scope: z.string().optional(),
});

const ActivitySchema = z.object({
  id: z.number(),
  athlete: z.object({ id: z.number() }).optional(),
  sport_type: z.string(),
  start_date: z.string(),
});

const SegmentEffortSchema = z.object({
  id: z.number(),
  elapsed_time: z.number(),
  start_date: z.string(),
  segment: z.object({ id: z.number() }),
  activity: z.object({ id: z.number() }),
});

export type TokenResponse = z.infer<typeof TokenSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type SegmentEffort = z.infer<typeof SegmentEffortSchema>;

async function stravaFetch(url: string, init?: RequestInit, attempt = 0): Promise<Response> {
  const resp = await fetch(url, init);
  if (resp.status === 429 && attempt < 3) {
    const retryAfter = Number(resp.headers.get('retry-after') || '1');
    await new Promise((r) => setTimeout(r, (retryAfter + 1) * 1000));
    return stravaFetch(url, init, attempt + 1);
  }
  return resp;
}

export async function exchangeCodeForToken(params: { clientId: string; clientSecret: string; code: string; }): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    code: params.code,
    grant_type: 'authorization_code',
  });
  const resp = await stravaFetch('https://www.strava.com/oauth/token', { method: 'POST', body });
  const json = await resp.json();
  return TokenSchema.parse(json);
}

export async function refreshAccessToken(params: { clientId: string; clientSecret: string; refreshToken: string; }): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: params.refreshToken,
  });
  const resp = await stravaFetch('https://www.strava.com/oauth/token', { method: 'POST', body });
  const json = await resp.json();
  return TokenSchema.parse(json);
}

export async function fetchActivity(params: { accessToken: string; activityId: number; }): Promise<Activity> {
  const resp = await stravaFetch(`${STRAVA_BASE}/activities/${params.activityId}`, {
    headers: { Authorization: `Bearer ${params.accessToken}` },
  });
  const json = await resp.json();
  return ActivitySchema.parse(json);
}

export async function fetchSegmentEfforts(params: { accessToken: string; segmentId: number; athleteId?: number; startDate?: Date; endDate?: Date; page?: number; perPage?: number; }): Promise<SegmentEffort[]> {
  const search = new URLSearchParams();
  search.set('segment_id', String(params.segmentId));
  if (params.athleteId) search.set('athlete_id', String(params.athleteId));
  if (params.startDate) search.set('start_date_local', params.startDate.toISOString());
  if (params.endDate) search.set('end_date_local', params.endDate.toISOString());
  if (params.page) search.set('page', String(params.page));
  if (params.perPage) search.set('per_page', String(params.perPage));

  const resp = await stravaFetch(`${STRAVA_BASE}/segment_efforts?${search.toString()}`, {
    headers: { Authorization: `Bearer ${params.accessToken}` },
  });
  const json = await resp.json();
  return z.array(SegmentEffortSchema).parse(json);
}
