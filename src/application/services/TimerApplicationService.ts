import { PomodoroSession, SessionType } from '../../domain/entities/PomodoroSession';
import { UserSettings } from '../../domain/entities/UserSettings';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { StartSessionUseCase } from '../../domain/useCases/StartSessionUseCase';
import { CompleteSessionUseCase } from '../../domain/useCases/CompleteSessionUseCase';
import { AbandonSessionUseCase } from '../../domain/useCases/AbandonSessionUseCase';
import { StreakService } from '../../domain/services/StreakService';

export interface SessionCompletedResult {
  session: PomodoroSession;
  nextSessionType: SessionType;
  completedFocusToday: number;
  currentStreak: number;
}

export class TimerApplicationService {
  private readonly startUseCase: StartSessionUseCase;
  private readonly completeUseCase: CompleteSessionUseCase;
  private readonly abandonUseCase: AbandonSessionUseCase;
  private readonly streakService: StreakService;

  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly settingsRepo: ISettingsRepository,
    private readonly streakRepo: IStreakRepository,
  ) {
    this.startUseCase = new StartSessionUseCase(sessionRepo);
    this.completeUseCase = new CompleteSessionUseCase(sessionRepo);
    this.abandonUseCase = new AbandonSessionUseCase(sessionRepo);
    this.streakService = new StreakService();
  }

  async startFocusSession(settings: UserSettings): Promise<PomodoroSession> {
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = await this.sessionRepo.countCompletedByDate(today);

    const { session } = await this.startUseCase.execute(
      { type: 'focus', dailySessionCount: dailyCount },
      settings,
    );
    return session;
  }

  async startBreakSession(settings: UserSettings, isLongBreak: boolean): Promise<PomodoroSession> {
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = await this.sessionRepo.countCompletedByDate(today);
    const type: SessionType = isLongBreak ? 'long_break' : 'short_break';

    const { session } = await this.startUseCase.execute(
      { type, dailySessionCount: dailyCount },
      settings,
    );
    return session;
  }

  async completeSession(
    session: PomodoroSession,
    settings: UserSettings,
  ): Promise<SessionCompletedResult> {
    const { session: completed, shouldStartLongBreak, completedFocusSessionsToday } =
      await this.completeUseCase.execute(session, settings.sessionsBeforeLongBreak);

    let currentStreak = 0;
    if (session.type === 'focus') {
      const streak = await this.streakRepo.load();
      const today = new Date().toISOString().split('T')[0];
      const updatedStreak = this.streakService.updateStreak(streak, today);
      await this.streakRepo.save(updatedStreak);
      currentStreak = updatedStreak.current;
    }

    const nextSessionType: SessionType = shouldStartLongBreak ? 'long_break' : 'short_break';

    return {
      session: completed,
      nextSessionType,
      completedFocusToday: completedFocusSessionsToday,
      currentStreak,
    };
  }

  async abandonSession(session: PomodoroSession): Promise<PomodoroSession> {
    return this.abandonUseCase.execute(session);
  }

  async loadSettings(): Promise<UserSettings> {
    return this.settingsRepo.load();
  }
}
