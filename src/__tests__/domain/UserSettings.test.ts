import { UserSettings } from '../../domain/entities/UserSettings';

describe('UserSettings', () => {
  describe('defaults', () => {
    it('returns valid default settings', () => {
      const settings = UserSettings.defaults();
      expect(settings.focusDuration).toBe(25);
      expect(settings.shortBreakDuration).toBe(5);
      expect(settings.longBreakDuration).toBe(15);
      expect(settings.sessionsBeforeLongBreak).toBe(4);
      expect(settings.theme).toBe('system');
      expect(settings.dailyGoal).toBe(8);
    });
  });

  describe('create', () => {
    it('throws for invalid focus duration', () => {
      expect(() =>
        UserSettings.create({ ...UserSettings.defaults().toProps(), focusDuration: 0 }),
      ).toThrow('Focus duration must be between 1 and 120 minutes');
    });

    it('throws for focus duration over 120', () => {
      expect(() =>
        UserSettings.create({ ...UserSettings.defaults().toProps(), focusDuration: 200 }),
      ).toThrow();
    });

    it('throws for invalid daily goal', () => {
      expect(() =>
        UserSettings.create({ ...UserSettings.defaults().toProps(), dailyGoal: 25 }),
      ).toThrow('Daily goal must be between 1 and 20 sessions');
    });
  });

  describe('computed properties', () => {
    it('returns correct duration in seconds', () => {
      const settings = UserSettings.defaults();
      expect(settings.focusDurationSeconds).toBe(25 * 60);
      expect(settings.shortBreakDurationSeconds).toBe(5 * 60);
      expect(settings.longBreakDurationSeconds).toBe(15 * 60);
    });
  });

  describe('update', () => {
    it('returns new instance with updated value', () => {
      const settings = UserSettings.defaults();
      const updated = settings.update({ focusDuration: 30 });
      expect(updated.focusDuration).toBe(30);
      expect(settings.focusDuration).toBe(25); // immutable
    });
  });
});
