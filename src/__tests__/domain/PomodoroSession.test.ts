import { PomodoroSession } from '../../domain/entities/PomodoroSession';

describe('PomodoroSession', () => {
  describe('create', () => {
    it('creates a session with valid props', () => {
      const session = PomodoroSession.create({
        plannedDuration: 1500,
        type: 'focus',
        sessionNumber: 1,
      });

      expect(session.plannedDuration).toBe(1500);
      expect(session.type).toBe('focus');
      expect(session.status).toBe('in_progress');
      expect(session.actualDuration).toBe(0);
      expect(session.endTime).toBeNull();
      expect(session.id).toBeTruthy();
    });

    it('throws when planned duration is zero', () => {
      expect(() =>
        PomodoroSession.create({ plannedDuration: 0, type: 'focus', sessionNumber: 1 }),
      ).toThrow('Planned duration must be positive');
    });

    it('throws when session number is less than 1', () => {
      expect(() =>
        PomodoroSession.create({ plannedDuration: 1500, type: 'focus', sessionNumber: 0 }),
      ).toThrow('Session number must be 1 or greater');
    });
  });

  describe('complete', () => {
    it('marks session as completed with end time and duration', () => {
      const session = PomodoroSession.create({
        plannedDuration: 1500,
        type: 'focus',
        sessionNumber: 1,
      });

      const completed = session.complete();

      expect(completed.status).toBe('completed');
      expect(completed.endTime).not.toBeNull();
      expect(completed.actualDuration).toBeGreaterThanOrEqual(0);
      expect(completed.isCompleted).toBe(true);
    });

    it('does not mutate original session', () => {
      const session = PomodoroSession.create({
        plannedDuration: 1500,
        type: 'focus',
        sessionNumber: 1,
      });
      session.complete();
      expect(session.status).toBe('in_progress');
    });
  });

  describe('abandon', () => {
    it('marks session as abandoned', () => {
      const session = PomodoroSession.create({
        plannedDuration: 1500,
        type: 'focus',
        sessionNumber: 1,
      });
      const abandoned = session.abandon();
      expect(abandoned.status).toBe('abandoned');
      expect(abandoned.endTime).not.toBeNull();
    });
  });

  describe('completionRate', () => {
    it('returns correct rate for partial session', () => {
      const session = PomodoroSession.reconstitute({
        id: '1',
        startTime: new Date(),
        endTime: new Date(),
        plannedDuration: 1500,
        actualDuration: 750,
        status: 'abandoned',
        type: 'focus',
        notes: '',
        sessionNumber: 1,
      });
      expect(session.completionRate).toBe(0.5);
    });

    it('caps at 1 for overtime sessions', () => {
      const session = PomodoroSession.reconstitute({
        id: '1',
        startTime: new Date(),
        endTime: new Date(),
        plannedDuration: 1500,
        actualDuration: 2000,
        status: 'completed',
        type: 'focus',
        notes: '',
        sessionNumber: 1,
      });
      expect(session.completionRate).toBe(1);
    });
  });
});
