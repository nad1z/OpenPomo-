import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { PomodoroSession } from '../../domain/entities/PomodoroSession';

export class CsvExportService {
  async exportSessions(sessions: PomodoroSession[]): Promise<void> {
    const csv = this.buildCsv(sessions);
    const fileName = `openpomo-sessions-${new Date().toISOString().split('T')[0]}.csv`;

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Session History',
      });
    }
  }

  private buildCsv(sessions: PomodoroSession[]): string {
    const header = 'ID,Date,Start Time,End Time,Type,Status,Planned (min),Actual (min),Notes\n';
    const rows = sessions
      .map((s) => {
        const date = s.startTime.toISOString().split('T')[0];
        const start = s.startTime.toLocaleTimeString();
        const end = s.endTime?.toLocaleTimeString() ?? '';
        const planned = Math.floor(s.plannedDuration / 60);
        const actual = Math.floor(s.actualDuration / 60);
        return `${s.id},${date},${start},${end},${s.type},${s.status},${planned},${actual},"${s.notes}"`;
      })
      .join('\n');
    return header + rows;
  }
}
