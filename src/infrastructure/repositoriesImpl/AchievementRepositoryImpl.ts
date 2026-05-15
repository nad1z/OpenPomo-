import { Achievement, AchievementProps } from '../../domain/entities/Achievement';
import { IAchievementRepository } from '../../domain/repositories/IAchievementRepository';
import { AsyncStorageClient } from '../storage/AsyncStorageClient';

const ACHIEVEMENTS_KEY = 'achievements:all';

interface StoredAchievement extends Omit<AchievementProps, 'earnedAt'> {
  earnedAt: string | null;
}

export class AchievementRepositoryImpl implements IAchievementRepository {
  constructor(private readonly storage: AsyncStorageClient) {}

  async findAll(): Promise<Achievement[]> {
    const stored = await this.storage.get<StoredAchievement[]>(ACHIEVEMENTS_KEY);
    if (!stored) return [];
    return stored.map((s) => this.deserialize(s));
  }

  async save(achievement: Achievement): Promise<void> {
    const all = await this.findAll();
    const index = all.findIndex((a) => a.id === achievement.id);
    if (index >= 0) {
      all[index] = achievement;
    } else {
      all.push(achievement);
    }
    await this.storage.set(ACHIEVEMENTS_KEY, all.map(this.serialize));
  }

  async saveAll(achievements: Achievement[]): Promise<void> {
    await this.storage.set(ACHIEVEMENTS_KEY, achievements.map(this.serialize));
  }

  async findUnlocked(): Promise<Achievement[]> {
    const all = await this.findAll();
    return all.filter((a) => a.isUnlocked);
  }

  private serialize(achievement: Achievement): StoredAchievement {
    return {
      id: achievement.id,
      type: achievement.type,
      title: achievement.title,
      description: achievement.description,
      iconName: achievement.iconName,
      threshold: achievement.threshold,
      earnedAt: achievement.earnedAt?.toISOString() ?? null,
      isUnlocked: achievement.isUnlocked,
    };
  }

  private deserialize(stored: StoredAchievement): Achievement {
    return Achievement.reconstitute({
      id: stored.id,
      type: stored.type,
      title: stored.title,
      description: stored.description,
      iconName: stored.iconName,
      threshold: stored.threshold,
      earnedAt: stored.earnedAt ? new Date(stored.earnedAt) : null,
      isUnlocked: stored.isUnlocked,
    });
  }
}
