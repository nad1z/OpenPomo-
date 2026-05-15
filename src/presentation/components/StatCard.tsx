import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../shared/theme/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: string;
  isDark: boolean;
}

export function StatCard({ label, value, subtitle, accent, isDark }: StatCardProps) {
  const surface = isDark ? Colors.dark.surface : Colors.light.surface;
  const textColor = isDark ? Colors.dark.text.primary : Colors.light.text.primary;
  const mutedColor = isDark ? Colors.dark.text.muted : Colors.light.text.muted;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor }]}>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
      <Text style={[styles.value, { color: accent ?? textColor }]}>{value}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: mutedColor }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
  },
});
