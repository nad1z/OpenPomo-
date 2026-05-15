export type TimerPhase = 'idle' | 'running' | 'paused' | 'completed';

export type SessionTypeUI = 'focus' | 'short_break' | 'long_break';

export interface TimerState {
  phase: TimerPhase;
  sessionType: SessionTypeUI;
  remainingSeconds: number;
  totalSeconds: number;
  progress: number; // 0-1
}

export interface AppError {
  code: string;
  message: string;
  recoverable: boolean;
}
