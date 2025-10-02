'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConnectContent() {
  const params = useSearchParams();
  const connected = params.get('connected') === '1';
  const name = params.get('name') ? decodeURIComponent(params.get('name')!) : undefined;

  const onConnect = () => {
    window.location.href = '/api/strava/auth';
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Connect Strava</h1>
      {connected ? (
        <div className="rounded border p-4 bg-green-50 text-green-700">Connected as {name ?? 'your Strava account'}.</div>
      ) : (
        <button onClick={onConnect} className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800">Connect Strava</button>
      )}
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto p-6">Loading...</div>}>
      <ConnectContent />
    </Suspense>
  );
}
