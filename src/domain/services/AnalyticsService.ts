import { PomodoroSession } from '../entities/PomodoroSession';
import { DailyStats } from '../entities/DailyStats';

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalCompletedSessions: number;
  totalFocusMinutes: number;
  totalBreakMinutes: number;
  averageSessionsPerDay: number;
  bestDay: string | null;
  completionRate: number;
  dailyBreakdown: DailyStats[];
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  totalCompletedSessions: number;
  totalFocusMinutes: number;
  totalFocusHours: number;
  completionRate: number;
  activeDays: number;
  averageDailyFocus: number;
  bestDay: string | null;
  streakData: { date: string; count: number }[];
}

export class AnalyticsService {
  computeDailyStats(sessions: PomodoroSession[], date: string, dailyGoal: number): DailyStats {
    const daySessions = sessions.filter((s) => {
      const sessionDate = s.startTime.toISOString().split('T')[0];
      return sessionDate === date;
    });

    const focusSessions = daySessions.filter((s) => s.type === 'focus');
    const completed = focusSessions.filter((s) => s.status === 'completed');
    const abandoned = focusSessions.filter((s) => s.status === 'abandoned');

    const totalFocusSeconds = completed.reduce((sum, s) => sum + s.actualDuration, 0);
    const breakSessions = daySessions.filter(
      (s) => s.type === 'short_break' || s.type === 'long_break',
    );
    const totalBreakSeconds = breakSessions
      .filter((s) => s.status === 'completed')
      .reduce((sum, s) => sum + s.actualDuration, 0);

    const longestStreak = this.computeLongestConsecutiveStreak(focusSessions);

    return DailyStats.reconstitute({
      date,
      completedFocusSessions: completed.length,
      abandonedSessions: abandoned.length,
      totalFocusMinutes: Math.floor(totalFocusSeconds / 60),
      totalBreakMinutes: Math.floor(totalBreakSeconds / 60),
      longestStreak,
      goalAchieved: completed.length >= dailyGoal,
    });
  }

  computeWeeklyStats(sessions: PomodoroSession[], weekStart: string, dailyGoal: number): WeeklyStats {
    const days = this.getWeekDays(weekStart);
    const weekEnd = days[days.length - 1];

    const dailyBreakdown = days.map((date) => this.computeDailyStats(sessions, date, dailyGoal));

    const totalCompleted = dailyBreakdown.reduce((sum, d) => sum + d.completedFocusSessions, 0);
    const totalFocus = dailyBreakdown.reduce((sum, d) => sum + d.totalFocusMinutes, 0);
    const totalBreak = dailyBreakdown.reduce((sum, d) => sum + d.totalBreakMinutes, 0);
    const activeDays = dailyBreakdown.filter((d) => d.totalSessions > 0).length;

    const totalAttempted = dailyBreakdown.reduce((sum, d) => sum + d.totalSessions, 0);

    const bestDay = dailyBreakdown.reduce(
      (best, d) => (!best || d.completedFocusSessions > best.completedFocusSessions ? d : best),
      null as DailyStats | null,
    );

    return {
      weekStart,
      weekEnd,
      totalCompletedSessions: totalCompleted,
      totalFocusMinutes: totalFocus,
      totalBreakMinutes: totalBreak,
      averageSessionsPerDay: activeDays > 0 ? totalCompleted / activeDays : 0,
      bestDay: bestDay?.completedFocusSessions ? bestDay.date : null,
      completionRate: totalAttempted > 0 ? totalCompleted / totalAttempted : 0,
      dailyBreakdown,
    };
  }

  computeMonthlyStats(sessions: PomodoroSession[], month: string, dailyGoal: number): MonthlyStats {
    const monthSessions = sessions.filter((s) => {
      const m = s.startTime.toISOString().substring(0, 7);
      return m === month;
    });

    const focusCompleted = monthSessions.filter(
      (s) => s.type === 'focus' && s.status === 'completed',
    );
    const focusAttempted = monthSessions.filter((s) => s.type === 'focus');

    const totalFocusSeconds = focusCompleted.reduce((sum, s) => sum + s.actualDuration, 0);
    const totalFocusMinutes = Math.floor(totalFocusSeconds / 60);

    const activeDatesSet = new Set(
      focusCompleted.map((s) => s.startTime.toISOString().split('T')[0]),
    );
    const activeDays = activeDatesSet.size;

    const streakData = Array.from(activeDatesSet).map((date) => ({
      date,
      count: focusCompleted.filter((s) => s.startTime.toISOString().split('T')[0] === date).length,
    }));

    const dailyGrouped = new Map<string, number>();
    focusCompleted.forEach((s) => {
      const date = s.startTime.toISOString().split('T')[0];
      dailyGrouped.set(date, (dailyGrouped.get(date) ?? 0) + 1);
    });

    let bestDay: string | null = null;
    let bestCount = 0;
    dailyGrouped.forEach((count, date) => {
      if (count > bestCount) {
        bestCount = count;
        bestDay = date;
      }
    });

    return {
      month,
      totalCompletedSessions: focusCompleted.length,
      totalFocusMinutes,
      totalFocusHours: parseFloat((totalFocusMinutes / 60).toFixed(1)),
      completionRate:
        focusAttempted.length > 0 ? focusCompleted.length / focusAttempted.length : 0,
      activeDays,
      averageDailyFocus: activeDays > 0 ? totalFocusMinutes / activeDays : 0,
      bestDay,
      streakData,
    };
  }

  private computeLongestConsecutiveStreak(sessions: PomodoroSession[]): number {
    const sorted = [...sessions].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    let longest = 0;
    let current = 0;

    for (const session of sorted) {
      if (session.status === 'completed') {
        current++;
        longest = Math.max(longest, current);
      } else if (session.status === 'abandoned') {
        current = 0;
      }
    }
    return longest;
  }

  private getWeekDays(weekStart: string): string[] {
    const days: string[] = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }
}
