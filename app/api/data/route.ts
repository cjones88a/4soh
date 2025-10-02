import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getBestPerAthleteByStageAndSegment, getSeasonTotalOverall } from '@/lib/leaderboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the current season and stages
    const season = await prisma.season.findFirst({ 
      where: { year: 2025 },
      include: { stages: true }
    });

    if (!season || season.stages.length === 0) {
      return NextResponse.json({ 
        error: 'No season or stages found',
        data: {
          overall: [],
          seasonTotal: []
        }
      });
    }

    // Get the overall segment
    const overallSegment = await prisma.segment.findFirst({
      where: { stravaSegmentId: 3407862085591628422 }
    });

    if (!overallSegment) {
      return NextResponse.json({ 
        error: 'Overall segment not found',
        data: {
          overall: [],
          seasonTotal: []
        }
      });
    }

    // Get best efforts for the first stage (September 2025)
    const firstStage = season.stages[0];
    const overallData = await getBestPerAthleteByStageAndSegment(firstStage.id, overallSegment.id);
    
    // Get season totals
    const seasonTotals = await getSeasonTotalOverall(
      season.stages.map(s => s.id), 
      overallSegment.id
    );

    return NextResponse.json({
      data: {
        overall: overallData,
        seasonTotal: seasonTotals,
        stage: firstStage.name,
        segment: overallSegment.name
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      data: {
        overall: [],
        seasonTotal: []
      }
    }, { status: 500 });
  }
}
