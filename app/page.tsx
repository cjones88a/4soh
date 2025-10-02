'use client';
import { useState, useEffect } from 'react';

type RiderData = {
  athleteName: string;
  athleteId: string;
  elapsedSec: number;
  activityDate: string;
  stravaEffortId: number;
  activityId: number;
};

type SeasonTotal = {
  athleteId: string;
  athleteName: string;
  totalElapsedSec: number;
  stagesCompleted: number;
};

export default function HomePage() {
  const [riders, setRiders] = useState<RiderData[]>([]);
  const [seasonTotals, setSeasonTotals] = useState<SeasonTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
        // Fall back to mock data if no real data
        setMockData();
      } else {
        setRiders(result.data.overall || []);
        setSeasonTotals(result.data.seasonTotal || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setRiders([
      { athleteName: 'John Doe', athleteId: '1', elapsedSec: 5025, activityDate: '2025-09-15', stravaEffortId: 1, activityId: 1 },
      { athleteName: 'Jane Smith', athleteId: '2', elapsedSec: 4916, activityDate: '2025-09-15', stravaEffortId: 2, activityId: 2 },
      { athleteName: 'Mike Johnson', athleteId: '3', elapsedSec: 5058, activityDate: '2025-09-15', stravaEffortId: 3, activityId: 3 },
      { athleteName: 'Sarah Wilson', athleteId: '4', elapsedSec: 4812, activityDate: '2025-09-15', stravaEffortId: 4, activityId: 4 },
    ]);
    setSeasonTotals([
      { athleteId: '4', athleteName: 'Sarah Wilson', totalElapsedSec: 4812, stagesCompleted: 1 },
      { athleteId: '2', athleteName: 'Jane Smith', totalElapsedSec: 4916, stagesCompleted: 1 },
      { athleteId: '1', athleteName: 'John Doe', totalElapsedSec: 5025, stagesCompleted: 1 },
      { athleteId: '3', athleteName: 'Mike Johnson', totalElapsedSec: 5058, stagesCompleted: 1 },
    ]);
  };

  function secondsToHMS(total: number) {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading race data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">4SOH Race Tracker</h1>
          <p className="text-gray-600 mb-8">Season Leaderboard - Best Times by Stage</p>
          
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> {error}. Showing sample data. 
                <button onClick={fetchData} className="ml-2 text-blue-600 underline">Retry</button>
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Stage Leaderboard */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Stage (September 2025)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rider</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {riders.map((rider, index) => (
                      <tr key={rider.athleteId} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{rider.athleteName}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{secondsToHMS(rider.elapsedSec)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(rider.activityDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Season Total */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Season Total</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rider</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stages</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {seasonTotals.map((rider, index) => (
                      <tr key={rider.athleteId} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{rider.athleteName}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{secondsToHMS(rider.totalElapsedSec)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{rider.stagesCompleted}/4</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How it Works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Connect your Strava account to automatically track your times</li>
              <li>• Best time for each stage is recorded automatically</li>
              <li>• Season total is the sum of your best times across all 4 stages</li>
              <li>• 600 second bonus deducted if you complete all 4 stages</li>
            </ul>
          </div>
          
          <div className="mt-6 flex gap-4">
            <a 
              href="/connect" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Connect Strava
            </a>
            <a 
              href="/leaderboard" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Full Leaderboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
