import { PomodoroSession } from '../entities/PomodoroSession';
import { ISessionRepository } from '../repositories/ISessionRepository';

export interface CompleteSessionOutput {
  session: PomodoroSession;
  shouldStartLongBreak: boolean;
  completedFocusSessionsToday: number;
}

export class CompleteSessionUseCase {
  constructor(private readonly sessionRepo: ISessionRepository) {}

  async execute(
    session: PomodoroSession,
    sessionsBeforeLongBreak: number,
  ): Promise<CompleteSessionOutput> {
    const completed = session.complete();
    await this.sessionRepo.save(completed);

    const today = new Date().toISOString().split('T')[0];
    const todaySessions = await this.sessionRepo.findByDate(today);
    const completedFocusToday = todaySessions.filter(
      (s) => s.type === 'focus' && s.status === 'completed',
    ).length;

    const shouldStartLongBreak = completedFocusToday % sessionsBeforeLongBreak === 0;

    return {
      session: completed,
      shouldStartLongBreak,
      completedFocusSessionsToday: completedFocusToday,
    };
  }
}
