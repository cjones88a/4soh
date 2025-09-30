import { STAGE_WINDOWS } from '@/config/stages';

export type SportType =
  | 'Ride'
  | 'EBikeRide'
  | 'VirtualRide'
  | 'Run'
  | 'Walk'
  | string;

export function isDisallowedSportType(sport: SportType): boolean {
  return sport === 'EBikeRide';
}

export function isWithinAnyStageWindow(date: Date) {
  const stage = STAGE_WINDOWS.find((w) => {
    const start = new Date(w.startsOn);
    const end = new Date(w.endsOn);
    return date >= start && date <= end;
  });
  return stage ? { inWindow: true as const, stageName: stage.name } : { inWindow: false as const };
}
