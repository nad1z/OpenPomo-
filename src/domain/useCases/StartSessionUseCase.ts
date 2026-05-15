import { PomodoroSession, SessionType } from '../entities/PomodoroSession';
import { UserSettings } from '../entities/UserSettings';
import { ISessionRepository } from '../repositories/ISessionRepository';

export interface StartSessionInput {
  type: SessionType;
  dailySessionCount: number;
}

export interface StartSessionOutput {
  session: PomodoroSession;
  plannedDurationSeconds: number;
}

export class StartSessionUseCase {
  constructor(private readonly sessionRepo: ISessionRepository) {}

  async execute(input: StartSessionInput, settings: UserSettings): Promise<StartSessionOutput> {
    const plannedDuration = this.getPlannedDuration(input.type, settings);

    const session = PomodoroSession.create({
      plannedDuration,
      type: input.type,
      sessionNumber: input.dailySessionCount + 1,
    });

    await this.sessionRepo.save(session);

    return { session, plannedDurationSeconds: plannedDuration };
  }

  private getPlannedDuration(type: SessionType, settings: UserSettings): number {
    switch (type) {
      case 'focus':
        return settings.focusDurationSeconds;
      case 'short_break':
        return settings.shortBreakDurationSeconds;
      case 'long_break':
        return settings.longBreakDurationSeconds;
    }
  }
}
