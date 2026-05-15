import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSettingsStore } from '../../presentation/state/settingsStore';
import { useThemeColors } from '../../presentation/hooks/useColorScheme';
import { Colors } from '../../shared/theme/colors';
import { AppTheme } from '../../domain/entities/UserSettings';

function SettingRow({
  label,
  subtitle,
  children,
  isDark: _isDark,
}: {
  label: string;
  subtitle?: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  const { colors } = useThemeColors();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: colors.text.primary }]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.text.muted }]}>{subtitle}</Text>
        )}
      </View>
      {children}
    </View>
  );
}

function DurationSelector({
  value,
  min,
  max,
  onChange,
  isDark,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  isDark: boolean;
}) {
  const { colors } = useThemeColors();
  return (
    <View style={styles.durationSelector}>
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.durationBtn, { backgroundColor: isDark ? Colors.dark.elevated : Colors.light.elevated }]}
      >
        <Text style={[styles.durationBtnText, { color: colors.text.primary }]}>−</Text>
      </TouchableOpacity>
      <Text style={[styles.durationValue, { color: colors.text.primary }]}>{value}m</Text>
      <TouchableOpacity
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.durationBtn, { backgroundColor: isDark ? Colors.dark.elevated : Colors.light.elevated }]}
      >
        <Text style={[styles.durationBtnText, { color: colors.text.primary }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, isDark } = useThemeColors();
  const { settings, load, update, reset } = useSettingsStore();

  useEffect(() => {
    load();
  }, []);

  if (!settings) return null;

  const sectionTitle = (title: string) => (
    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>{title}</Text>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text.primary }]}>Settings</Text>

        {sectionTitle('TIMER DURATIONS')}
        <View style={[styles.section, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }]}>
          <SettingRow label="Focus Duration" subtitle="minutes" isDark={isDark}>
            <DurationSelector
              value={settings.focusDuration}
              min={1}
              max={120}
              onChange={(v) => update({ focusDuration: v })}
              isDark={isDark}
            />
          </SettingRow>
          <SettingRow label="Short Break" subtitle="minutes" isDark={isDark}>
            <DurationSelector
              value={settings.shortBreakDuration}
              min={1}
              max={30}
              onChange={(v) => update({ shortBreakDuration: v })}
              isDark={isDark}
            />
          </SettingRow>
          <SettingRow label="Long Break" subtitle="minutes" isDark={isDark}>
            <DurationSelector
              value={settings.longBreakDuration}
              min={5}
              max={60}
              onChange={(v) => update({ longBreakDuration: v })}
              isDark={isDark}
            />
          </SettingRow>
          <SettingRow label="Sessions before long break" isDark={isDark}>
            <DurationSelector
              value={settings.sessionsBeforeLongBreak}
              min={2}
              max={10}
              onChange={(v) => update({ sessionsBeforeLongBreak: v })}
              isDark={isDark}
            />
          </SettingRow>
        </View>

        {sectionTitle('AUTOMATION')}
        <View style={[styles.section, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }]}>
          <SettingRow label="Auto-start breaks" isDark={isDark}>
            <Switch
              value={settings.autoStartBreaks}
              onValueChange={(v) => update({ autoStartBreaks: v })}
              trackColor={{ true: Colors.focus.primary }}
            />
          </SettingRow>
          <SettingRow label="Auto-start focus" isDark={isDark}>
            <Switch
              value={settings.autoStartFocus}
              onValueChange={(v) => update({ autoStartFocus: v })}
              trackColor={{ true: Colors.focus.primary }}
            />
          </SettingRow>
        </View>

        {sectionTitle('NOTIFICATIONS & FEEDBACK')}
        <View style={[styles.section, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }]}>
          <SettingRow label="Notifications" isDark={isDark}>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(v) => update({ notificationsEnabled: v })}
              trackColor={{ true: Colors.focus.primary }}
            />
          </SettingRow>
          <SettingRow label="Sound" isDark={isDark}>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => update({ soundEnabled: v })}
              trackColor={{ true: Colors.focus.primary }}
            />
          </SettingRow>
          <SettingRow label="Haptics" isDark={isDark}>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(v) => update({ hapticsEnabled: v })}
              trackColor={{ true: Colors.focus.primary }}
            />
          </SettingRow>
        </View>

        {sectionTitle('APPEARANCE')}
        <View style={[styles.section, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }]}>
          {(['system', 'dark', 'light'] as AppTheme[]).map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => update({ theme })}
            >
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)} mode
              </Text>
              {settings.theme === theme && (
                <Text style={{ color: Colors.focus.primary, fontSize: 18 }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {sectionTitle('DAILY GOAL')}
        <View style={[styles.section, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }]}>
          <SettingRow label="Daily sessions goal" isDark={isDark}>
            <DurationSelector
              value={settings.dailyGoal}
              min={1}
              max={20}
              onChange={(v) => update({ dailyGoal: v })}
              isDark={isDark}
            />
          </SettingRow>
        </View>

        <TouchableOpacity
          style={[styles.resetButton, { borderColor: Colors.semantic.error }]}
          onPress={reset}
        >
          <Text style={[styles.resetText, { color: Colors.semantic.error }]}>
            Reset to Defaults
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, gap: 8, paddingBottom: 48 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 4,
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16 },
  settingSubtitle: { fontSize: 12, marginTop: 2 },
  durationSelector: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  durationBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBtnText: { fontSize: 20, fontWeight: '300' },
  durationValue: { fontSize: 16, fontWeight: '600', minWidth: 40, textAlign: 'center' },
  resetButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetText: { fontSize: 15, fontWeight: '600' },
});
