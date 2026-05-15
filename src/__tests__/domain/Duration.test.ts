import { Duration } from '../../domain/valueObjects/Duration';

describe('Duration', () => {
  it('creates from seconds', () => {
    const d = Duration.fromSeconds(90);
    expect(d.seconds).toBe(90);
    expect(d.minutes).toBe(1);
    expect(d.displaySeconds).toBe(30);
  });

  it('creates from minutes', () => {
    const d = Duration.fromMinutes(25);
    expect(d.seconds).toBe(1500);
  });

  it('formats correctly', () => {
    const d = Duration.fromSeconds(90);
    expect(d.formatted).toBe('01:30');
  });

  it('formats zero correctly', () => {
    expect(Duration.zero().formatted).toBe('00:00');
  });

  it('subtracts without going negative', () => {
    const a = Duration.fromSeconds(10);
    const b = Duration.fromSeconds(20);
    const result = a.subtract(b);
    expect(result.isZero()).toBe(true);
  });

  it('adds correctly', () => {
    const a = Duration.fromSeconds(60);
    const b = Duration.fromSeconds(30);
    expect(a.add(b).seconds).toBe(90);
  });

  it('throws for negative seconds', () => {
    expect(() => Duration.fromSeconds(-1)).toThrow('Duration cannot be negative');
  });
});
