import { PomodoroSession } from '../entities/PomodoroSession';

export interface ISessionRepository {
  save(session: PomodoroSession): Promise<void>;
  findById(id: string): Promise<PomodoroSession | null>;
  findByDate(date: string): Promise<PomodoroSession[]>;
  findByDateRange(startDate: string, endDate: string): Promise<PomodoroSession[]>;
  findAll(): Promise<PomodoroSession[]>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
  countCompletedByDate(date: string): Promise<number>;
}
