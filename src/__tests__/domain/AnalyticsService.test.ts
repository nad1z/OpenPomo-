import { AnalyticsService } from '../../domain/services/AnalyticsService';
import { PomodoroSession } from '../../domain/entities/PomodoroSession';

function makeSession(
  date: string,
  status: 'completed' | 'abandoned',
  type: 'focus' | 'short_break' = 'focus',
  actualDuration = 1500,
): PomodoroSession {
  const start = new Date(`${date}T10:00:00Z`);
  return PomodoroSession.reconstitute({
    id: Math.random().toString(),
    startTime: start,
    endTime: new Date(start.getTime() + actualDuration * 1000),
    plannedDuration: 1500,
    actualDuration,
    status,
    type,
    notes: '',
    sessionNumber: 1,
  });
}

describe('AnalyticsService', () => {
  const service = new AnalyticsService();

  describe('computeDailyStats', () => {
    it('counts completed and abandoned sessions', () => {
      const sessions = [
        makeSession('2024-01-15', 'completed'),
        makeSession('2024-01-15', 'completed'),
        makeSession('2024-01-15', 'abandoned'),
      ];

      const stats = service.computeDailyStats(sessions, '2024-01-15', 8);

      expect(stats.completedFocusSessions).toBe(2);
      expect(stats.abandonedSessions).toBe(1);
    });

    it('correctly computes total focus minutes', () => {
      const sessions = [
        makeSession('2024-01-15', 'completed', 'focus', 1500),
        makeSession('2024-01-15', 'completed', 'focus', 1500),
      ];

      const stats = service.computeDailyStats(sessions, '2024-01-15', 8);
      expect(stats.totalFocusMinutes).toBe(50);
    });

    it('marks goal achieved when sessions >= goal', () => {
      const sessions = Array(4).fill(null).map(() => makeSession('2024-01-15', 'completed'));
      const stats = service.computeDailyStats(sessions, '2024-01-15', 4);
      expect(stats.goalAchieved).toBe(true);
    });

    it('returns empty stats for empty session list', () => {
      const stats = service.computeDailyStats([], '2024-01-15', 8);
      expect(stats.completedFocusSessions).toBe(0);
      expect(stats.totalFocusMinutes).toBe(0);
    });
  });
});
