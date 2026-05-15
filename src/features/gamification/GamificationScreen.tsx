import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAchievementsStore } from '../../presentation/state/achievementsStore';
import { useAnalyticsStore } from '../../presentation/state/analyticsStore';
import { useThemeColors } from '../../presentation/hooks/useColorScheme';
import { AchievementCard } from '../../presentation/components/AchievementCard';
import { Colors } from '../../shared/theme/colors';
import { Achievement } from '../../domain/entities/Achievement';

export default function GamificationScreen() {
  const { colors, isDark } = useThemeColors();
  const { achievements, load } = useAchievementsStore();
  const { currentStreak, longestStreak } = useAnalyticsStore((s) => ({
    currentStreak: s.currentStreak,
    longestStreak: s.longestStreak,
  }));

  useEffect(() => {
    load();
  }, []);

  const unlocked = achievements.filter((a) => a.isUnlocked);
  const locked = achievements.filter((a) => !a.isUnlocked);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={[...unlocked, ...locked]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Achievement }) => (
          <AchievementCard achievement={item} isDark={isDark} />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={[styles.heading, { color: colors.text.primary }]}>Achievements</Text>
            <View style={styles.streakRow}>
              <View style={[styles.streakCard, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }]}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={[styles.streakValue, { color: colors.text.primary }]}>{currentStreak}</Text>
                <Text style={[styles.streakLabel, { color: colors.text.muted }]}>Current Streak</Text>
              </View>
              <View style={[styles.streakCard, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }]}>
                <Text style={styles.streakEmoji}>🏆</Text>
                <Text style={[styles.streakValue, { color: colors.text.primary }]}>{longestStreak}</Text>
                <Text style={[styles.streakLabel, { color: colors.text.muted }]}>Best Streak</Text>
              </View>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
              {unlocked.length}/{achievements.length} UNLOCKED
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: 24, gap: 4 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  streakRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  streakCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  streakEmoji: { fontSize: 28 },
  streakValue: { fontSize: 32, fontWeight: '700' },
  streakLabel: { fontSize: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
});
