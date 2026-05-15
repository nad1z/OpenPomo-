import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SessionType } from '../../domain/entities/PomodoroSession';
import { Colors } from '../../shared/theme/colors';

interface SessionTypeSelectorProps {
  selected: SessionType;
  isDark: boolean;
  onSelect: (type: SessionType) => void;
}

const TYPES: { type: SessionType; label: string }[] = [
  { type: 'focus', label: 'Focus' },
  { type: 'short_break', label: 'Short Break' },
  { type: 'long_break', label: 'Long Break' },
];

const TYPE_COLORS: Record<SessionType, string> = {
  focus: Colors.focus.primary,
  short_break: Colors.shortBreak.primary,
  long_break: Colors.longBreak.primary,
};

export function SessionTypeSelector({ selected, isDark, onSelect }: SessionTypeSelectorProps) {
  const surface = isDark ? Colors.dark.elevated : Colors.light.elevated;

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      {TYPES.map(({ type, label }) => {
        const isActive = selected === type;
        return (
          <TouchableOpacity
            key={type}
            style={[styles.tab, isActive && { backgroundColor: TYPE_COLORS[type] }]}
            onPress={() => onSelect(type)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? '#fff' : isDark ? Colors.dark.text.muted : Colors.light.text.muted },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
