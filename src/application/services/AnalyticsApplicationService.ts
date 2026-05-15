import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { AnalyticsService, WeeklyStats, MonthlyStats } from '../../domain/services/AnalyticsService';
import { DailyStats } from '../../domain/entities/DailyStats';
import { GetSessionHistoryUseCase } from '../../domain/useCases/GetSessionHistoryUseCase';

export class AnalyticsApplicationService {
  private readonly analyticsService: AnalyticsService;
  private readonly historyUseCase: GetSessionHistoryUseCase;

  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly streakRepo: IStreakRepository,
  ) {
    this.analyticsService = new AnalyticsService();
    this.historyUseCase = new GetSessionHistoryUseCase(sessionRepo);
  }

  async getDailyStats(date: string, dailyGoal: number): Promise<DailyStats> {
    const sessions = await this.historyUseCase.execute({ filter: 'today', referenceDate: date });
    return this.analyticsService.computeDailyStats(sessions, date, dailyGoal);
  }

  async getWeeklyStats(weekStart: string, dailyGoal: number): Promise<WeeklyStats> {
    const sessions = await this.historyUseCase.execute({
      filter: 'week',
      referenceDate: weekStart,
    });
    return this.analyticsService.computeWeeklyStats(sessions, weekStart, dailyGoal);
  }

  async getMonthlyStats(month: string, dailyGoal: number): Promise<MonthlyStats> {
    const sessions = await this.historyUseCase.execute({
      filter: 'month',
      referenceDate: `${month}-01`,
    });
    return this.analyticsService.computeMonthlyStats(sessions, month, dailyGoal);
  }

  async getCurrentStreak(): Promise<number> {
    const streak = await this.streakRepo.load();
    return streak.current;
  }

  async getLongestStreak(): Promise<number> {
    const streak = await this.streakRepo.load();
    return streak.longest;
  }
}
