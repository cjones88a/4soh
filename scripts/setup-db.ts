import { PrismaClient } from '@prisma/client';
import { STAGE_WINDOWS } from '../config/stages';
import { SEGMENTS } from '../config/segments';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database...');

  // Create Season
  const currentYear = new Date().getFullYear();
  const season = await prisma.season.upsert({
    where: { year: currentYear },
    update: {},
    create: { year: currentYear },
  });
  console.log(`Created/updated season: ${season.year}`);

  // Create Stages
  for (const stageWindow of STAGE_WINDOWS) {
    const stage = await prisma.stage.upsert({
      where: { 
        seasonId_name: { 
          seasonId: season.id, 
          name: stageWindow.name 
        } 
      },
      update: {
        startsOn: new Date(stageWindow.startsOn),
        endsOn: new Date(stageWindow.endsOn),
      },
      create: {
        seasonId: season.id,
        name: stageWindow.name,
        startsOn: new Date(stageWindow.startsOn),
        endsOn: new Date(stageWindow.endsOn),
      },
    });
    console.log(`Created/updated stage: ${stage.name}`);
  }

  // Create Segments (only if they have valid IDs)
  const segmentTypes = [
    { key: 'OVERALL', type: 'OVERALL', lane: 'NONE' },
    { key: 'DOWNHILL_A', type: 'DOWNHILL', lane: 'A' },
    { key: 'DOWNHILL_B', type: 'DOWNHILL', lane: 'B' },
    { key: 'CLIMB_A', type: 'CLIMB', lane: 'A' },
    { key: 'CLIMB_B', type: 'CLIMB', lane: 'B' },
  ] as const;

  for (const { key, type, lane } of segmentTypes) {
    const stravaSegmentId = SEGMENTS[key as keyof typeof SEGMENTS];
    if (stravaSegmentId && stravaSegmentId > 0) {
      const segment = await prisma.segment.upsert({
        where: { stravaSegmentId },
        update: {},
        create: {
          name: `${type} ${lane === 'NONE' ? '' : lane}`,
          stravaSegmentId,
          type,
          lane,
        },
      });
      console.log(`Created/updated segment: ${segment.name} (ID: ${stravaSegmentId})`);
    } else {
      console.log(`Skipping segment ${key} - no valid Strava segment ID configured`);
    }
  }

  console.log('Database setup complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
