async function listRecentActivities() {
  const accessToken = '3a90f4b48f1546f0533ecea39b6ca7c7c269b0f9';
  
  console.log('Fetching recent activities...');
  
  try {
    const activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities?per_page=10';
    
    const response = await fetch(activitiesUrl, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const activities = await response.json();
      console.log(`Found ${activities.length} recent activities:`);
      
      activities.forEach((activity: any, index: number) => {
        console.log(`${index + 1}. ${activity.name} - ${activity.start_date} - ID: ${activity.id}`);
        console.log(`   Type: ${activity.sport_type} - Distance: ${activity.distance}m`);
      });
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

listRecentActivities();
