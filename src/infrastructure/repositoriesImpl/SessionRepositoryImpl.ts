import { PomodoroSession, PomodoroSessionProps } from '../../domain/entities/PomodoroSession';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { AsyncStorageClient } from '../storage/AsyncStorageClient';

const SESSION_KEY_PREFIX = 'session:';

interface StoredSession extends Omit<PomodoroSessionProps, 'startTime' | 'endTime'> {
  startTime: string;
  endTime: string | null;
}

export class SessionRepositoryImpl implements ISessionRepository {
  constructor(private readonly storage: AsyncStorageClient) {}

  async save(session: PomodoroSession): Promise<void> {
    const key = `${SESSION_KEY_PREFIX}${session.id}`;
    const stored: StoredSession = {
      id: session.id,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime?.toISOString() ?? null,
      plannedDuration: session.plannedDuration,
      actualDuration: session.actualDuration,
      status: session.status,
      type: session.type,
      notes: session.notes,
      sessionNumber: session.sessionNumber,
    };
    await this.storage.set(key, stored);
  }

  async findById(id: string): Promise<PomodoroSession | null> {
    const stored = await this.storage.get<StoredSession>(`${SESSION_KEY_PREFIX}${id}`);
    if (!stored) return null;
    return this.deserialize(stored);
  }

  async findByDate(date: string): Promise<PomodoroSession[]> {
    const all = await this.findAll();
    return all.filter((s) => s.startTime.toISOString().split('T')[0] === date);
  }

  async findByDateRange(startDate: string, endDate: string): Promise<PomodoroSession[]> {
    const all = await this.findAll();
    return all.filter((s) => {
      const date = s.startTime.toISOString().split('T')[0];
      return date >= startDate && date <= endDate;
    });
  }

  async findAll(): Promise<PomodoroSession[]> {
    const keys = await this.storage.getAllKeys(SESSION_KEY_PREFIX);
    const stored = await this.storage.multiGet<StoredSession>(keys);
    return stored
      .map((s) => this.deserialize(s))
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async delete(id: string): Promise<void> {
    await this.storage.remove(`${SESSION_KEY_PREFIX}${id}`);
  }

  async deleteAll(): Promise<void> {
    const keys = await this.storage.getAllKeys(SESSION_KEY_PREFIX);
    await this.storage.multiRemove(keys);
  }

  async countCompletedByDate(date: string): Promise<number> {
    const sessions = await this.findByDate(date);
    return sessions.filter((s) => s.type === 'focus' && s.status === 'completed').length;
  }

  private deserialize(stored: StoredSession): PomodoroSession {
    return PomodoroSession.reconstitute({
      id: stored.id,
      startTime: new Date(stored.startTime),
      endTime: stored.endTime ? new Date(stored.endTime) : null,
      plannedDuration: stored.plannedDuration,
      actualDuration: stored.actualDuration,
      status: stored.status,
      type: stored.type,
      notes: stored.notes,
      sessionNumber: stored.sessionNumber,
    });
  }
}
