import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SessionType } from '../../domain/entities/PomodoroSession';
import { TimerPhase } from '../../shared/types';
import { formatDuration } from '../../shared/utils/dateUtils';
import { Colors } from '../../shared/theme/colors';

interface TimerDisplayProps {
  remainingSeconds: number;
  phase: TimerPhase;
  sessionType: SessionType;
  isDark: boolean;
}

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'FOCUS',
  short_break: 'SHORT BREAK',
  long_break: 'LONG BREAK',
};

const SESSION_COLORS: Record<SessionType, string> = {
  focus: Colors.focus.primary,
  short_break: Colors.shortBreak.primary,
  long_break: Colors.longBreak.primary,
};

export function TimerDisplay({ remainingSeconds, phase, sessionType, isDark }: TimerDisplayProps) {
  const textColor = isDark ? Colors.dark.text.primary : Colors.light.text.primary;
  const mutedColor = isDark ? Colors.dark.text.muted : Colors.light.text.muted;
  const accentColor = SESSION_COLORS[sessionType];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: accentColor }]}>{SESSION_LABELS[sessionType]}</Text>
      <Text style={[styles.time, { color: textColor }]}>{formatDuration(remainingSeconds)}</Text>
      {phase === 'paused' && (
        <Text style={[styles.status, { color: mutedColor }]}>PAUSED</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  },
  time: {
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
