export type StageWindow = {
  name: 'Spring Equinox' | 'Summer Solstice' | 'Fall Equinox' | 'Winter Solstice';
  startsOn: string; // ISO date
  endsOn: string;   // ISO date
};

export const STAGE_WINDOWS: StageWindow[] = [
  { name: 'Spring Equinox', startsOn: '2025-03-19T00:00:00Z', endsOn: '2025-04-02T23:59:59Z' },
  { name: 'Summer Solstice', startsOn: '2025-06-20T00:00:00Z', endsOn: '2025-07-04T23:59:59Z' },
  { name: 'Fall Equinox', startsOn: '2025-09-22T00:00:00Z', endsOn: '2025-10-06T23:59:59Z' },
  { name: 'Winter Solstice', startsOn: '2025-12-21T00:00:00Z', endsOn: '2026-01-04T23:59:59Z' },
];
