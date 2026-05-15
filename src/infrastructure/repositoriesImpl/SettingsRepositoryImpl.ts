import { UserSettings, UserSettingsProps } from '../../domain/entities/UserSettings';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { AsyncStorageClient } from '../storage/AsyncStorageClient';

const SETTINGS_KEY = 'user:settings';

export class SettingsRepositoryImpl implements ISettingsRepository {
  constructor(private readonly storage: AsyncStorageClient) {}

  async load(): Promise<UserSettings> {
    const stored = await this.storage.get<UserSettingsProps>(SETTINGS_KEY);
    if (!stored) return UserSettings.defaults();
    try {
      return UserSettings.reconstitute(stored);
    } catch {
      return UserSettings.defaults();
    }
  }

  async save(settings: UserSettings): Promise<void> {
    await this.storage.set(SETTINGS_KEY, settings.toProps());
  }
}
