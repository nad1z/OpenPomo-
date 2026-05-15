import { PomodoroSession } from '../../domain/entities/PomodoroSession';

function sessionAt(
  daysAgo: number,
  hour: number,
  status: 'completed' | 'abandoned',
  type: 'focus' | 'short_break' | 'long_break' = 'focus',
  sessionNumber = 1,
): PomodoroSession {
  const start = new Date();
  start.setDate(start.getDate() - daysAgo);
  start.setHours(hour, 0, 0, 0);
  const actualDuration = status === 'completed' ? 1500 : 600;
  const end = new Date(start.getTime() + actualDuration * 1000);

  return PomodoroSession.reconstitute({
    id: `seed-${daysAgo}-${hour}-${type}`,
    startTime: start,
    endTime: end,
    plannedDuration: type === 'focus' ? 1500 : type === 'short_break' ? 300 : 900,
    actualDuration,
    status,
    type,
    notes: '',
    sessionNumber,
  });
}

export const SEED_SESSIONS: PomodoroSession[] = [
  // Today
  sessionAt(0, 9, 'completed', 'focus', 1),
  sessionAt(0, 10, 'completed', 'short_break', 2),
  sessionAt(0, 10, 'completed', 'focus', 3),
  sessionAt(0, 11, 'abandoned', 'focus', 4),
  // Yesterday
  sessionAt(1, 9, 'completed', 'focus', 1),
  sessionAt(1, 10, 'completed', 'focus', 2),
  sessionAt(1, 11, 'completed', 'focus', 3),
  sessionAt(1, 14, 'completed', 'focus', 4),
  sessionAt(1, 15, 'completed', 'focus', 5),
  // 2 days ago
  sessionAt(2, 9, 'completed', 'focus', 1),
  sessionAt(2, 10, 'completed', 'focus', 2),
  sessionAt(2, 11, 'abandoned', 'focus', 3),
  // 3 days ago
  sessionAt(3, 9, 'completed', 'focus', 1),
  sessionAt(3, 10, 'completed', 'focus', 2),
  sessionAt(3, 11, 'completed', 'focus', 3),
  sessionAt(3, 14, 'completed', 'focus', 4),
  sessionAt(3, 15, 'completed', 'focus', 5),
  sessionAt(3, 16, 'completed', 'focus', 6),
  sessionAt(3, 17, 'completed', 'focus', 7),
  sessionAt(3, 18, 'completed', 'focus', 8),
];

export async function seedDatabase(sessionRepo: { save: (s: PomodoroSession) => Promise<void> }): Promise<void> {
  for (const session of SEED_SESSIONS) {
    await sessionRepo.save(session);
  }
}
