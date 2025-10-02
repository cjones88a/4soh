'use client';
import { useState } from 'react';

// Mock data for testing
const mockRiders = [
  { id: 1, name: 'John Doe', springTime: '1:23:45', summerTime: '1:25:12', fallTime: '1:24:33', winterTime: '1:26:01' },
  { id: 2, name: 'Jane Smith', springTime: '1:22:18', summerTime: '1:23:45', fallTime: '1:21:56', winterTime: '1:24:12' },
  { id: 3, name: 'Mike Johnson', springTime: '1:25:33', summerTime: '1:26:45', fallTime: '1:24:18', winterTime: '1:27:22' },
  { id: 4, name: 'Sarah Wilson', springTime: '1:21:45', summerTime: '1:22:33', fallTime: '1:20:12', winterTime: '1:23:45' },
];

export default function HomePage() {
  const [riders] = useState(mockRiders);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">4SOH Race Tracker</h1>
          <p className="text-gray-600 mb-8">Season Leaderboard - Best Times by Stage</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rider Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spring Equinox
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summer Solstice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fall Equinox
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Winter Solstice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Season Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riders.map((rider, index) => (
                  <tr key={rider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rider.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rider.springTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rider.summerTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rider.fallTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rider.winterTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {rider.springTime} + {rider.summerTime} + {rider.fallTime} + {rider.winterTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
