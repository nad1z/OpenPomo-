export interface DailyStatsProps {
  readonly date: string; // ISO date string YYYY-MM-DD
  readonly completedFocusSessions: number;
  readonly abandonedSessions: number;
  readonly totalFocusMinutes: number;
  readonly totalBreakMinutes: number;
  readonly longestStreak: number; // consecutive completed sessions
  readonly goalAchieved: boolean;
}

export class DailyStats {
  readonly date: string;
  readonly completedFocusSessions: number;
  readonly abandonedSessions: number;
  readonly totalFocusMinutes: number;
  readonly totalBreakMinutes: number;
  readonly longestStreak: number;
  readonly goalAchieved: boolean;

  private constructor(props: DailyStatsProps) {
    this.date = props.date;
    this.completedFocusSessions = props.completedFocusSessions;
    this.abandonedSessions = props.abandonedSessions;
    this.totalFocusMinutes = props.totalFocusMinutes;
    this.totalBreakMinutes = props.totalBreakMinutes;
    this.longestStreak = props.longestStreak;
    this.goalAchieved = props.goalAchieved;
  }

  static empty(date: string): DailyStats {
    return new DailyStats({
      date,
      completedFocusSessions: 0,
      abandonedSessions: 0,
      totalFocusMinutes: 0,
      totalBreakMinutes: 0,
      longestStreak: 0,
      goalAchieved: false,
    });
  }

  static reconstitute(props: DailyStatsProps): DailyStats {
    return new DailyStats(props);
  }

  get completionRate(): number {
    const total = this.completedFocusSessions + this.abandonedSessions;
    if (total === 0) return 0;
    return this.completedFocusSessions / total;
  }

  get totalSessions(): number {
    return this.completedFocusSessions + this.abandonedSessions;
  }

  toProps(): DailyStatsProps {
    return {
      date: this.date,
      completedFocusSessions: this.completedFocusSessions,
      abandonedSessions: this.abandonedSessions,
      totalFocusMinutes: this.totalFocusMinutes,
      totalBreakMinutes: this.totalBreakMinutes,
      longestStreak: this.longestStreak,
      goalAchieved: this.goalAchieved,
    };
  }
}
