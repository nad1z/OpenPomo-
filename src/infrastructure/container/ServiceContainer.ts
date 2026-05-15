import { AsyncStorageClient } from '../storage/AsyncStorageClient';
import { SessionRepositoryImpl } from '../repositoriesImpl/SessionRepositoryImpl';
import { SettingsRepositoryImpl } from '../repositoriesImpl/SettingsRepositoryImpl';
import { AchievementRepositoryImpl } from '../repositoriesImpl/AchievementRepositoryImpl';
import { StreakRepositoryImpl } from '../repositoriesImpl/StreakRepositoryImpl';
import { NotificationService } from '../notifications/NotificationService';
import { CsvExportService } from '../analytics/CsvExportService';
import { TimerApplicationService } from '../../application/services/TimerApplicationService';
import { AnalyticsApplicationService } from '../../application/services/AnalyticsApplicationService';

class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  readonly storageClient: AsyncStorageClient;
  readonly sessionRepository: SessionRepositoryImpl;
  readonly settingsRepository: SettingsRepositoryImpl;
  readonly achievementRepository: AchievementRepositoryImpl;
  readonly streakRepository: StreakRepositoryImpl;
  readonly notificationService: NotificationService;
  readonly csvExportService: CsvExportService;
  readonly timerService: TimerApplicationService;
  readonly analyticsService: AnalyticsApplicationService;

  private constructor() {
    this.storageClient = new AsyncStorageClient();
    this.sessionRepository = new SessionRepositoryImpl(this.storageClient);
    this.settingsRepository = new SettingsRepositoryImpl(this.storageClient);
    this.achievementRepository = new AchievementRepositoryImpl(this.storageClient);
    this.streakRepository = new StreakRepositoryImpl(this.storageClient);
    this.notificationService = new NotificationService();
    this.csvExportService = new CsvExportService();
    this.timerService = new TimerApplicationService(
      this.sessionRepository,
      this.settingsRepository,
      this.streakRepository,
    );
    this.analyticsService = new AnalyticsApplicationService(
      this.sessionRepository,
      this.streakRepository,
    );
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }
}

export const container = ServiceContainer.getInstance();
