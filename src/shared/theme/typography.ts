import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  displayLarge: {
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 80,
  },
  displayMedium: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 56,
  },
  headingLarge: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  headingMedium: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  headingSmall: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  mono: {
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
});
