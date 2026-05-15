import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useHistoryStore } from '../../presentation/state/historyStore';
import { useThemeColors } from '../../presentation/hooks/useColorScheme';
import { SessionDTO } from '../../application/dto/SessionDTO';
import { Colors } from '../../shared/theme/colors';
import { HistoryFilter } from '../../domain/useCases/GetSessionHistoryUseCase';

const FILTERS: { id: HistoryFilter; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'all', label: 'All' },
];

const TYPE_COLORS = {
  focus: Colors.focus.primary,
  short_break: Colors.shortBreak.primary,
  long_break: Colors.longBreak.primary,
};

const TYPE_LABELS = {
  focus: '🍅 Focus',
  short_break: '☕ Short Break',
  long_break: '🛋️ Long Break',
};

export default function HistoryScreen() {
  const { colors, isDark } = useThemeColors();
  const { sessions, filter, isLoading, load, setFilter, deleteSession, exportCsv } =
    useHistoryStore();

  useEffect(() => {
    load('today');
  }, []);

  const handleDelete = (session: SessionDTO) => {
    Alert.alert('Delete Session?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSession(session.id) },
    ]);
  };

  const renderSession = ({ item }: { item: SessionDTO }) => {
    const accent = TYPE_COLORS[item.type];
    return (
      <View
        style={[
          styles.sessionCard,
          {
            backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
            borderLeftColor: accent,
          },
        ]}
      >
        <View style={styles.sessionMain}>
          <Text style={[styles.sessionType, { color: accent }]}>{TYPE_LABELS[item.type]}</Text>
          <Text style={[styles.sessionTime, { color: colors.text.secondary }]}>
            {item.startTime}{item.endTime ? ` – ${item.endTime}` : ''}
          </Text>
          <View style={styles.sessionMeta}>
            <Text style={[styles.sessionDuration, { color: colors.text.primary }]}>
              {item.actualMinutes}m actual
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === 'completed'
                      ? Colors.semantic.success + '20'
                      : Colors.semantic.error + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status === 'completed'
                        ? Colors.semantic.success
                        : Colors.semantic.error,
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
          <Text style={{ color: Colors.semantic.error, fontSize: 18 }}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text.primary }]}>History</Text>
        <TouchableOpacity onPress={exportCsv} style={styles.exportBtn}>
          <Text style={[styles.exportText, { color: Colors.focus.primary }]}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={[
              styles.filterTab,
              {
                backgroundColor:
                  filter === f.id
                    ? Colors.focus.primary
                    : isDark
                    ? Colors.dark.elevated
                    : Colors.light.elevated,
              },
            ]}
          >
            <Text
              style={[
                styles.filterLabel,
                { color: filter === f.id ? '#fff' : colors.text.muted },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.text.muted }]}>
            {isLoading ? 'Loading...' : 'No sessions found'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: { fontSize: 28, fontWeight: '700' },
  exportBtn: { padding: 8 },
  exportText: { fontSize: 14, fontWeight: '600' },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterLabel: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 24, gap: 8, paddingBottom: 32 },
  sessionCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    alignItems: 'center',
  },
  sessionMain: { flex: 1, gap: 4 },
  sessionType: { fontSize: 14, fontWeight: '600' },
  sessionTime: { fontSize: 12 },
  sessionMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  sessionDuration: { fontSize: 13, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  deleteButton: { padding: 8 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
});
