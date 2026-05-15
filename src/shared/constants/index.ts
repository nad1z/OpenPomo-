export const STORAGE_KEYS = {
  SESSIONS_PREFIX: 'session:',
  SETTINGS: 'user:settings',
  STREAK: 'user:streak',
  ACHIEVEMENTS: 'achievements:all',
} as const;

export const TIMER_DEFAULTS = {
  FOCUS_DURATION: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
  SESSIONS_BEFORE_LONG_BREAK: 4,
} as const;

export const MOTIVATIONAL_MESSAGES = [
  "Stay focused. The distraction is temporary, your goals are permanent.",
  "Every Pomodoro brings you closer to your goals.",
  "Small steps, big results. Keep going!",
  "Your future self will thank you for this session.",
  "Deep work is a superpower. You're building it.",
  "Flow state loading... 🧠",
  "Consistency beats intensity. Show up every day.",
  "One session at a time. That's all it takes.",
] as const;
