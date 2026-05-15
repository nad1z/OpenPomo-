import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSettingsStore } from '../state/settingsStore';
import { Colors, ColorScheme } from '../../shared/theme/colors';

export function useAppColorScheme(): ColorScheme {
  const systemScheme = useRNColorScheme();
  const settings = useSettingsStore((s) => s.settings);

  if (!settings || settings.theme === 'system') {
    return (systemScheme as ColorScheme) ?? 'dark';
  }
  return settings.theme === 'light' ? 'light' : 'dark';
}

export function useThemeColors() {
  const scheme = useAppColorScheme();
  return {
    scheme,
    colors: scheme === 'dark' ? Colors.dark : Colors.light,
    isDark: scheme === 'dark',
  };
}
