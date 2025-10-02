async function debugStravaAPI() {
  const accessToken = '3a90f4b48f1546f0533ecea39b6ca7c7c269b0f9';
  const segmentId = "3407862085591628422";
  
  const startDate = new Date('2025-09-01T00:00:00Z');
  const endDate = new Date('2025-09-30T23:59:59Z');
  
  const search = new URLSearchParams();
  search.set('segment_id', segmentId);
  search.set('start_date_local', startDate.toISOString());
  search.set('end_date_local', endDate.toISOString());
  search.set('per_page', '50');

  const url = `https://www.strava.com/api/v3/segment_efforts?${search.toString()}`;
  
  console.log('Making request to:', url);
  
  try {
    const response = await fetch(url, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    const json = JSON.parse(text);
    console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugStravaAPI();
