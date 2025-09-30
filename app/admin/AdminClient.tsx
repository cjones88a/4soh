'use client';
import { useEffect, useState } from 'react';

type Effort = {
  id: string;
  isValid: boolean;
  elapsedSec: number;
  activityId: number;
  activityDate: string;
  athlete: { name: string | null };
  segment: { stravaSegmentId: number };
  stage: { name: string };
};

export default function AdminClient() {
  const [efforts, setEfforts] = useState<Effort[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/efforts');
    const j = await r.json();
    setEfforts(j.efforts ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string, isValid: boolean) => {
    await fetch('/api/admin/efforts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isValid }) });
    load();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button className="px-3 py-1 rounded bg-black text-white" onClick={load} disabled={loading}>Reload</button>
        <form action="/api/admin/recompute" method="post">
          <button className="px-3 py-1 rounded border">Recompute leaderboards</button>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Athlete</th>
              <th className="py-2 pr-4">Stage</th>
              <th className="py-2 pr-4">Segment</th>
              <th className="py-2 pr-4">Elapsed</th>
              <th className="py-2 pr-4">Valid</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {efforts.map((e) => (
              <tr key={e.id} className="border-b">
                <td className="py-2 pr-4">{new Date(e.activityDate).toLocaleString()}</td>
                <td className="py-2 pr-4">{e.athlete?.name ?? '-'}</td>
                <td className="py-2 pr-4">{e.stage?.name}</td>
                <td className="py-2 pr-4">{e.segment?.stravaSegmentId}</td>
                <td className="py-2 pr-4">{e.elapsedSec}s</td>
                <td className="py-2 pr-4">{e.isValid ? 'Yes' : 'No'}</td>
                <td className="py-2 pr-4">
                  <button className="px-2 py-1 rounded border mr-2" onClick={() => toggle(e.id, true)}>Validate</button>
                  <button className="px-2 py-1 rounded border" onClick={() => toggle(e.id, false)}>Invalidate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
