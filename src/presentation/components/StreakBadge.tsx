import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../shared/theme/colors';

interface StreakBadgeProps {
  streak: number;
  isDark: boolean;
}

export function StreakBadge({ streak, isDark }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={[styles.count, { color: isDark ? Colors.dark.text.primary : Colors.light.text.primary }]}>
        {streak}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  fire: { fontSize: 16 },
  count: { fontSize: 16, fontWeight: '700' },
});
