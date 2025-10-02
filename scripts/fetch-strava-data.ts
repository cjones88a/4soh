import { PrismaClient } from '@prisma/client';
import { fetchSegmentEfforts } from '../lib/strava';
import { SEGMENTS } from '../config/segments';

const prisma = new PrismaClient();

async function fetchAndStoreSegmentData() {
  console.log('Fetching Strava segment data...');
  
  const accessToken = process.env.STRAVA_ACCESS_TOKEN; // You'll need to get this from your Strava account
  if (!accessToken) {
    console.error('Please set STRAVA_ACCESS_TOKEN in your .env file');
    console.log('Get it from: https://www.strava.com/settings/api');
    return;
  }

  const segmentId = parseInt(SEGMENTS.OVERALL);
  const startDate = new Date('2025-09-01T00:00:00Z');
  const endDate = new Date('2025-09-30T23:59:59Z');

  try {
    console.log(`Fetching efforts for segment ${segmentId} from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const efforts = await fetchSegmentEfforts({
      accessToken,
      segmentId,
      startDate,
      endDate,
      perPage: 200
    });

    console.log(`Found ${efforts.length} efforts`);

    // Create or update segment
    const segment = await prisma.segment.upsert({
      where: { stravaSegmentId: SEGMENTS.OVERALL },
      update: {},
      create: {
        name: '4SOH Race Segment',
        stravaSegmentId: SEGMENTS.OVERALL,
        type: 'OVERALL',
        lane: 'NONE',
      },
    });

    // Create a season and stage for September 2025
    const season = await prisma.season.upsert({
      where: { year: 2025 },
      update: {},
      create: { year: 2025 },
    });

    const stage = await prisma.stage.upsert({
      where: { 
        seasonId_name: { 
          seasonId: season.id, 
          name: 'Fall Equinox' 
        } 
      },
      update: {
        startsOn: startDate,
        endsOn: endDate,
      },
      create: {
        seasonId: season.id,
        name: 'Fall Equinox',
        startsOn: startDate,
        endsOn: endDate,
      },
    });

    // Process each effort
    for (const effort of efforts) {
      try {
        // Create or update athlete (using a placeholder ID since we don't have athlete info in segment efforts)
        const athleteId = Math.floor(Math.random() * 1000000); // Generate a random ID for now
        const athlete = await prisma.athlete.upsert({
          where: { stravaAthleteId: athleteId },
          update: {},
          create: { 
            stravaAthleteId: athleteId,
            name: `Athlete ${athleteId}`,
          },
        });

        // Store the effort
        await prisma.effort.upsert({
          where: { stravaEffortId: effort.id },
          update: {
            elapsedSec: effort.elapsed_time,
            activityDate: new Date(effort.start_date),
          },
          create: {
            athleteId: athlete.id,
            stageId: stage.id,
            segmentId: segment.id,
            stravaEffortId: effort.id,
            activityId: effort.activity.id,
            activityDate: new Date(effort.start_date),
            elapsedSec: effort.elapsed_time,
          },
        });

        console.log(`Stored effort: ${effort.elapsed_time}s by athlete ${athlete.stravaAthleteId}`);
      } catch (error) {
        console.error(`Error processing effort ${effort.id}:`, error);
      }
    }

    console.log('Data fetch complete!');
  } catch (error) {
    console.error('Error fetching Strava data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndStoreSegmentData();
