'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConnectContent() {
  const params = useSearchParams();
  const connected = params.get('connected') === '1';
  const name = params.get('name') ? decodeURIComponent(params.get('name')!) : undefined;

  const onConnect = () => {
    // For testing, simulate a connection
    window.location.href = '/api/strava/auth';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">Connect Strava</h1>
          
          {connected ? (
            <div className="text-center">
              <div className="rounded-lg border p-4 bg-green-50 text-green-700 mb-4">
                ✅ Connected as {name ?? 'your Strava account'}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your Strava activities will now be automatically tracked for the race leaderboard.
              </p>
              <a 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Leaderboard
              </a>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Connect Your Strava Account</h2>
                <p className="text-sm text-gray-600">
                  Link your Strava account to automatically track your race times and appear on the leaderboard.
                </p>
              </div>
              
              <button 
                onClick={onConnect}
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Connect with Strava
              </button>
              
              <div className="mt-6 text-xs text-gray-500">
                <p>We'll only access your activity data to track race times.</p>
                <p>You can disconnect at any time.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ConnectContent />
    </Suspense>
  );
}
