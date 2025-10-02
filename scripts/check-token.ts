async function checkToken() {
  const accessToken = '3a90f4b48f1546f0533ecea39b6ca7c7c269b0f9';
  
  console.log('Checking token permissions...');
  
  try {
    // Check athlete info
    const athleteUrl = 'https://www.strava.com/api/v3/athlete';
    
    const response = await fetch(athleteUrl, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const athlete = await response.json();
      console.log('Athlete info:');
      console.log(`  Name: ${athlete.firstname} ${athlete.lastname}`);
      console.log(`  ID: ${athlete.id}`);
      console.log('✅ Token is valid and can access athlete info');
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      console.log('❌ Token has insufficient permissions');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkToken();
