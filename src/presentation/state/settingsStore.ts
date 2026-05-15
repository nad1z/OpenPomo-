import { create } from 'zustand';
import { UserSettings, UserSettingsProps } from '../../domain/entities/UserSettings';
import { container } from '../../infrastructure/container';

interface SettingsStore {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;

  load: () => Promise<void>;
  update: (partial: Partial<UserSettingsProps>) => Promise<void>;
  reset: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await container.settingsRepository.load();
      set({ settings, isLoading: false });
    } catch {
      set({ error: 'Failed to load settings', isLoading: false });
    }
  },

  update: async (partial) => {
    const { settings } = get();
    if (!settings) return;
    set({ isLoading: true, error: null });
    try {
      const useCase = new (await import('../../domain/useCases/UpdateSettingsUseCase')).UpdateSettingsUseCase(
        container.settingsRepository,
      );
      const updated = await useCase.execute(settings, partial);
      set({ settings: updated, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      set({ error: message, isLoading: false });
    }
  },

  reset: async () => {
    const defaults = UserSettings.defaults();
    await container.settingsRepository.save(defaults);
    set({ settings: defaults });
  },
}));
