import { UserSettings, UserSettingsProps } from '../entities/UserSettings';
import { ISettingsRepository } from '../repositories/ISettingsRepository';

export class UpdateSettingsUseCase {
  constructor(private readonly settingsRepo: ISettingsRepository) {}

  async execute(current: UserSettings, updates: Partial<UserSettingsProps>): Promise<UserSettings> {
    const updated = current.update(updates);
    await this.settingsRepo.save(updated);
    return updated;
  }
}
