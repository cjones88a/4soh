import { prisma } from '@/lib/db';

export type LeaderboardRow = {
  athleteName: string;
  athleteId: string;
  elapsedSec: number;
  activityDate: Date;
  stravaEffortId: number;
  activityId: number;
};

export async function getBestPerAthleteByStageAndSegment(stageId: string, segmentId: string) {
  const efforts = await prisma.effort.findMany({
    where: { stageId, segmentId, isValid: true },
    include: { athlete: true },
    orderBy: [{ elapsedSec: 'asc' }, { activityDate: 'asc' }],
  });
  const seen = new Set<string>();
  const best: LeaderboardRow[] = [];
  for (const e of efforts) {
    if (seen.has(e.athleteId)) continue;
    seen.add(e.athleteId);
    best.push({
      athleteName: e.athlete.name ?? `Athlete ${e.athleteId.slice(0, 6)}`,
      athleteId: e.athleteId,
      elapsedSec: e.elapsedSec,
      activityDate: e.activityDate,
      stravaEffortId: e.stravaEffortId,
      activityId: e.activityId,
    });
  }
  return best;
}

export async function getSeasonTotalOverall(stageIds: string[], overallSegmentId: string) {
  const perStage = await Promise.all(
    stageIds.map(async (stageId) => {
      const rows = await getBestPerAthleteByStageAndSegment(stageId, overallSegmentId);
      return rows;
    })
  );
  const totals = new Map<string, { name: string; total: number; stagesCompleted: number }>();
  stageIds.forEach((_, idx) => {
    for (const row of perStage[idx]) {
      const existing = totals.get(row.athleteId) || { name: row.athleteName, total: 0, stagesCompleted: 0 };
      existing.total += row.elapsedSec;
      existing.stagesCompleted += 1;
      totals.set(row.athleteId, existing);
    }
  });
  const result = Array.from(totals.entries()).map(([athleteId, { name, total, stagesCompleted }]) => ({
    athleteId,
    athleteName: name,
    totalElapsedSec: stagesCompleted === 4 ? Math.max(0, total - 600) : total,
    stagesCompleted,
  }));
  result.sort((a, b) => a.totalElapsedSec - b.totalElapsedSec);
  return result;
}
