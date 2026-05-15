import { Streak } from '../valueObjects/Streak';

export class StreakService {
  updateStreak(streak: Streak, completedDate: string): Streak {
    if (!streak.lastActivityDate) {
      return streak.reset(completedDate);
    }

    if (streak.isActiveOn(completedDate)) {
      return streak;
    }

    const isConsecutive = this.isConsecutiveDay(streak.lastActivityDate, completedDate);
    return isConsecutive ? streak.extend(completedDate) : streak.reset(completedDate);
  }

  private isConsecutiveDay(lastDate: string, currentDate: string): boolean {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffMs = current.getTime() - last.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }
}
