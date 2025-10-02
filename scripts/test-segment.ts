async function testSegmentAccess() {
  const accessToken = '3a90f4b48f1546f0533ecea39b6ca7c7c269b0f9';
  const segmentId = "3407862085591628422";
  
  console.log('Testing segment access...');
  console.log(`Segment ID: ${segmentId}`);
  
  try {
    // First, try to get the segment details
    const segmentUrl = `https://www.strava.com/api/v3/segments/${segmentId}`;
    console.log('Fetching segment details from:', segmentUrl);
    
    const segmentResponse = await fetch(segmentUrl, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Segment response status:', segmentResponse.status);
    const segmentText = await segmentResponse.text();
    console.log('Segment response:', segmentText);
    
    if (segmentResponse.ok) {
      const segmentData = JSON.parse(segmentText);
      console.log('Segment name:', segmentData.name);
      console.log('Segment type:', segmentData.activity_type);
    }
    
    // Now try to get recent efforts (without date filter)
    const effortsUrl = `https://www.strava.com/api/v3/segment_efforts?segment_id=${segmentId}&per_page=10`;
    console.log('\nFetching recent efforts from:', effortsUrl);
    
    const effortsResponse = await fetch(effortsUrl, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Efforts response status:', effortsResponse.status);
    const effortsText = await effortsResponse.text();
    console.log('Efforts response:', effortsText);
    
    if (effortsResponse.ok) {
      const effortsData = JSON.parse(effortsText);
      console.log(`Found ${effortsData.length} recent efforts`);
      
      if (effortsData.length > 0) {
        effortsData.forEach((effort: any, index: number) => {
          const time = `${Math.floor(effort.elapsed_time / 60)}:${(effort.elapsed_time % 60).toString().padStart(2, '0')}`;
          console.log(`${index + 1}. ${time} - ${effort.start_date} - Activity ID: ${effort.activity.id}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSegmentAccess();
