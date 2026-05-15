import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SessionType } from '../../domain/entities/PomodoroSession';

export interface INotificationService {
  requestPermissions(): Promise<boolean>;
  scheduleSessionComplete(type: SessionType, delaySeconds: number): Promise<string>;
  cancelNotification(id: string): Promise<void>;
  cancelAll(): Promise<void>;
  sendImmediateNotification(title: string, body: string): Promise<void>;
}

const MESSAGES: Record<SessionType, { title: string; body: string }> = {
  focus: {
    title: 'Focus session complete! 🍅',
    body: "Great work! Time for a well-deserved break.",
  },
  short_break: {
    title: 'Break time over',
    body: 'Ready to focus? Let\'s get back to work.',
  },
  long_break: {
    title: 'Long break complete',
    body: 'Recharged and ready? Start your next focus session.',
  },
};

export class NotificationService implements INotificationService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async scheduleSessionComplete(type: SessionType, delaySeconds: number): Promise<string> {
    if (Platform.OS === 'web') return '';
    const message = MESSAGES[type];
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
      },
      trigger: { seconds: delaySeconds, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL },
    });
    return id;
  }

  async cancelNotification(id: string): Promise<void> {
    if (Platform.OS === 'web') return;
    await Notifications.cancelScheduledNotificationAsync(id);
  }

  async cancelAll(): Promise<void> {
    if (Platform.OS === 'web') return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    if (Platform.OS === 'web') return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: null,
    });
  }
}
