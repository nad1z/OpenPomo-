# OpenPomo — CLAUDE.md

## Project Overview

**OpenPomo** is a production-grade cross-platform Pomodoro productivity app built with React Native (Expo + TypeScript). It targets iOS and Android, designed with strict Clean Architecture principles to ensure long-term maintainability, testability, and extensibility.

---

## Architecture Philosophy

### Clean Architecture — Non-Negotiable Rules

The codebase is organized into four strict layers. **Dependencies flow in ONE direction only:**

```
Presentation → Application → Domain
Infrastructure → Domain
Domain → NOTHING
```

- **Domain** is the innermost layer — pure TypeScript, zero framework dependencies
- **Application** orchestrates domain use cases — no UI, no storage
- **Infrastructure** implements domain interfaces — no UI, no React
- **Presentation** is React Native UI — calls application layer only

### Circular Dependency Prevention

- ESLint `import/no-cycle` rule is **enforced** at CI level
- `eslint-plugin-boundaries` enforces layer import rules
- Barrel files (`index.ts`) are scoped per layer — never cross-layer re-exports
- Any PR that introduces a circular import will **fail CI**

---

## Project Structure

```
/src
  /domain                    # Pure business logic — NO external deps
    /entities                # Core business objects (immutable)
    /valueObjects            # Validated primitives
    /useCases                # Business operations
    /repositories            # Abstract interfaces (contracts)
    /services                # Domain services (pure logic)

  /application               # Use case orchestration
    /services                # App-level services
    /state                   # State coordination (not UI)
    /dto                     # Data Transfer Objects

  /infrastructure            # External world implementations
    /storage                 # AsyncStorage / SQLite adapters
    /notifications           # Local notification implementations
    /analytics               # Analytics persistence
    /repositoriesImpl        # Concrete repository implementations

  /presentation              # React Native UI only
    /navigation              # Expo Router layouts
    /screens                 # Full screen components
    /components              # Reusable UI components
    /hooks                   # Custom React hooks
    /state                   # Zustand stores (UI state only)

  /features                  # Feature modules (vertical slices)
    /timer                   # Pomodoro timer feature
    /analytics               # Analytics dashboard feature
    /history                 # Session history feature
    /settings                # User settings feature
    /gamification            # Streaks, achievements, badges

  /shared                    # Cross-cutting concerns
    /utils                   # Pure utility functions
    /theme                   # Design tokens, colors, typography
    /constants               # App-wide constants
    /types                   # Shared TypeScript types
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# TypeScript type check
npm run typecheck

# ESLint (includes architecture boundary checks)
npm run lint

# ESLint auto-fix
npm run lint:fix

# Validate no circular dependencies
npm run check:circular

# Full pre-commit validation
npm run validate
```

---

## Core Domain Entities

### PomodoroSession
```typescript
// Immutable entity representing a single focus session
// Fields: id, startTime, endTime, duration, status, type, notes
// Status: 'in_progress' | 'completed' | 'abandoned' | 'paused'
// Type: 'focus' | 'short_break' | 'long_break'
```

### UserSettings
```typescript
// Immutable value object for user preferences
// Fields: focusDuration, shortBreakDuration, longBreakDuration,
//         sessionsBeforeLongBreak, autoStartBreaks, autoStartFocus,
//         notificationsEnabled, theme, dailyGoal, soundEnabled
```

### DailyStats / WeeklyStats
```typescript
// Computed aggregates — never stored directly, computed from sessions
// Aggregation happens in domain services (pure functions)
```

### Achievement
```typescript
// Gamification entity — earned through milestone tracking
// Fields: id, title, description, earnedAt, type, threshold
```

---

## State Management Rules

| Concern | Location |
|---|---|
| UI loading/error state | Zustand store (`/presentation/state`) |
| Active timer state | Zustand store (syncs with domain) |
| Domain logic | Use cases (`/domain/useCases`) |
| Persistence | Infrastructure repositories |
| Business rules | Domain services |
| Aggregation/computation | Domain services (pure functions) |

**Never put business logic in:**
- React components
- Zustand stores
- Navigation handlers

---

## Key Architectural Decisions

### ADR-001: No Redux — Zustand for UI State
**Decision:** Use Zustand instead of Redux Toolkit.  
**Rationale:** Lower boilerplate, better TypeScript inference, sufficient for UI state needs.  
**Trade-off:** Less devtools support, but domain layer is independently testable.

