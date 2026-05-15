import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TimerPhase } from '../../shared/types';
import { SessionType } from '../../domain/entities/PomodoroSession';
import { Colors } from '../../shared/theme/colors';

interface TimerControlsProps {
  phase: TimerPhase;
  sessionType: SessionType;
  isLoading: boolean;
  isDark: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onAbandon: () => void;
}

const SESSION_COLORS: Record<SessionType, string> = {
  focus: Colors.focus.primary,
  short_break: Colors.shortBreak.primary,
  long_break: Colors.longBreak.primary,
};

export function TimerControls({
  phase,
  sessionType,
  isLoading,
  isDark,
  onStart,
  onPause,
  onResume,
  onReset,
  onAbandon,
}: TimerControlsProps) {
  const accentColor = SESSION_COLORS[sessionType];
  const surfaceColor = isDark ? Colors.dark.elevated : Colors.light.elevated;
  const textColor = isDark ? Colors.dark.text.primary : Colors.light.text.primary;
  const mutedColor = isDark ? Colors.dark.text.muted : Colors.light.text.muted;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={accentColor} size="large" />
      </View>
    );
  }

  const renderPrimaryButton = () => {
    if (phase === 'idle' || phase === 'completed') {
      return (
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: accentColor }]}
          onPress={onStart}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {phase === 'completed' ? 'START NEXT' : 'START'}
          </Text>
        </TouchableOpacity>
      );
    }
    if (phase === 'running') {
      return (
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: accentColor }]}
          onPress={onPause}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>PAUSE</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: accentColor }]}
        onPress={onResume}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>RESUME</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderPrimaryButton()}
      {(phase === 'running' || phase === 'paused') && (
        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: surfaceColor }]}
            onPress={onReset}
          >
            <Text style={[styles.secondaryText, { color: mutedColor }]}>RESET</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: surfaceColor }]}
            onPress={onAbandon}
          >
            <Text style={[styles.secondaryText, { color: Colors.semantic.error }]}>ABANDON</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 280,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    maxWidth: 130,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
