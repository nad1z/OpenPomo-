import { create } from 'zustand';
import { PomodoroSession } from '../../domain/entities/PomodoroSession';
import { SessionType } from '../../domain/entities/PomodoroSession';
import { UserSettings } from '../../domain/entities/UserSettings';
import { TimerPhase } from '../../shared/types';
import { container } from '../../infrastructure/container';

interface TimerStore {
  // State
  phase: TimerPhase;
  sessionType: SessionType;
  remainingSeconds: number;
  totalSeconds: number;
  currentSession: PomodoroSession | null;
  settings: UserSettings | null;
  completedTodayCount: number;
  currentStreak: number;
  notificationId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  startFocus: () => Promise<void>;
  startBreak: (isLong: boolean) => Promise<void>;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  skipToComplete: () => Promise<void>;
  abandonCurrent: () => Promise<void>;
  setNotificationId: (id: string | null) => void;
  clearError: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  phase: 'idle',
  sessionType: 'focus',
  remainingSeconds: 25 * 60,
  totalSeconds: 25 * 60,
  currentSession: null,
  settings: null,
  completedTodayCount: 0,
  currentStreak: 0,
  notificationId: null,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    try {
      set({ isLoading: true });
      const settings = await container.settingsRepository.load();
      set({
        settings,
        totalSeconds: settings.focusDurationSeconds,
        remainingSeconds: settings.focusDurationSeconds,
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to load settings', isLoading: false });
    }
  },

  startFocus: async () => {
    const { settings } = get();
    if (!settings) return;
    try {
      set({ isLoading: true });
      const session = await container.timerService.startFocusSession(settings);
      const total = settings.focusDurationSeconds;
      set({
        currentSession: session,
        phase: 'running',
        sessionType: 'focus',
        totalSeconds: total,
        remainingSeconds: total,
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to start session', isLoading: false });
    }
  },

  startBreak: async (isLong: boolean) => {
    const { settings } = get();
    if (!settings) return;
    try {
      set({ isLoading: true });
      const session = await container.timerService.startBreakSession(settings, isLong);
      const total = isLong ? settings.longBreakDurationSeconds : settings.shortBreakDurationSeconds;
      set({
        currentSession: session,
        phase: 'running',
        sessionType: isLong ? 'long_break' : 'short_break',
        totalSeconds: total,
        remainingSeconds: total,
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to start break', isLoading: false });
    }
  },

  pause: () => {
    const { phase } = get();
    if (phase !== 'running') return;
    set({ phase: 'paused' });
  },

  resume: () => {
    const { phase } = get();
    if (phase !== 'paused') return;
    set({ phase: 'running' });
  },

  reset: () => {
    const { settings, sessionType } = get();
    const total = settings
      ? sessionType === 'focus'
        ? settings.focusDurationSeconds
        : sessionType === 'long_break'
        ? settings.longBreakDurationSeconds
        : settings.shortBreakDurationSeconds
      : 25 * 60;
    set({ phase: 'idle', remainingSeconds: total, totalSeconds: total });
  },

  tick: () => {
    const { phase, remainingSeconds } = get();
    if (phase !== 'running') return;
    if (remainingSeconds <= 0) {
      set({ phase: 'completed', remainingSeconds: 0 });
      return;
    }
    set({ remainingSeconds: remainingSeconds - 1 });
  },

  skipToComplete: async () => {
    const { currentSession, settings } = get();
    if (!currentSession || !settings) return;
    try {
      const result = await container.timerService.completeSession(currentSession, settings);
      set({
        phase: 'completed',
        remainingSeconds: 0,
        currentSession: result.session,
        completedTodayCount: result.completedFocusToday,
        currentStreak: result.currentStreak,
      });
    } catch {
      set({ error: 'Failed to complete session' });
    }
  },

  abandonCurrent: async () => {
    const { currentSession } = get();
    if (!currentSession) return;
    try {
      await container.timerService.abandonSession(currentSession);
      const { settings } = get();
      const total = settings?.focusDurationSeconds ?? 25 * 60;
      set({
        phase: 'idle',
        currentSession: null,
        sessionType: 'focus',
        remainingSeconds: total,
        totalSeconds: total,
      });
    } catch {
      set({ error: 'Failed to abandon session' });
    }
  },

  setNotificationId: (id) => set({ notificationId: id }),
  clearError: () => set({ error: null }),
}));
