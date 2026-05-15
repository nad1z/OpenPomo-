import { UserSettings } from '../entities/UserSettings';

export interface ISettingsRepository {
  load(): Promise<UserSettings>;
  save(settings: UserSettings): Promise<void>;
}
