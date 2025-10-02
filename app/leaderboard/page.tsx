'use client';
import { useState } from 'react';

// Mock data for testing
const mockData = {
  overall: [
    { rank: 1, name: 'Sarah Wilson', time: '1:20:12', date: '2024-09-22', stravaLink: '#' },
    { rank: 2, name: 'Jane Smith', time: '1:21:56', date: '2024-09-22', stravaLink: '#' },
    { rank: 3, name: 'John Doe', time: '1:23:45', date: '2024-09-22', stravaLink: '#' },
    { rank: 4, name: 'Mike Johnson', time: '1:24:18', date: '2024-09-22', stravaLink: '#' },
  ],
  downhillA: [
    { rank: 1, name: 'Jane Smith', time: '0:45:23', date: '2024-09-22', stravaLink: '#' },
    { rank: 2, name: 'Sarah Wilson', time: '0:46:12', date: '2024-09-22', stravaLink: '#' },
    { rank: 3, name: 'John Doe', time: '0:47:33', date: '2024-09-22', stravaLink: '#' },
  ],
  downhillB: [
    { rank: 1, name: 'Mike Johnson', time: '0:44:56', date: '2024-09-22', stravaLink: '#' },
    { rank: 2, name: 'Sarah Wilson', time: '0:45:18', date: '2024-09-22', stravaLink: '#' },
    { rank: 3, name: 'Jane Smith', time: '0:46:45', date: '2024-09-22', stravaLink: '#' },
  ],
  climbA: [
    { rank: 1, name: 'Sarah Wilson', time: '0:35:12', date: '2024-09-22', stravaLink: '#' },
    { rank: 2, name: 'John Doe', time: '0:36:23', date: '2024-09-22', stravaLink: '#' },
    { rank: 3, name: 'Jane Smith', time: '0:37:45', date: '2024-09-22', stravaLink: '#' },
  ],
  climbB: [
    { rank: 1, name: 'Jane Smith', time: '0:34:56', date: '2024-09-22', stravaLink: '#' },
    { rank: 2, name: 'Mike Johnson', time: '0:35:33', date: '2024-09-22', stravaLink: '#' },
    { rank: 3, name: 'Sarah Wilson', time: '0:36:12', date: '2024-09-22', stravaLink: '#' },
  ],
  seasonTotal: [
    { rank: 1, name: 'Sarah Wilson', totalTime: '5:22:54', stagesCompleted: 4 },
    { rank: 2, name: 'Jane Smith', totalTime: '5:25:40', stagesCompleted: 4 },
    { rank: 3, name: 'John Doe', totalTime: '5:28:41', stagesCompleted: 4 },
    { rank: 4, name: 'Mike Johnson', totalTime: '5:30:47', stagesCompleted: 4 },
  ]
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('overall');
  const [activeStage, setActiveStage] = useState('fall');

  const tabs = [
    { id: 'overall', name: 'Overall' },
    { id: 'downhillA', name: 'Downhill A' },
    { id: 'downhillB', name: 'Downhill B' },
    { id: 'climbA', name: 'Climb A' },
    { id: 'climbB', name: 'Climb B' },
    { id: 'seasonTotal', name: 'Season Total' },
  ];

  const stages = [
    { id: 'spring', name: 'Spring Equinox' },
    { id: 'summer', name: 'Summer Solstice' },
    { id: 'fall', name: 'Fall Equinox' },
    { id: 'winter', name: 'Winter Solstice' },
  ];

  const currentData = mockData[activeTab as keyof typeof mockData] || [];

  function Table({ data, isSeasonTotal = false }: { data: Array<{rank: number, name: string, time?: string, totalTime?: string, date?: string, stravaLink?: string, stagesCompleted?: number}>, isSeasonTotal?: boolean }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athlete</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {isSeasonTotal ? 'Total Time' : 'Time'}
              </th>
              {!isSeasonTotal && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strava</th>
                </>
              )}
              {isSeasonTotal && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stages</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.rank} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {isSeasonTotal ? row.totalTime : row.time}
                </td>
                {!isSeasonTotal && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a href={row.stravaLink} className="text-blue-600 hover:text-blue-800 underline">
                        View
                      </a>
                    </td>
                  </>
                )}
                {isSeasonTotal && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.stagesCompleted}/4
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Race Leaderboards</h1>
          <p className="text-gray-600 mb-8">Track your progress across all race segments and stages</p>
          
          {/* Stage Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage:</label>
            <div className="flex space-x-2">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeStage === stage.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {stage.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Table */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {tabs.find(t => t.id === activeTab)?.name} Leaderboard
            </h2>
            <Table 
              data={currentData} 
              isSeasonTotal={activeTab === 'seasonTotal'} 
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How it Works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Best time for each segment is automatically recorded from Strava</li>
              <li>• Season total is the sum of best times across all 4 stages</li>
              <li>• 600 second bonus deducted if you complete all 4 stages</li>
              <li>• Only activities during stage windows are counted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
