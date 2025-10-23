# Research: Scoring and Challenge System

**Phase**: 0 - Research & Technology Decisions  
**Date**: 2025-10-23

## Research Tasks Completed

### Tailwind CSS Theme Integration

**Decision**: Use Tailwind CSS with custom theme configuration for consistent colors and spacing

**Rationale**:

- Provides utility-first approach aligned with Simple UX principle
- Built-in responsive design utilities support mobile-first approach
- Theme system allows consistent color scheme across components
- Smaller bundle size than full CSS frameworks
- Well-established in React ecosystem

**Alternatives considered**:

- Vanilla CSS: Rejected due to increased development time and maintenance overhead
- Styled Components: Rejected due to additional dependency and runtime overhead
- Material-UI: Rejected due to large bundle size violating minimal dependencies principle

### ShadCN UI Component Library

**Decision**: Integrate ShadCN UI for consistent, accessible components

**Rationale**:

- Copy-paste approach aligns with minimal dependencies principle (no runtime dependency)
- Provides accessible components out of the box
- Customizable with Tailwind CSS
- Specifically designed for React applications
- Reduces development time for complex UI elements

**Alternatives considered**:

- Building custom components: Rejected due to development time and accessibility concerns
- Headless UI: Considered but ShadCN provides more complete solutions
- Chakra UI: Rejected due to runtime dependency and larger bundle size

### Local Storage Strategy

**Decision**: Use browser localStorage with JSON serialization for game data persistence

**Rationale**:

- Native browser API, no external dependencies
- Sufficient for single-player game data
- Offline capability aligns with performance requirements
- Simple implementation and maintenance

**Data structures planned**:

```javascript
// Game scores and statistics
{
  "gameHistory": [
    {
      "id": "uuid",
      "difficulty": "easy|medium|hard",
      "score": 1250,
      "time": 45,
      "mistakes": 3,
      "stars": 3,
      "completedAt": "2025-10-23T10:30:00Z"
    }
  ],
  "bestScores": {
    "easy": { "score": 1500, "time": 30, "stars": 3 },
    "medium": { "score": 1800, "time": 60, "stars": 3 },
    "hard": { "score": 2200, "time": 120, "stars": 3 }
  },
  "preferences": {
    "defaultDifficulty": "medium",
    "soundEnabled": true
  }
}
```

**Alternatives considered**:

- IndexedDB: Rejected as overkill for simple game data
- SessionStorage: Rejected due to data loss on browser close
- External database: Rejected as violating offline capability requirement

### Date-fns Integration

**Decision**: Use date-fns for timer formatting and duration calculations

**Rationale**:

- Lightweight library focused on specific functionality
- Immutable date operations
- Tree-shakeable for minimal bundle impact
- Excellent TypeScript support
- Widely adopted with stable API

**Specific functions needed**:

- `format()` for timer display (MM:SS)
- `differenceInSeconds()` for time calculations
- `addSeconds()` for bonus calculations

**Alternatives considered**:

- Moment.js: Rejected due to large bundle size
- Day.js: Considered but date-fns has better tree-shaking
- Native Date: Rejected due to complexity of formatting and calculations

### Timer Implementation Strategy

**Decision**: Use React hooks with setInterval for real-time timer updates

**Rationale**:

- Provides 1-second precision as required
- Integrates well with React component lifecycle
- Allows for pause/resume functionality
- Memory efficient with proper cleanup

**Implementation approach**:

```javascript
const useGameTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return { seconds, isRunning, start: () => setIsRunning(true), stop: () => setIsRunning(false) };
};
```

**Alternatives considered**:

- requestAnimationFrame: Rejected as overkill for 1-second precision
- Web Workers: Rejected as unnecessary complexity for this use case
- External timer libraries: Rejected to maintain minimal dependencies

### Score Calculation Implementation

**Decision**: Implement scoring formula: Base points (1000) + time bonus - mistake penalties

**From clarifications**:

- Base score: 1000 points
- Time bonus: Calculated based on speed
- Mistake penalty: Deducted for incorrect flips
- Difficulty multipliers: Easy 1x, Medium 1.5x, Hard 2x
- Star thresholds: 90%+ = 3 stars, 70-89% = 2 stars, <70% = 1 star

**Implementation approach**:

```javascript
const calculateScore = (timeInSeconds, mistakes, difficulty, maxTimeForBonus = 60) => {
  const baseScore = 1000;
  const timeBonus = Math.max(0, (maxTimeForBonus - timeInSeconds) * 10);
  const mistakePenalty = mistakes * 50;
  const rawScore = baseScore + timeBonus - mistakePenalty;

  const multipliers = { easy: 1, medium: 1.5, hard: 2 };
  const finalScore = Math.max(0, rawScore * multipliers[difficulty]);

  return {
    baseScore,
    timeBonus,
    mistakePenalty,
    finalScore,
    stars: calculateStars(finalScore, getMaxPossibleScore(difficulty)),
  };
};
```

## Technology Integration Plan

### Dependencies to Add

```json
{
  "tailwindcss": "^3.3.0",
  "@tailwindcss/forms": "^0.5.6",
  "date-fns": "^2.30.0",
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^1.14.0"
}
```

### Configuration Files Needed

- `tailwind.config.js` - Tailwind configuration with custom theme
- `components.json` - ShadCN UI configuration
- `src/lib/utils.js` - Utility functions for class merging

### Development Workflow

1. Set up Tailwind CSS and theme configuration
2. Install and configure ShadCN UI components
3. Implement core services (timer, scoring, storage)
4. Build React components using hooks pattern
5. Integrate components with existing game logic
6. Manual testing across all device sizes

## Risk Mitigation

**Bundle Size Risk**: Monitor bundle size during development, use webpack-bundle-analyzer if needed
**Performance Risk**: Implement timer throttling if performance issues arise
**Browser Compatibility**: Test localStorage across target browsers
**Responsive Design**: Test on actual devices, not just browser dev tools

All research tasks completed successfully. Ready to proceed to Phase 1: Design & Contracts.
