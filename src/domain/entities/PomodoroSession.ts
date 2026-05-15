import { v4 as uuidv4 } from 'uuid';

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned' | 'paused';
export type SessionType = 'focus' | 'short_break' | 'long_break';

export interface PomodoroSessionProps {
  readonly id: string;
  readonly startTime: Date;
  readonly endTime: Date | null;
  readonly plannedDuration: number; // seconds
  readonly actualDuration: number; // seconds
  readonly status: SessionStatus;
  readonly type: SessionType;
  readonly notes: string;
  readonly sessionNumber: number; // which pomodoro in the day (1-based)
}

export class PomodoroSession {
  readonly id: string;
  readonly startTime: Date;
  readonly endTime: Date | null;
  readonly plannedDuration: number;
  readonly actualDuration: number;
  readonly status: SessionStatus;
  readonly type: SessionType;
  readonly notes: string;
  readonly sessionNumber: number;

  private constructor(props: PomodoroSessionProps) {
    this.id = props.id;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.plannedDuration = props.plannedDuration;
    this.actualDuration = props.actualDuration;
    this.status = props.status;
    this.type = props.type;
    this.notes = props.notes;
    this.sessionNumber = props.sessionNumber;
  }

  static create(params: {
    plannedDuration: number;
    type: SessionType;
    sessionNumber: number;
    notes?: string;
  }): PomodoroSession {
    if (params.plannedDuration <= 0) {
      throw new Error('Planned duration must be positive');
    }
    if (params.sessionNumber < 1) {
      throw new Error('Session number must be 1 or greater');
    }
    return new PomodoroSession({
      id: uuidv4(),
      startTime: new Date(),
      endTime: null,
      plannedDuration: params.plannedDuration,
      actualDuration: 0,
      status: 'in_progress',
      type: params.type,
      sessionNumber: params.sessionNumber,
      notes: params.notes ?? '',
    });
  }

  static reconstitute(props: PomodoroSessionProps): PomodoroSession {
    return new PomodoroSession(props);
  }

  complete(): PomodoroSession {
    const now = new Date();
    const duration = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
    return PomodoroSession.reconstitute({
      ...this.toProps(),
      endTime: now,
      actualDuration: duration,
      status: 'completed',
    });
  }

  abandon(): PomodoroSession {
    const now = new Date();
    const duration = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
    return PomodoroSession.reconstitute({
      ...this.toProps(),
      endTime: now,
      actualDuration: duration,
      status: 'abandoned',
    });
  }

  pause(): PomodoroSession {
    return PomodoroSession.reconstitute({
      ...this.toProps(),
      status: 'paused',
    });
  }

  resume(): PomodoroSession {
    return PomodoroSession.reconstitute({
      ...this.toProps(),
      status: 'in_progress',
    });
  }

  updateActualDuration(seconds: number): PomodoroSession {
    return PomodoroSession.reconstitute({
      ...this.toProps(),
      actualDuration: seconds,
    });
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isFocusSession(): boolean {
    return this.type === 'focus';
  }

  get completionRate(): number {
    if (this.plannedDuration === 0) return 0;
    return Math.min(1, this.actualDuration / this.plannedDuration);
  }

  private toProps(): PomodoroSessionProps {
    return {
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      plannedDuration: this.plannedDuration,
      actualDuration: this.actualDuration,
      status: this.status,
      type: this.type,
      notes: this.notes,
      sessionNumber: this.sessionNumber,
    };
  }
}
