import { PomodoroSession } from '../entities/PomodoroSession';
import { ISessionRepository } from '../repositories/ISessionRepository';

export type HistoryFilter = 'today' | 'week' | 'month' | 'all';

export interface GetSessionHistoryInput {
  filter: HistoryFilter;
  referenceDate?: string; // ISO date YYYY-MM-DD, defaults to today
}

export class GetSessionHistoryUseCase {
  constructor(private readonly sessionRepo: ISessionRepository) {}

  async execute(input: GetSessionHistoryInput): Promise<PomodoroSession[]> {
    const ref = input.referenceDate ?? new Date().toISOString().split('T')[0];

    switch (input.filter) {
      case 'today':
        return this.sessionRepo.findByDate(ref);
      case 'week': {
        const { start, end } = this.getWeekRange(ref);
        return this.sessionRepo.findByDateRange(start, end);
      }
      case 'month': {
        const { start, end } = this.getMonthRange(ref);
        return this.sessionRepo.findByDateRange(start, end);
      }
      case 'all':
        return this.sessionRepo.findAll();
    }
  }

  private getWeekRange(date: string): { start: string; end: string } {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0],
    };
  }

  private getMonthRange(date: string): { start: string; end: string } {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  }
}
