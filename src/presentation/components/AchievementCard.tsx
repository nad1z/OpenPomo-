import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '../../domain/entities/Achievement';
import { Colors } from '../../shared/theme/colors';

interface AchievementCardProps {
  achievement: Achievement;
  isDark: boolean;
}

export function AchievementCard({ achievement, isDark }: AchievementCardProps) {
  const surface = isDark ? Colors.dark.surface : Colors.light.surface;
  const borderColor = achievement.isUnlocked
    ? Colors.semantic.warning
    : isDark
    ? Colors.dark.border
    : Colors.light.border;
  const textColor = isDark ? Colors.dark.text.primary : Colors.light.text.primary;
  const mutedColor = isDark ? Colors.dark.text.muted : Colors.light.text.muted;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: surface, borderColor },
        !achievement.isUnlocked && styles.locked,
      ]}
    >
      <Text style={styles.icon}>{achievement.isUnlocked ? '🏆' : '🔒'}</Text>
      <View style={styles.content}>
        <Text style={[styles.title, { color: achievement.isUnlocked ? textColor : mutedColor }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.description, { color: mutedColor }]}>{achievement.description}</Text>
        {achievement.earnedAt && (
          <Text style={[styles.date, { color: Colors.semantic.success }]}>
            Earned {achievement.earnedAt.toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  locked: { opacity: 0.5 },
  icon: { fontSize: 32 },
  content: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 13 },
  date: { fontSize: 11, marginTop: 2 },
});
