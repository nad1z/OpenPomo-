# OpenPomo 🍅

A production-grade, cross-platform Pomodoro productivity app built with **React Native (Expo + TypeScript)**, following strict **Clean Architecture** principles.

[![CI](https://github.com/nad1z/openpomo-/actions/workflows/ci.yml/badge.svg)](https://github.com/nad1z/openpomo-/actions)
![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Architecture](https://img.shields.io/badge/architecture-Clean%20Architecture-green)

---

## Features

| Feature | Description |
|---|---|
| ⏱ Pomodoro Timer | 25min focus + customizable durations, animated progress ring |
| ☕ Break System | Auto short (5min) / long (15min) breaks after 4 sessions |
| 📊 Analytics Dashboard | Daily, weekly, monthly charts + heatmaps |
| 📋 Session History | Timeline with filter, delete, CSV export |
| ⚙️ Settings | All durations, auto-start, notifications, theme, daily goal |
| 🏆 Gamification | Streaks, achievements, badges, milestones |
| 🌙 Dark/Light Mode | System-aware theming, first-class dark mode |
| 📱 Background Timer | Continues counting when app is backgrounded |
| 🔔 Notifications | Local notifications when sessions complete |

---

## Architecture

OpenPomo uses **Clean Architecture** with strict one-directional dependency flow:

```
Presentation → Application → Domain
Infrastructure → Domain
Domain → NOTHING (pure TypeScript)
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Domain** | `src/domain/` | Entities, use cases, repository interfaces — pure TypeScript |
| **Application** | `src/application/` | Orchestrates use cases, DTOs, app services |
| **Infrastructure** | `src/infrastructure/` | AsyncStorage, notifications, CSV export |
| **Presentation** | `src/presentation/` | React Native UI, Zustand stores, hooks |
| **Features** | `src/features/` | Vertical screen slices |
| **Shared** | `src/shared/` | Theme, utils, constants |

### Key Architectural Decisions

- **Repository Pattern**: All data access through interfaces defined in domain → swap AsyncStorage for SQLite or Firebase without touching business logic
- **Immutable Entities**: All domain entities use `readonly` fields + factory methods — no accidental mutation
- **Zustand for UI only**: State stores hold UI state; all business logic lives in use cases
- **ESLint Boundaries**: `eslint-plugin-boundaries` enforces import rules at CI level
- **Circular Import Guard**: `madge --circular` runs on every push

---

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 15+ (Mac only)
- Android: Android Studio + emulator

### Install & Run

```bash
# Clone
git clone https://github.com/nad1z/openpomo-.git
cd openpomo-

# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on iOS simulator (Mac only)
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Development Scripts

```bash
npm run typecheck        # TypeScript strict mode check
npm run lint             # ESLint including architecture boundaries
npm run check:circular   # Madge circular dependency scan
npm test                 # Jest test suite
npm run test:coverage    # Tests with coverage report
npm run validate         # Full pre-commit check (typecheck + lint + circular + test)
```

---

## Building for Production

### Prerequisites
```bash
npm install -g eas-cli
eas login
```

### iOS Build (TestFlight)

```bash
# Build
eas build --platform ios --profile production

# Submit to App Store Connect → TestFlight
eas submit --platform ios

# Or combine:
eas build --platform ios --profile production --auto-submit
```

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect app created
- Certificates managed by EAS (recommended) or manually uploaded

### Android Build (Google Play)

```bash
# Build AAB (recommended for Play Store)
eas build --platform android --profile production

# Submit to Google Play internal track
eas submit --platform android

# Or combine:
eas build --platform android --profile production --auto-submit
```

**Requirements:**
- Google Play Developer account ($25 one-time)
- App created in Play Console
- Service account JSON for EAS Submit (see Expo docs)

### OTA Updates (no store review)

```bash
# Push a JS-only update instantly
eas update --branch production --message "Fix timer bug"
```

---

## Project Structure

```
OpenPomo/
├── app/                          # Expo Router file-based navigation
│   ├── _layout.tsx               # Root layout (providers, notifications)
│   ├── index.tsx                 # Redirect to tabs
│   └── (tabs)/                   # Tab navigator
│       ├── index.tsx             # Timer tab
│       ├── analytics.tsx         # Analytics tab
│       ├── history.tsx           # History tab
│       ├── achievements.tsx      # Gamification tab
│       └── settings.tsx          # Settings tab
│
├── src/
│   ├── domain/                   # Pure business logic (NO framework deps)
│   │   ├── entities/             # PomodoroSession, UserSettings, Achievement, DailyStats
│   │   ├── valueObjects/         # Duration, Streak
│   │   ├── useCases/             # StartSession, CompleteSession, AbandonSession, etc.
│   │   ├── repositories/         # Abstract interfaces (contracts)
│   │   └── services/             # AnalyticsService, AchievementService, StreakService
│   │
│   ├── application/              # Use case orchestration
│   │   ├── services/             # TimerApplicationService, AnalyticsApplicationService
│   │   └── dto/                  # SessionDTO
│   │
│   ├── infrastructure/           # External world
│   │   ├── storage/              # AsyncStorageClient
│   │   ├── repositoriesImpl/     # Session, Settings, Achievement, Streak repos
│   │   ├── notifications/        # NotificationService (expo-notifications)
│   │   ├── analytics/            # CsvExportService
│   │   └── container/            # ServiceContainer (DI)
│   │
│   ├── presentation/             # React Native UI
│   │   ├── components/           # ProgressRing, StatCard, TimerControls, etc.
│   │   ├── hooks/                # useTimer, useThemeColors
│   │   └── state/                # Zustand stores (timer, settings, analytics, history)
│   │
│   ├── features/                 # Feature screens
│   │   ├── timer/                # TimerScreen
│   │   ├── analytics/            # AnalyticsScreen
│   │   ├── history/              # HistoryScreen
│   │   ├── settings/             # SettingsScreen
│   │   └── gamification/         # GamificationScreen
│   │
│   └── shared/                   # Cross-cutting
│       ├── theme/                # Colors, Typography
│       ├── utils/                # dateUtils
│       ├── constants/            # STORAGE_KEYS, MOTIVATIONAL_MESSAGES
│       └── data/                 # seedData
│
└── src/__tests__/                # Test suite
    ├── domain/                   # Unit tests: entities, services
    └── infrastructure/           # Integration tests: repositories
```

---

## Testing

```bash
# Unit tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage Targets

| Layer | Target |
|---|---|
| Domain | 95% |
| Application | 85% |
| Infrastructure | 70% |
| Presentation | 60% |

### Test Strategy

- **Domain**: Pure unit tests — no mocks needed (pure functions + immutable entities)
- **Infrastructure**: Unit tests with in-memory `AsyncStorageClient` mock
- **Presentation**: React Native Testing Library component tests

---

## Architecture Decisions

### ADR-001: Zustand over Redux
Zustand has lower boilerplate, better TypeScript inference, and is sufficient for UI state. Domain logic is independently testable without any state management library.

### ADR-002: Repository Pattern
All data access goes through interfaces defined in the domain layer. The current AsyncStorage implementation can be swapped for SQLite, Firebase, or Supabase by creating a new implementation class — zero changes to business logic.

### ADR-003: Immutable Entities
All domain entities use `readonly` fields and `reconstitute()` factory methods. State changes are always explicit new instances. This eliminates entire categories of bugs.

### ADR-004: AsyncStorage → SQLite migration path
AsyncStorage is sufficient for <1,000 sessions. At scale, `SessionRepositoryImpl` can be swapped for a SQLite implementation. Both implement `ISessionRepository`.

### ADR-005: Feature-based + Layer-based hybrid
Files organized by feature (timer, analytics) at the top level, but within each feature, Clean Architecture layers are preserved. This makes features independently navigable while keeping architecture boundaries clear.

---

## Future Improvements

| Priority | Feature | Notes |
|---|---|---|
| High | SQLite migration | Replace AsyncStorage at scale |
| High | E2E tests (Detox) | Critical user flows |
| Medium | Cloud sync | Firebase adapter for `ISessionRepository` |
| Medium | Widget support | iOS WidgetKit / Android App Widget |
| Medium | Apple Watch | Same domain layer, WatchKit presentation |
| Low | AI insights | Productivity pattern analysis |
| Low | Multi-device sync | Conflict resolution service in domain |
| Low | Team features | Team entity + shared analytics |

---

## Contributing

1. Branch: `feature/<name>`, `fix/<name>`, `chore/<name>`
2. All commits must pass `npm run validate`
3. Architecture boundary violations fail CI automatically
4. Domain layer changes require 2 reviewers

---

## License

MIT © OpenPomo Contributors
