export type AppTheme = 'light' | 'dark' | 'system';

export interface UserSettingsProps {
  readonly focusDuration: number; // minutes
  readonly shortBreakDuration: number; // minutes
  readonly longBreakDuration: number; // minutes
  readonly sessionsBeforeLongBreak: number;
  readonly autoStartBreaks: boolean;
  readonly autoStartFocus: boolean;
  readonly notificationsEnabled: boolean;
  readonly soundEnabled: boolean;
  readonly hapticsEnabled: boolean;
  readonly theme: AppTheme;
  readonly dailyGoal: number; // number of focus sessions per day
  readonly showMotivationalMessages: boolean;
}

export class UserSettings {
  readonly focusDuration: number;
  readonly shortBreakDuration: number;
  readonly longBreakDuration: number;
  readonly sessionsBeforeLongBreak: number;
  readonly autoStartBreaks: boolean;
  readonly autoStartFocus: boolean;
  readonly notificationsEnabled: boolean;
  readonly soundEnabled: boolean;
  readonly hapticsEnabled: boolean;
  readonly theme: AppTheme;
  readonly dailyGoal: number;
  readonly showMotivationalMessages: boolean;

  private constructor(props: UserSettingsProps) {
    this.focusDuration = props.focusDuration;
    this.shortBreakDuration = props.shortBreakDuration;
    this.longBreakDuration = props.longBreakDuration;
    this.sessionsBeforeLongBreak = props.sessionsBeforeLongBreak;
    this.autoStartBreaks = props.autoStartBreaks;
    this.autoStartFocus = props.autoStartFocus;
    this.notificationsEnabled = props.notificationsEnabled;
    this.soundEnabled = props.soundEnabled;
    this.hapticsEnabled = props.hapticsEnabled;
    this.theme = props.theme;
    this.dailyGoal = props.dailyGoal;
    this.showMotivationalMessages = props.showMotivationalMessages;
  }

  static defaults(): UserSettings {
    return new UserSettings({
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      autoStartBreaks: false,
      autoStartFocus: false,
      notificationsEnabled: true,
      soundEnabled: true,
      hapticsEnabled: true,
      theme: 'system',
      dailyGoal: 8,
      showMotivationalMessages: true,
    });
  }

  static create(props: UserSettingsProps): UserSettings {
    UserSettings.validate(props);
    return new UserSettings(props);
  }

  static reconstitute(props: UserSettingsProps): UserSettings {
    return new UserSettings(props);
  }

  private static validate(props: UserSettingsProps): void {
    if (props.focusDuration < 1 || props.focusDuration > 120) {
      throw new Error('Focus duration must be between 1 and 120 minutes');
    }
    if (props.shortBreakDuration < 1 || props.shortBreakDuration > 30) {
      throw new Error('Short break must be between 1 and 30 minutes');
    }
    if (props.longBreakDuration < 5 || props.longBreakDuration > 60) {
      throw new Error('Long break must be between 5 and 60 minutes');
    }
    if (props.sessionsBeforeLongBreak < 2 || props.sessionsBeforeLongBreak > 10) {
      throw new Error('Sessions before long break must be between 2 and 10');
    }
    if (props.dailyGoal < 1 || props.dailyGoal > 20) {
      throw new Error('Daily goal must be between 1 and 20 sessions');
    }
  }

  update(partial: Partial<UserSettingsProps>): UserSettings {
    const merged = { ...this.toProps(), ...partial };
    return UserSettings.create(merged);
  }

  get focusDurationSeconds(): number {
    return this.focusDuration * 60;
  }

  get shortBreakDurationSeconds(): number {
    return this.shortBreakDuration * 60;
  }

  get longBreakDurationSeconds(): number {
    return this.longBreakDuration * 60;
  }

  toProps(): UserSettingsProps {
    return {
      focusDuration: this.focusDuration,
      shortBreakDuration: this.shortBreakDuration,
      longBreakDuration: this.longBreakDuration,
      sessionsBeforeLongBreak: this.sessionsBeforeLongBreak,
      autoStartBreaks: this.autoStartBreaks,
      autoStartFocus: this.autoStartFocus,
      notificationsEnabled: this.notificationsEnabled,
      soundEnabled: this.soundEnabled,
      hapticsEnabled: this.hapticsEnabled,
      theme: this.theme,
      dailyGoal: this.dailyGoal,
      showMotivationalMessages: this.showMotivationalMessages,
    };
  }
}
