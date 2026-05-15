import { PomodoroSession } from '../../domain/entities/PomodoroSession';
import { SessionRepositoryImpl } from '../../infrastructure/repositoriesImpl/SessionRepositoryImpl';

const mockStorage = {
  data: new Map<string, string>(),
  async get<T>(key: string): Promise<T | null> {
    const v = this.data.get(key);
    return v ? (JSON.parse(v) as T) : null;
  },
  async set<T>(key: string, value: T): Promise<void> {
    this.data.set(key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    this.data.delete(key);
  },
  async getAllKeys(prefix: string): Promise<string[]> {
    return Array.from(this.data.keys()).filter((k) => k.startsWith(prefix));
  },
  async multiGet<T>(keys: string[]): Promise<T[]> {
    return keys
      .map((k) => this.data.get(k))
      .filter(Boolean)
      .map((v) => JSON.parse(v!) as T);
  },
  async multiRemove(keys: string[]): Promise<void> {
    keys.forEach((k) => this.data.delete(k));
  },
};

describe('SessionRepositoryImpl', () => {
  let repo: SessionRepositoryImpl;

  beforeEach(() => {
    mockStorage.data.clear();
    repo = new SessionRepositoryImpl(mockStorage as any);
  });

  it('saves and retrieves a session by id', async () => {
    const session = PomodoroSession.create({
      plannedDuration: 1500,
      type: 'focus',
      sessionNumber: 1,
    });

    await repo.save(session);
    const found = await repo.findById(session.id);

    expect(found).not.toBeNull();
    expect(found!.id).toBe(session.id);
    expect(found!.type).toBe('focus');
    expect(found!.status).toBe('in_progress');
  });

  it('returns null for unknown id', async () => {
    const result = await repo.findById('nonexistent');
    expect(result).toBeNull();
  });

  it('deletes a session', async () => {
    const session = PomodoroSession.create({
      plannedDuration: 1500,
      type: 'focus',
      sessionNumber: 1,
    });
    await repo.save(session);
    await repo.delete(session.id);
    const found = await repo.findById(session.id);
    expect(found).toBeNull();
  });

  it('finds sessions by date', async () => {
    const session = PomodoroSession.create({
      plannedDuration: 1500,
      type: 'focus',
      sessionNumber: 1,
    });
    await repo.save(session);

    const today = new Date().toISOString().split('T')[0];
    const results = await repo.findByDate(today);
    expect(results.length).toBe(1);
  });

  it('counts completed sessions by date', async () => {
    const s1 = PomodoroSession.create({ plannedDuration: 1500, type: 'focus', sessionNumber: 1 });
    const s2 = PomodoroSession.create({ plannedDuration: 1500, type: 'focus', sessionNumber: 2 });
    await repo.save(s1.complete());
    await repo.save(s2.complete());

    const today = new Date().toISOString().split('T')[0];
    const count = await repo.countCompletedByDate(today);
    expect(count).toBe(2);
  });
});
