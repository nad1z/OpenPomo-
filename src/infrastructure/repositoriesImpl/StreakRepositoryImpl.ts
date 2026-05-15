import { Streak } from '../../domain/valueObjects/Streak';
import { IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { AsyncStorageClient } from '../storage/AsyncStorageClient';

const STREAK_KEY = 'user:streak';

interface StoredStreak {
  current: number;
  longest: number;
  lastActivityDate: string | null;
}

export class StreakRepositoryImpl implements IStreakRepository {
  constructor(private readonly storage: AsyncStorageClient) {}

  async load(): Promise<Streak> {
    const stored = await this.storage.get<StoredStreak>(STREAK_KEY);
    if (!stored) return Streak.initial();
    return Streak.reconstitute(stored.current, stored.longest, stored.lastActivityDate);
  }

  async save(streak: Streak): Promise<void> {
    const stored: StoredStreak = {
      current: streak.current,
      longest: streak.longest,
      lastActivityDate: streak.lastActivityDate,
    };
    await this.storage.set(STREAK_KEY, stored);
  }
}
