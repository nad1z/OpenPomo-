import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAnalyticsStore } from '../../presentation/state/analyticsStore';
import { useSettingsStore } from '../../presentation/state/settingsStore';
import { useThemeColors } from '../../presentation/hooks/useColorScheme';
import { StatCard } from '../../presentation/components/StatCard';
import { Colors } from '../../shared/theme/colors';
import { formatMinutes, getDayLabel } from '../../shared/utils/dateUtils';

export default function AnalyticsScreen() {
  const { colors, isDark } = useThemeColors();
  const { daily, weekly, monthly, currentStreak, longestStreak, loadAll } =
    useAnalyticsStore((s) => ({
      daily: s.dailyStats,
      weekly: s.weeklyStats,
      monthly: s.monthlyStats,
      currentStreak: s.currentStreak,
      longestStreak: s.longestStreak,
      loadAll: s.loadAll,
    }));

  const dailyGoal = useSettingsStore((s) => s.settings?.dailyGoal ?? 8);

  useEffect(() => {
    loadAll(dailyGoal);
  }, [dailyGoal]);

  const sectionTitle = (title: string) => (
    <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>{title}</Text>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text.primary }]}>Analytics</Text>

        {sectionTitle('TODAY')}
        <View style={styles.row}>
          <StatCard
            label="Sessions"
            value={daily?.completedFocusSessions ?? 0}
            subtitle={`Goal: ${dailyGoal}`}
            accent={Colors.focus.primary}
            isDark={isDark}
          />
          <StatCard
            label="Focus Time"
            value={formatMinutes(daily?.totalFocusMinutes ?? 0)}
            isDark={isDark}
          />
        </View>
        <View style={styles.row}>
          <StatCard
            label="Completion"
            value={`${Math.round((daily?.completionRate ?? 0) * 100)}%`}
            isDark={isDark}
          />
          <StatCard
            label="Current Streak"
            value={`${currentStreak}🔥`}
            subtitle={`Best: ${longestStreak}`}
            accent={Colors.semantic.warning}
            isDark={isDark}
          />
        </View>

        {sectionTitle('THIS WEEK')}
        {weekly && (
          <>
            <View style={styles.row}>
              <StatCard
                label="Sessions"
                value={weekly.totalCompletedSessions}
                isDark={isDark}
                accent={Colors.focus.primary}
              />
              <StatCard
                label="Focus Hours"
                value={`${(weekly.totalFocusMinutes / 60).toFixed(1)}h`}
                isDark={isDark}
              />
            </View>
            <View style={styles.weekChart}>
              {weekly.dailyBreakdown.map((day) => {
                const heightPct =
                  weekly.totalCompletedSessions > 0
                    ? (day.completedFocusSessions / Math.max(...weekly.dailyBreakdown.map((d) => d.completedFocusSessions), 1)) * 100
                    : 0;
                const isToday =
                  day.date === new Date().toISOString().split('T')[0];
                return (
                  <View key={day.date} style={styles.barColumn}>
                    <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPct}%`,
                            backgroundColor: isToday
                              ? Colors.focus.primary
                              : Colors.focus.light,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, { color: colors.text.muted }]}>
                      {getDayLabel(day.date)}
                    </Text>
                    <Text style={[styles.barValue, { color: colors.text.secondary }]}>
                      {day.completedFocusSessions}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {sectionTitle('THIS MONTH')}
        {monthly && (
          <View style={styles.row}>
            <StatCard
              label="Total Sessions"
              value={monthly.totalCompletedSessions}
              isDark={isDark}
              accent={Colors.focus.primary}
            />
            <StatCard
              label="Focus Hours"
              value={`${monthly.totalFocusHours}h`}
              subtitle={`${monthly.activeDays} active days`}
              isDark={isDark}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    padding: 24,
    gap: 12,
  },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 8,
  },
  row: { flexDirection: 'row', gap: 12 },
  weekChart: {
    flexDirection: 'row',
    gap: 8,
    height: 140,
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: 10, fontWeight: '600' },
  barValue: { fontSize: 11 },
});
