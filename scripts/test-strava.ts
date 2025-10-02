import { fetchSegmentEfforts } from '../lib/strava';

async function testStravaConnection() {
  const accessToken = '3a90f4b48f1546f0533ecea39b6ca7c7c269b0f9';
  const segmentId = 3407862085591628422;
  
  console.log('Testing Strava connection...');
  console.log(`Segment ID: ${segmentId}`);
  console.log(`Access Token: ${accessToken.substring(0, 10)}...`);
  
  try {
    // Test with a recent date range
    const startDate = new Date('2025-09-01T00:00:00Z');
    const endDate = new Date('2025-09-30T23:59:59Z');
    
    console.log(`Fetching efforts from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const efforts = await fetchSegmentEfforts({
      accessToken,
      segmentId,
      startDate,
      endDate,
      perPage: 50
    });
    
    console.log(`\nFound ${efforts.length} efforts:`);
    
    efforts.forEach((effort, index) => {
      const time = `${Math.floor(effort.elapsed_time / 60)}:${(effort.elapsed_time % 60).toString().padStart(2, '0')}`;
      console.log(`${index + 1}. ${time} - ${effort.start_date} - Activity ID: ${effort.activity.id}`);
    });
    
    if (efforts.length > 0) {
      const fastest = efforts.reduce((prev, current) => 
        prev.elapsed_time < current.elapsed_time ? prev : current
      );
      const fastestTime = `${Math.floor(fastest.elapsed_time / 60)}:${(fastest.elapsed_time % 60).toString().padStart(2, '0')}`;
      console.log(`\n🏆 Fastest time: ${fastestTime} on ${fastest.start_date}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testStravaConnection();