### ADR-002: Repository Pattern for All Data Access
**Decision:** All data access goes through repository interfaces defined in domain.  
**Rationale:** Enables swapping AsyncStorage → SQLite → Firebase without touching business logic.  
**Trade-off:** More initial boilerplate, but infinite flexibility.

### ADR-003: Expo Router for Navigation
**Decision:** File-based routing with Expo Router.  
**Rationale:** First-class TypeScript, deep link support, web-ready for future.  
**Trade-off:** Less flexible than React Navigation for complex flows.

### ADR-004: Immutable Domain Entities
**Decision:** All domain entities use `readonly` fields and factory functions.  
**Rationale:** Prevents accidental mutation, makes state changes explicit.  
**Trade-off:** Slightly more verbose creation patterns.

### ADR-005: AsyncStorage First, SQLite Ready
**Decision:** Ship with AsyncStorage, infrastructure abstractions support SQLite swap.  
**Rationale:** AsyncStorage sufficient for MVP, SQLite needed at scale (>1000 sessions).  
**Trade-off:** Will require migration script when switching.

### ADR-006: NativeWind for Styling
**Decision:** Tailwind CSS via NativeWind.  
**Rationale:** Consistent design tokens, dark mode built-in, fast iteration.  
**Trade-off:** Requires PostCSS tooling, slight learning curve for RN-specific classes.

---

## Testing Strategy

```
Domain Layer:     Unit tests only — no mocks needed (pure functions)
Application:      Unit tests with mocked repositories
Infrastructure:   Integration tests with in-memory adapters
Presentation:     Component tests with React Native Testing Library
E2E:              Detox tests for critical flows (timer, history)
```

**Coverage targets:**
- Domain: 95%+
- Application: 85%+
- Infrastructure: 70%+
- Presentation: 60%+

---

## Environment Configuration

```
APP_ENV=development|staging|production
EXPO_PUBLIC_APP_VERSION=1.0.0
```

No secrets in the codebase. All sensitive config via Expo's `app.config.js` + EAS secrets.

---

## ESLint Architecture Boundaries

The `eslint-plugin-boundaries` configuration enforces:

```
domain     → []                    (no imports from any layer)
application → [domain]             (only imports from domain)
infrastructure → [domain]          (only imports from domain)
presentation → [application, shared] (no direct domain/infra access)
features   → [presentation, application, domain]
shared     → []                    (no layer imports)
```

Any violation = lint error = CI failure.

---

## Adding New Features

1. **Define the domain model** in `/src/domain/entities`
2. **Create the use case** in `/src/domain/useCases`
3. **Define the repository interface** in `/src/domain/repositories`
4. **Implement the repository** in `/src/infrastructure/repositoriesImpl`
5. **Create app service** in `/src/application/services` if orchestration needed
6. **Build the UI** in `/src/features/<feature-name>/`
7. **Write tests** starting from domain outward

---

## Future Extension Points

The architecture is explicitly prepared for:

| Feature | Extension Point |
|---|---|
| Cloud sync (Firebase/Supabase) | Swap repository implementations in infrastructure |
| User authentication | New domain entity `User`, new auth repository interface |
| Multi-device sync | Conflict resolution service in domain |
| AI insights | New application service wrapping external AI calls |
| Apple Watch | New presentation target using same domain/application layers |
| Widgets | `WidgetKit` integration via shared domain entities |
| Desktop | Expo for Web uses same domain layer unchanged |

---

## CI/CD Pipeline

GitHub Actions runs on every push:
1. `npm run typecheck` — TypeScript strict mode
2. `npm run lint` — ESLint including boundary rules
3. `npm run check:circular` — Madge circular dependency check
4. `npm test -- --coverage` — Jest tests with coverage thresholds
5. `npx expo export` — Ensure export succeeds

---

## Deployment

### iOS (TestFlight)
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Android (Google Play)
```bash
eas build --platform android --profile production
eas submit --platform android
```

EAS configuration in `eas.json`. Requires Expo account and Apple/Google credentials.

---

## Known Limitations (v1.0)

- Background timer on Android requires `expo-task-manager` (implemented)
- iOS background timer limited to 30s without `expo-background-fetch` workaround
- AsyncStorage has ~6MB limit; SQLite migration required at high session volumes
- Charts library (Victory Native) has known perf issues >500 data points; virtualization needed

---

## Contributing

1. Branch from `main`: `feature/<name>`, `fix/<name>`, `chore/<name>`
2. All commits must pass `npm run validate`
3. PRs require: passing CI + architecture boundary compliance
4. Domain layer changes require 2 reviewers
