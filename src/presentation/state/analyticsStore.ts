import { create } from 'zustand';
import { DailyStats } from '../../domain/entities/DailyStats';
import { WeeklyStats, MonthlyStats } from '../../domain/services/AnalyticsService';
import { container } from '../../infrastructure/container';
import { getWeekStart, getMonthKey, formatDate } from '../../shared/utils/dateUtils';

interface AnalyticsStore {
  dailyStats: DailyStats | null;
  weeklyStats: WeeklyStats | null;
  monthlyStats: MonthlyStats | null;
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
  error: string | null;

  loadAll: (dailyGoal: number) => Promise<void>;
  loadDaily: (date: string, dailyGoal: number) => Promise<void>;
  loadWeekly: (weekStart: string, dailyGoal: number) => Promise<void>;
  loadMonthly: (month: string, dailyGoal: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  dailyStats: null,
  weeklyStats: null,
  monthlyStats: null,
  currentStreak: 0,
  longestStreak: 0,
  isLoading: false,
  error: null,

  loadAll: async (dailyGoal) => {
    set({ isLoading: true, error: null });
    try {
      const today = formatDate(new Date());
      const weekStart = getWeekStart(new Date());
      const month = getMonthKey(new Date());

      const [daily, weekly, monthly, current, longest] = await Promise.all([
        container.analyticsService.getDailyStats(today, dailyGoal),
        container.analyticsService.getWeeklyStats(weekStart, dailyGoal),
        container.analyticsService.getMonthlyStats(month, dailyGoal),
        container.analyticsService.getCurrentStreak(),
        container.analyticsService.getLongestStreak(),
      ]);

      set({
        dailyStats: daily,
        weeklyStats: weekly,
        monthlyStats: monthly,
        currentStreak: current,
        longestStreak: longest,
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to load analytics', isLoading: false });
    }
  },

  loadDaily: async (date, dailyGoal) => {
    const stats = await container.analyticsService.getDailyStats(date, dailyGoal);
    set({ dailyStats: stats });
  },

  loadWeekly: async (weekStart, dailyGoal) => {
    const stats = await container.analyticsService.getWeeklyStats(weekStart, dailyGoal);
    set({ weeklyStats: stats });
  },

  loadMonthly: async (month, dailyGoal) => {
    const stats = await container.analyticsService.getMonthlyStats(month, dailyGoal);
    set({ monthlyStats: stats });
  },
}));
