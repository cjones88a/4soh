import { prisma } from '@/lib/db';
import { getBestPerAthleteByStageAndSegment, getSeasonTotalOverall } from '@/lib/leaderboard';
import { SEGMENTS } from '@/config/segments';

export const dynamic = 'force-dynamic';

function secondsToHMS(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export default async function LeaderboardPage() {
  // Simplified: assume Stage rows exist with names matching STAGE_WINDOWS
  const stages = await prisma.stage.findMany({ orderBy: { startsOn: 'asc' } });
  const overall = SEGMENTS.OVERALL;
  const downhillA = SEGMENTS.DOWNHILL_A;
  const downhillB = SEGMENTS.DOWNHILL_B;
  const climbA = SEGMENTS.CLIMB_A;
  const climbB = SEGMENTS.CLIMB_B;

  const [overallRows, dhARows, dhBRows, climbARows, climbBRows, seasonTotals] = await Promise.all([
    stages.length && overall ? getBestPerAthleteByStageAndSegment(stages[0].id, await prisma.segment.findFirstOrThrow({ where: { stravaSegmentId: overall } }).then(s => s.id)) : Promise.resolve([]),
    stages.length && downhillA ? getBestPerAthleteByStageAndSegment(stages[0].id, await prisma.segment.findFirstOrThrow({ where: { stravaSegmentId: downhillA } }).then(s => s.id)) : Promise.resolve([]),
    stages.length && downhillB ? getBestPerAthleteByStageAndSegment(stages[0].id, await prisma.segment.findFirstOrThrow({ where: { stravaSegmentId: downhillB } }).then(s => s.id)) : Promise.resolve([]),
    stages.length && climbA ? getBestPerAthleteByStageAndSegment(stages[0].id, await prisma.segment.findFirstOrThrow({ where: { stravaSegmentId: climbA } }).then(s => s.id)) : Promise.resolve([]),
    stages.length && climbB ? getBestPerAthleteByStageAndSegment(stages[0].id, await prisma.segment.findFirstOrThrow({ where: { stravaSegmentId: climbB } }).then(s => s.id)) : Promise.resolve([]),
    stages.length && overall ? getSeasonTotalOverall(stages.map(s => s.id), await prisma.segment.findFirstOrThrow({ where: { stravaSegmentId: overall } }).then(s => s.id)) : Promise.resolve([]),
  ]);

  function Table({ title, rows }: { title: string; rows: Array<{ athleteName: string; athleteId: string; elapsedSec?: number; totalElapsedSec?: number; activityDate?: Date; stravaEffortId?: number; activityId?: number }> }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">{title}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Rank</th>
                <th className="py-2 pr-4">Athlete</th>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Strava</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.stravaEffortId ?? r.athleteId} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">{idx + 1}</td>
                  <td className="py-2 pr-4">{r.athleteName}</td>
                  <td className="py-2 pr-4">{secondsToHMS(r.elapsedSec ?? r.totalElapsedSec ?? 0)}</td>
                  <td className="py-2 pr-4">{r.activityDate ? new Date(r.activityDate).toLocaleDateString() : '-'}</td>
                  <td className="py-2 pr-4">{r.activityId ? <a className="text-blue-600 underline" href={`https://www.strava.com/activities/${r.activityId}`} target="_blank">View</a> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Leaderboards</h1>
      <p className="text-sm text-gray-600">Showing current stage only. Tabs/stage filters can be added.</p>
      <Table title="Overall" rows={overallRows} />
      <Table title="Downhill A" rows={dhARows} />
      <Table title="Downhill B" rows={dhBRows} />
      <Table title="Climb A" rows={climbARows} />
      <Table title="Climb B" rows={climbBRows} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Season Total (Overall)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Rank</th>
                <th className="py-2 pr-4">Athlete</th>
                <th className="py-2 pr-4">Total Time</th>
                <th className="py-2 pr-4">Stages</th>
              </tr>
            </thead>
            <tbody>
              {seasonTotals.map((r, idx: number) => (
                <tr key={r.athleteId} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">{idx + 1}</td>
                  <td className="py-2 pr-4">{r.athleteName}</td>
                  <td className="py-2 pr-4">{secondsToHMS(r.totalElapsedSec)}</td>
                  <td className="py-2 pr-4">{r.stagesCompleted}/4</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
