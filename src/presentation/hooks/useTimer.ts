import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTimerStore } from '../state/timerStore';
import { container } from '../../infrastructure/container';

export function useTimer() {
  const store = useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backgroundTimeRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      store.tick();
    }, 1000);
  }, [store]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (store.phase === 'running') {
      startInterval();
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [store.phase, startInterval, stopInterval]);

  // Handle session completion
  useEffect(() => {
    if (store.phase === 'completed' && store.currentSession) {
      const settings = store.settings;
      if (!settings) return;

      container.timerService
        .completeSession(store.currentSession, settings)
        .then((result) => {
          useTimerStore.setState({
            completedTodayCount: result.completedFocusToday,
            currentStreak: result.currentStreak,
            currentSession: result.session,
          });

          if (settings.notificationsEnabled) {
            container.notificationService.sendImmediateNotification(
              store.sessionType === 'focus'
                ? 'Focus complete! 🍅'
                : 'Break time over',
              store.sessionType === 'focus'
                ? 'Great work! Time for a break.'
                : 'Ready to focus again?',
            );
          }
        })
        .catch(() => {});
    }
  }, [store.phase]);

  // Background time tracking
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        appStateRef.current === 'active' &&
        nextState.match(/inactive|background/)
      ) {
        if (store.phase === 'running') {
          backgroundTimeRef.current = Date.now();
        }
      }

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        if (store.phase === 'running' && backgroundTimeRef.current) {
          const elapsed = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
          const newRemaining = Math.max(0, store.remainingSeconds - elapsed);
          useTimerStore.setState({ remainingSeconds: newRemaining });
          if (newRemaining === 0) {
            useTimerStore.setState({ phase: 'completed' });
          }
          backgroundTimeRef.current = null;
        }
      }

      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, [store.phase, store.remainingSeconds]);

  return {
    phase: store.phase,
    sessionType: store.sessionType,
    remainingSeconds: store.remainingSeconds,
    totalSeconds: store.totalSeconds,
    progress: store.totalSeconds > 0 ? 1 - store.remainingSeconds / store.totalSeconds : 0,
    completedTodayCount: store.completedTodayCount,
    currentStreak: store.currentStreak,
    isLoading: store.isLoading,
    settings: store.settings,
    startFocus: store.startFocus,
    startBreak: store.startBreak,
    pause: store.pause,
    resume: store.resume,
    reset: store.reset,
    abandon: store.abandonCurrent,
    skip: store.skipToComplete,
    loadSettings: store.loadSettings,
  };
}
