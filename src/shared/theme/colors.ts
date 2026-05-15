export const Colors = {
  focus: {
    primary: '#ef4444',
    light: '#fca5a5',
    dark: '#b91c1c',
    muted: '#fef2f2',
  },
  shortBreak: {
    primary: '#22c55e',
    light: '#86efac',
    dark: '#15803d',
    muted: '#f0fdf4',
  },
  longBreak: {
    primary: '#3b82f6',
    light: '#93c5fd',
    dark: '#1d4ed8',
    muted: '#eff6ff',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    elevated: '#334155',
    border: '#475569',
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
    },
  },
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    elevated: '#f1f5f9',
    border: '#e2e8f0',
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
    },
  },
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export type ColorScheme = 'dark' | 'light';
