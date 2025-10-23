# Service Contracts: Scoring and Challenge System

**Phase**: 1 - Design & Contracts  
**Date**: 2025-10-23

This document defines the internal service contracts for the scoring and challenge system. Since this is a client-side only application, these are JavaScript service interfaces rather than REST API endpoints.

## GameService Contract

Manages game session lifecycle and state.

### Interface Definition

```typescript
interface GameService {
  // Game session management
  startNewGame(difficulty: Difficulty): GameSession;
  pauseGame(sessionId: string): void;
  resumeGame(sessionId: string): void;
  endGame(sessionId: string): GameSession;
  abandonGame(sessionId: string): void;

  // Game state updates
  recordCardFlip(sessionId: string, isCorrect: boolean): void;
  recordPairMatch(sessionId: string): void;
  checkGameCompletion(sessionId: string): boolean;

  // Game queries
  getCurrentGame(): GameSession | null;
  getGameProgress(sessionId: string): {
    pairsMatched: number;
    totalPairs: number;
    percentComplete: number;
  };
}
```

### Method Specifications

#### `startNewGame(difficulty: Difficulty): GameSession`

**Purpose**: Initialize a new game session with specified difficulty

**Input**:

- `difficulty`: "easy" | "medium" | "hard"

**Output**:

- New GameSession object with initial state

**Behavior**:

- Creates unique session ID
- Sets start time
- Initializes timer
- Saves session to localStorage
- Returns session object

**Validation**:

- Difficulty must be valid enum value
- Only one active game session allowed at a time

#### `recordCardFlip(sessionId: string, isCorrect: boolean): void`

**Purpose**: Track card flip attempts for scoring calculation

**Input**:

- `sessionId`: UUID of active game session
- `isCorrect`: Whether the flip resulted in a match

**Behavior**:

- Increments turn counter
- If incorrect, increments mistake counter
- Updates session in localStorage
- Triggers timer update

**Validation**:

- Session must exist and be active
- Cannot record flips after game completion

#### `endGame(sessionId: string): GameSession`

**Purpose**: Complete a game session and calculate final score

**Input**:

- `sessionId`: UUID of game session to complete

**Output**:

- Completed GameSession with final score and stats

**Behavior**:

- Stops timer and records end time
- Calculates final score using ScoreService
- Determines star rating
- Marks session as completed
- Saves to game history
- Updates performance metrics

**Validation**:

- Session must exist and be active
- All pairs must be matched for completion

## ScoreService Contract

Handles all scoring calculations and star rating determinations.

### Interface Definition

```typescript
interface ScoreService {
  // Score calculations
  calculateScore(timeInSeconds: number, mistakes: number, difficulty: Difficulty): ScoreCalculation;

  calculateStars(score: number, maxPossibleScore: number): 1 | 2 | 3;
  getMaxPossibleScore(difficulty: Difficulty): number;

  // Score analysis
  getScoreBreakdown(calculation: ScoreCalculation): ScoreBreakdown;
  compareToPersonalBest(
    score: number,
    difficulty: Difficulty
  ): {
    isNewBest: boolean;
    improvement: number;
    previousBest: number;
  };
}

interface ScoreCalculation {
  baseScore: number;
  timeBonus: number;
  mistakePenalty: number;
  difficultyMultiplier: number;
  rawScore: number;
  finalScore: number;
  percentageOfMax: number;
}

interface ScoreBreakdown {
  components: {
    base: { points: number; description: string };
    timeBonus: { points: number; description: string };
    mistakes: { points: number; description: string };
    difficulty: { multiplier: number; description: string };
  };
  finalScore: number;
  starRating: 1 | 2 | 3;
}
```

### Method Specifications

#### `calculateScore(timeInSeconds, mistakes, difficulty): ScoreCalculation`

**Purpose**: Calculate final score using the established formula

**Formula Implementation**:

```javascript
const baseScore = 1000;
const maxTimeForBonus = 60; // seconds
const mistakePenalty = 50; // points per mistake
const timeBonus = Math.max(0, (maxTimeForBonus - timeInSeconds) * 10);
const rawScore = baseScore + timeBonus - mistakes * mistakePenalty;

const multipliers = { easy: 1, medium: 1.5, hard: 2 };
const finalScore = Math.max(0, rawScore * multipliers[difficulty]);

return {
  baseScore,
  timeBonus,
  mistakePenalty: mistakes * mistakePenalty,
  difficultyMultiplier: multipliers[difficulty],
  rawScore,
  finalScore,
  percentageOfMax: (finalScore / getMaxPossibleScore(difficulty)) * 100,
};
```

**Validation**:

- Time must be > 0
- Mistakes must be >= 0
- Difficulty must be valid
- Score cannot be negative

