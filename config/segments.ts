export type SegmentKeys = 'OVERALL' | 'DOWNHILL_A' | 'DOWNHILL_B' | 'CLIMB_A' | 'CLIMB_B';

export const SEGMENTS: Record<SegmentKeys, string> = {
  OVERALL: "3407862085591628422",  // Your Strava segment ID
  DOWNHILL_A: "0",   // TODO: add other segment IDs if needed
  DOWNHILL_B: "0",   // TODO: add other segment IDs if needed
  CLIMB_A: "0",      // TODO: add other segment IDs if needed
  CLIMB_B: "0",      // TODO: add other segment IDs if needed
};
