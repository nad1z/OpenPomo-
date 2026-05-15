import { Achievement, AchievementType } from '../entities/Achievement';
import { DailyStats } from '../entities/DailyStats';

const ACHIEVEMENT_DEFINITIONS: Array<{
  type: AchievementType;
  title: string;
  description: string;
  iconName: string;
  threshold: number;
}> = [
  {
    type: 'sessions_count',
    title: 'First Step',
    description: 'Complete your first Pomodoro',
    iconName: 'seedling',
    threshold: 1,
  },
  {
    type: 'sessions_count',
    title: 'Getting Started',
    description: 'Complete 10 Pomodoro sessions',
    iconName: 'star',
    threshold: 10,
  },
  {
    type: 'sessions_count',
    title: 'Dedicated',
    description: 'Complete 50 Pomodoro sessions',
    iconName: 'fire',
    threshold: 50,
  },
  {
    type: 'sessions_count',
    title: 'Centurion',
    description: 'Complete 100 Pomodoro sessions',
    iconName: 'trophy',
    threshold: 100,
  },
  {
    type: 'focus_time',
    title: 'One Hour In',
    description: 'Accumulate 60 minutes of focus time',
    iconName: 'clock',
    threshold: 60,
  },
  {
    type: 'focus_time',
    title: 'Half Day',
    description: 'Accumulate 4 hours of focus time',
    iconName: 'sun',
    threshold: 240,
  },
  {
    type: 'focus_time',
    title: 'Full Day',
    description: 'Accumulate 8 hours of focus time',
    iconName: 'moon',
    threshold: 480,
  },
  {
    type: 'streak',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    iconName: 'flame',
    threshold: 3,
  },
  {
    type: 'streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    iconName: 'calendar',
    threshold: 7,
  },
  {
    type: 'perfect_day',
    title: 'Perfect Day',
    description: 'Hit your daily goal with no abandoned sessions',
    iconName: 'check-circle',
    threshold: 1,
  },
];

export class AchievementService {
  getDefaultAchievements(): Achievement[] {
    return ACHIEVEMENT_DEFINITIONS.map((def) => Achievement.create(def));
  }

  evaluateAchievements(
    achievements: Achievement[],
    totalCompletedSessions: number,
    totalFocusMinutes: number,
    currentStreak: number,
    dailyStats: DailyStats | null,
  ): Achievement[] {
    return achievements.map((achievement) => {
      if (achievement.isUnlocked) return achievement;

      const shouldUnlock = this.checkCondition(
        achievement,
        totalCompletedSessions,
        totalFocusMinutes,
        currentStreak,
        dailyStats,
      );

      return shouldUnlock ? achievement.unlock() : achievement;
    });
  }

  private checkCondition(
    achievement: Achievement,
    totalCompleted: number,
    totalFocusMinutes: number,
    currentStreak: number,
    dailyStats: DailyStats | null,
  ): boolean {
    switch (achievement.type) {
      case 'sessions_count':
        return totalCompleted >= achievement.threshold;
      case 'focus_time':
        return totalFocusMinutes >= achievement.threshold;
      case 'streak':
        return currentStreak >= achievement.threshold;
      case 'perfect_day':
        return (
          dailyStats !== null &&
          dailyStats.goalAchieved &&
          dailyStats.abandonedSessions === 0
        );
      default:
        return false;
    }
  }
}