#### `calculateStars(score, maxPossibleScore): 1 | 2 | 3`

**Purpose**: Determine star rating based on performance percentage

**Logic**:

```javascript
const percentage = (score / maxPossibleScore) * 100;

if (percentage >= 90) return 3;
if (percentage >= 70) return 2;
return 1;
```

## TimerService Contract

Manages game timing functionality.

### Interface Definition

```typescript
interface TimerService {
  // Timer control
  startTimer(sessionId: string): void;
  pauseTimer(sessionId: string): void;
  resumeTimer(sessionId: string): void;
  stopTimer(sessionId: string): number; // returns elapsed seconds

  // Timer queries
  getElapsedTime(sessionId: string): number;
  getFormattedTime(sessionId: string): string; // MM:SS format
  isTimerRunning(sessionId: string): boolean;
  getRemainingTime(sessionId: string): number; // until max limit

  // Timer events
  onTimerUpdate(sessionId: string, callback: (elapsed: number) => void): () => void;
  onTimerLimit(sessionId: string, callback: () => void): () => void;
}
```

### Method Specifications

#### `getFormattedTime(sessionId): string`

**Purpose**: Format elapsed time for display

**Implementation**:

```javascript
import { format, addSeconds } from "date-fns";

const formatTime = (seconds) => {
  const date = addSeconds(new Date(0), seconds);
  return format(date, "mm:ss");
};
```

**Output Examples**:

- 0 seconds → "00:00"
- 65 seconds → "01:05"
- 3661 seconds → "61:01"

#### `onTimerUpdate(sessionId, callback): () => void`

**Purpose**: Register callback for real-time timer updates

**Behavior**:

- Callback invoked every 1000ms while timer is running
- Returns unsubscribe function
- Automatically cleans up on timer stop

## StorageService Contract

Handles all localStorage operations for game data persistence.

### Interface Definition

```typescript
interface StorageService {
  // Game sessions
  saveGameSession(session: GameSession): void;
  loadGameSession(sessionId: string): GameSession | null;
  loadGameHistory(): GameSession[];
  clearGameHistory(): void;

  // Performance metrics
  updatePerformanceMetrics(session: GameSession): void;
  loadPerformanceMetrics(): PerformanceMetrics;

  // User preferences
  savePreferences(preferences: UserPreferences): void;
  loadPreferences(): UserPreferences;

  // Data management
  exportData(): string; // JSON export
  importData(jsonData: string): boolean; // returns success
  validateStorageData(): { isValid: boolean; errors: string[] };
}
```

### Storage Keys

```javascript
const STORAGE_KEYS = {
  GAME_HISTORY: "magic-memory-history",
  CURRENT_GAME: "magic-memory-current",
  PERFORMANCE_STATS: "magic-memory-stats",
  USER_PREFERENCES: "magic-memory-preferences",
};
```

### Data Validation

All stored data must be validated on load:

```javascript
const validateGameSession = (data) => {
  return (
    typeof data.id === "string" &&
    ["easy", "medium", "hard"].includes(data.difficulty) &&
    typeof data.score === "number" &&
    data.score >= 0 &&
    typeof data.mistakes === "number" &&
    data.mistakes >= 0 &&
    [1, 2, 3].includes(data.stars)
  );
};
```

## Error Handling Contracts

### Common Error Types

```typescript
class GameError extends Error {
  constructor(message: string, code: string) {
    super(message);
    this.name = "GameError";
    this.code = code;
  }
}

// Error codes
const ERROR_CODES = {
  INVALID_SESSION: "INVALID_SESSION",
  GAME_ALREADY_ACTIVE: "GAME_ALREADY_ACTIVE",
  STORAGE_FAILURE: "STORAGE_FAILURE",
  INVALID_DIFFICULTY: "INVALID_DIFFICULTY",
  TIMER_NOT_RUNNING: "TIMER_NOT_RUNNING",
};
```

### Error Handling Strategy

- All service methods that can fail should throw GameError
- Storage failures should be caught and handled gracefully
- Invalid data should trigger fallback to defaults
- User should be notified of non-recoverable errors

## Integration Points

### React Hook Integration

Services will be consumed through custom React hooks:

```typescript
// useGameSession hook
const useGameSession = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  const startGame = (difficulty) => {
    const session = GameService.startNewGame(difficulty);
    setCurrentGame(session);
  };

  return { currentGame, gameHistory, startGame /* ... */ };
};

// useGameTimer hook
const useGameTimer = (sessionId) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");

  // Timer subscription and cleanup logic

  return { elapsedTime, formattedTime /* ... */ };
};
```

All service contracts defined and ready for implementation. These contracts ensure clean separation of concerns and testable code architecture.
