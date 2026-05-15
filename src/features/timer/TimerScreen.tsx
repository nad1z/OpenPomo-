import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useTimer } from '../../presentation/hooks/useTimer';
import { useThemeColors } from '../../presentation/hooks/useColorScheme';
import { ProgressRing } from '../../presentation/components/ProgressRing';
import { TimerDisplay } from '../../presentation/components/TimerDisplay';
import { TimerControls } from '../../presentation/components/TimerControls';
import { StreakBadge } from '../../presentation/components/StreakBadge';
import { SessionTypeSelector } from '../../presentation/components/SessionTypeSelector';
import { useTimerStore } from '../../presentation/state/timerStore';
import { SessionType } from '../../domain/entities/PomodoroSession';
import { Colors } from '../../shared/theme/colors';
import { MOTIVATIONAL_MESSAGES } from '../../shared/constants';

const SESSION_RING_COLORS: Record<SessionType, string> = {
  focus: Colors.focus.primary,
  short_break: Colors.shortBreak.primary,
  long_break: Colors.longBreak.primary,
};

export default function TimerScreen() {
  const {
    phase,
    sessionType,
    remainingSeconds,
    totalSeconds,
    progress,
    completedTodayCount,
    currentStreak,
    isLoading,
    settings,
    startFocus,
    startBreak,
    pause,
    resume,
    reset,
    abandon,
    skip,
    loadSettings,
  } = useTimer();

  const { colors, isDark } = useThemeColors();
  const setSessionType = useTimerStore((s) => s.sessionType);

  const motivationalMessage = MOTIVATIONAL_MESSAGES[
    completedTodayCount % MOTIVATIONAL_MESSAGES.length
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const handleStart = useCallback(() => {
    if (sessionType === 'focus') {
      startFocus();
    } else {
      startBreak(sessionType === 'long_break');
    }
  }, [sessionType, startFocus, startBreak]);

  const handleAbandon = useCallback(() => {
    Alert.alert(
      'Abandon Session?',
      'This session will be marked as abandoned.',
      [
        { text: 'Keep Going', style: 'cancel' },
        { text: 'Abandon', style: 'destructive', onPress: abandon },
      ],
    );
  }, [abandon]);

  const handleTypeSelect = useCallback(
    (type: SessionType) => {
      if (phase === 'idle' || phase === 'completed') {
        useTimerStore.setState({ sessionType: type });
      }
    },
    [phase],
  );

  const ringColor = SESSION_RING_COLORS[sessionType];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: colors.text.primary }]}>OpenPomo</Text>
            <Text style={[styles.subheading, { color: colors.text.muted }]}>
              {completedTodayCount} sessions today
            </Text>
          </View>
          <StreakBadge streak={currentStreak} isDark={isDark} />
        </View>

        {/* Session type selector */}
        {(phase === 'idle' || phase === 'completed') && (
          <View style={styles.selectorRow}>
            <SessionTypeSelector
              selected={sessionType}
              isDark={isDark}
              onSelect={handleTypeSelect}
            />
          </View>
        )}

        {/* Main ring */}
        <View style={styles.ringContainer}>
          <ProgressRing
            progress={progress}
            size={280}
            strokeWidth={14}
            color={ringColor}
            trackColor={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
          >
            <TimerDisplay
              remainingSeconds={remainingSeconds}
              phase={phase}
              sessionType={sessionType}
              isDark={isDark}
            />
          </ProgressRing>
        </View>

        {/* Controls */}
        <TimerControls
          phase={phase}
          sessionType={sessionType}
          isLoading={isLoading}
          isDark={isDark}
          onStart={handleStart}
          onPause={pause}
          onResume={resume}
          onReset={reset}
          onAbandon={handleAbandon}
        />

        {/* Motivational message */}
        {phase === 'running' && (
          <Text style={[styles.motivation, { color: colors.text.muted }]}>
            {motivationalMessage}
          </Text>
        )}

        {/* Session completion celebration */}
        {phase === 'completed' && (
          <View style={[styles.completionBanner, { backgroundColor: ringColor + '20' }]}>
            <Text style={styles.completionEmoji}>
              {sessionType === 'focus' ? '🍅' : '☕'}
            </Text>
            <Text style={[styles.completionText, { color: ringColor }]}>
              {sessionType === 'focus'
                ? `Session ${completedTodayCount} complete!`
                : 'Break complete!'}
            </Text>
          </View>
        )}

        {/* Daily progress */}
        {settings && (
          <View style={styles.dailyProgress}>
            <Text style={[styles.dailyLabel, { color: colors.text.muted }]}>
              Daily Goal: {completedTodayCount}/{settings.dailyGoal}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: ringColor,
                    width: `${Math.min(100, (completedTodayCount / settings.dailyGoal) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: 16,
  },
  appName: { fontSize: 22, fontWeight: '700' },
  subheading: { fontSize: 13, marginTop: 2 },
  selectorRow: { width: '100%' },
  ringContainer: {
    marginVertical: 8,
  },
  motivation: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  completionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
  },
  completionEmoji: { fontSize: 24 },
  completionText: { fontSize: 16, fontWeight: '600' },
  dailyProgress: { width: '100%', gap: 8 },
  dailyLabel: { fontSize: 13, textAlign: 'center' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden', width: '100%' },
  progressFill: { height: '100%', borderRadius: 2 },
});
