import { Achievement } from '../entities/Achievement';

export interface IAchievementRepository {
  findAll(): Promise<Achievement[]>;
  save(achievement: Achievement): Promise<void>;
  saveAll(achievements: Achievement[]): Promise<void>;
  findUnlocked(): Promise<Achievement[]>;
}
