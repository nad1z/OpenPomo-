import { PomodoroSession } from '../../domain/entities/PomodoroSession';
import { SessionStatus, SessionType } from '../../domain/entities/PomodoroSession';

export interface SessionDTO {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  type: SessionType;
  status: SessionStatus;
  plannedMinutes: number;
  actualMinutes: number;
  completionRate: number;
  notes: string;
  sessionNumber: number;
}

export function toSessionDTO(session: PomodoroSession): SessionDTO {
  return {
    id: session.id,
    date: session.startTime.toISOString().split('T')[0],
    startTime: session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: session.endTime
      ? session.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null,
    type: session.type,
    status: session.status,
    plannedMinutes: Math.floor(session.plannedDuration / 60),
    actualMinutes: Math.floor(session.actualDuration / 60),
    completionRate: session.completionRate,
    notes: session.notes,
    sessionNumber: session.sessionNumber,
  };
}
