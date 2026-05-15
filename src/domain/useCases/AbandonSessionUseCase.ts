import { PomodoroSession } from '../entities/PomodoroSession';
import { ISessionRepository } from '../repositories/ISessionRepository';

export class AbandonSessionUseCase {
  constructor(private readonly sessionRepo: ISessionRepository) {}

  async execute(session: PomodoroSession): Promise<PomodoroSession> {
    const abandoned = session.abandon();
    await this.sessionRepo.save(abandoned);
    return abandoned;
  }
}
