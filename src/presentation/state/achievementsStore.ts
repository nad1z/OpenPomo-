import { create } from 'zustand';
import { Achievement } from '../../domain/entities/Achievement';
import { AchievementService } from '../../domain/services/AchievementService';
import { container } from '../../infrastructure/container';

interface AchievementsStore {
  achievements: Achievement[];
  newlyUnlocked: Achievement[];
  isLoading: boolean;

  load: () => Promise<void>;
  evaluate: (
    totalSessions: number,
    totalFocusMinutes: number,
    currentStreak: number,
  ) => Promise<void>;
  clearNewlyUnlocked: () => void;
}

export const useAchievementsStore = create<AchievementsStore>((set, get) => ({
  achievements: [],
  newlyUnlocked: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    let achievements = await container.achievementRepository.findAll();

    if (achievements.length === 0) {
      const service = new AchievementService();
      achievements = service.getDefaultAchievements();
      await container.achievementRepository.saveAll(achievements);
    }
    set({ achievements, isLoading: false });
  },

  evaluate: async (totalSessions, totalFocusMinutes, currentStreak) => {
    const { achievements } = get();
    const service = new AchievementService();
    const updated = service.evaluateAchievements(
      achievements,
      totalSessions,
      totalFocusMinutes,
      currentStreak,
      null,
    );

    const newlyUnlocked = updated.filter(
      (a, i) => a.isUnlocked && !achievements[i]?.isUnlocked,
    );

    if (newlyUnlocked.length > 0) {
      await container.achievementRepository.saveAll(updated);
      set({ achievements: updated, newlyUnlocked });
    }
  },

  clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
}));
