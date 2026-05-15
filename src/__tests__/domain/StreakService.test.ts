import { StreakService } from '../../domain/services/StreakService';
import { Streak } from '../../domain/valueObjects/Streak';

describe('StreakService', () => {
  const service = new StreakService();

  it('starts streak at 1 for first activity', () => {
    const streak = Streak.initial();
    const updated = service.updateStreak(streak, '2024-01-15');
    expect(updated.current).toBe(1);
    expect(updated.lastActivityDate).toBe('2024-01-15');
  });

  it('extends streak on consecutive days', () => {
    const streak = Streak.reconstitute(3, 5, '2024-01-14');
    const updated = service.updateStreak(streak, '2024-01-15');
    expect(updated.current).toBe(4);
    expect(updated.longest).toBe(5);
  });

  it('resets streak on non-consecutive day', () => {
    const streak = Streak.reconstitute(5, 10, '2024-01-10');
    const updated = service.updateStreak(streak, '2024-01-15');
    expect(updated.current).toBe(1);
    expect(updated.longest).toBe(10);
  });

  it('does not duplicate same-day update', () => {
    const streak = Streak.reconstitute(3, 5, '2024-01-15');
    const updated = service.updateStreak(streak, '2024-01-15');
    expect(updated.current).toBe(3);
  });

  it('updates longest when current exceeds it', () => {
    const streak = Streak.reconstitute(9, 9, '2024-01-14');
    const updated = service.updateStreak(streak, '2024-01-15');
    expect(updated.current).toBe(10);
    expect(updated.longest).toBe(10);
  });
});
