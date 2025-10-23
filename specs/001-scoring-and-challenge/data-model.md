# Data Model: Scoring and Challenge System

**Phase**: 1 - Design & Contracts  
**Date**: 2025-10-23

## Core Entities

### GameSession

Represents a single game instance from start to completion.

**Fields**:

- `id`: string (UUID) - Unique identifier for the game session
- `difficulty`: "easy" | "medium" | "hard" - Selected difficulty level
- `startTime`: Date - When the game was started
- `endTime`: Date | null - When the game was completed (null if in progress)
- `timeElapsed`: number - Total time in seconds
- `score`: number - Final calculated score
- `mistakes`: number - Count of incorrect card flips
- `stars`: 1 | 2 | 3 - Star rating based on performance
- `maxPossibleScore`: number - Theoretical maximum score for this difficulty
- `completed`: boolean - Whether the game was finished or abandoned
- `cardPairs`: number - Total number of pairs in this difficulty

**Relationships**:

- Belongs to ScoreHistory collection
- References Difficulty configuration

**Validation Rules**:

- `timeElapsed` must be > 0 if completed
- `mistakes` must be >= 0
- `stars` must be between 1-3
- `score` must be >= 0
- `difficulty` must be valid enum value

**State Transitions**:

1. **Created** → startTime set, completed = false
2. **In Progress** → mistakes increment, timeElapsed updates
3. **Completed** → endTime set, score calculated, completed = true
4. **Abandoned** → endTime set, completed = false, no score saved

### Score

Contains calculated scoring details for performance analysis.

**Fields**:

- `baseScore`: number - Starting points (1000)
- `timeBonus`: number - Bonus points for speed
- `mistakePenalty`: number - Points deducted for errors
- `difficultyMultiplier`: number - Multiplier based on difficulty (1x, 1.5x, 2x)
- `rawScore`: number - Score before difficulty multiplier
- `finalScore`: number - Final calculated score
- `percentageOfMax`: number - Performance as percentage of theoretical maximum

**Calculation Formula**:

```
rawScore = baseScore + timeBonus - mistakePenalty
finalScore = rawScore * difficultyMultiplier
percentageOfMax = (finalScore / maxPossibleScore) * 100
```

**Validation Rules**:

- All numeric fields must be >= 0
- `percentageOfMax` must be between 0-100
- `difficultyMultiplier` must be 1, 1.5, or 2

### Timer

Tracks elapsed game time with formatting utilities.

**Fields**:

- `startTime`: Date - When timer was started
- `currentTime`: Date - Current time for calculations
- `elapsedSeconds`: number - Total seconds elapsed
- `isRunning`: boolean - Whether timer is currently active
- `isPaused`: boolean - Whether timer is paused
- `maxDuration`: number - Maximum allowed time (600 seconds = 10 minutes)

**Methods**:

- `start()`: Begin timing
- `pause()`: Pause timing
- `resume()`: Resume from pause
- `stop()`: End timing and record final duration
- `getFormattedTime()`: Return MM:SS format string
- `getRemainingTime()`: Return seconds until max duration

**Validation Rules**:

- `elapsedSeconds` cannot exceed `maxDuration`
- Timer auto-stops at `maxDuration`
- `startTime` must be before `currentTime`

### Difficulty

Defines parameters for each challenge level.

**Configurations**:

```javascript
const DIFFICULTY_CONFIGS = {
  easy: {
    gridSize: { rows: 3, cols: 3 },
    totalCards: 12,
    totalPairs: 6,
    scoreMultiplier: 1,
    name: "Easy",
    description: "3×3 grid with 6 pairs",
  },
  medium: {
    gridSize: { rows: 4, cols: 4 },
    totalCards: 16,
    totalPairs: 8,
    scoreMultiplier: 1.5,
    name: "Medium",
    description: "4×4 grid with 8 pairs",
  },
  hard: {
    gridSize: { rows: 6, cols: 6 },
    totalCards: 36,
    totalPairs: 18,
    scoreMultiplier: 2,
    name: "Hard",
    description: "6×6 grid with 18 pairs",
  },
};
```

**Validation Rules**:

- Grid dimensions must result in even number of cards
- Total pairs must equal totalCards / 2
- Score multiplier must be positive number

### PerformanceMetrics

Aggregated statistics for player progress tracking.

**Fields**:

- `totalGamesPlayed`: number - Count of completed games
- `totalTimePlayed`: number - Sum of all game durations in seconds
- `averageScore`: number - Mean score across all games
- `bestScoreByDifficulty`: Record<Difficulty, number> - Highest scores per difficulty
- `fastestTimeByDifficulty`: Record<Difficulty, number> - Best completion times
- `totalStarsEarned`: number - Sum of all stars earned
- `perfectGames`: number - Count of games with 3 stars
- `improvementTrend`: number - Score change rate over recent games

**Calculation Methods**:

```javascript
calculateAverageScore(gameHistory) {
  const completedGames = gameHistory.filter(g => g.completed);
  return completedGames.reduce((sum, game) => sum + game.score, 0) / completedGames.length;
}

calculateImprovementTrend(recentGames) {
  // Linear regression over last 10 games to show improvement trend
  if (recentGames.length < 2) return 0;

  const scores = recentGames.map(g => g.score);
  // Calculate slope of trend line
  return calculateTrendSlope(scores);
}
```

**Validation Rules**:

- All counts must be >= 0
- Averages must be >= 0
- Best scores must be valid game scores

## Data Storage Schema

### LocalStorage Structure

```javascript
const STORAGE_SCHEMA = {
  // Game history - array of completed GameSession objects
  'magic-memory-history': GameSession[],

  // Current game state for resume capability
  'magic-memory-current': {
    gameSession: GameSession,
    gameState: {
      cards: Card[],
      choiceOne: Card | null,
      choiceTwo: Card | null,
      turn: number
    }
  },

  // Aggregated performance metrics
  'magic-memory-stats': PerformanceMetrics,

  // User preferences
  'magic-memory-preferences': {
    defaultDifficulty: Difficulty,
    soundEnabled: boolean,
    showTimer: boolean,
    animationSpeed: 'fast' | 'normal' | 'slow'
  }
};
```

### Data Migration Strategy

**Version 1.0.0**: Initial schema

- Backward compatibility not required (new feature)
- Data validation on load with fallback to defaults
- Graceful handling of corrupted localStorage data

**Future Versions**:

- Version field in each storage object
- Migration functions for schema changes
- Data backup before migrations

## Relationships Between Entities

```
GameSession (1) → (1) Score [composition]
GameSession (1) → (1) Timer [composition]
GameSession (1) → (1) Difficulty [reference]

PerformanceMetrics (1) → (many) GameSession [aggregation]

LocalStorage {
  gameHistory: GameSession[]
  currentGame: GameSession
  stats: PerformanceMetrics
  preferences: UserPreferences
}
```

## Data Flow

1. **Game Start**: Create new GameSession with selected Difficulty
2. **Game Progress**: Update Timer continuously, increment mistakes on errors
3. **Game Complete**: Calculate Score, determine stars, update PerformanceMetrics
4. **Data Persistence**: Save GameSession to history, update aggregated stats
5. **Data Retrieval**: Load history for leaderboards, stats for progress tracking

## Performance Considerations

- **Batch Updates**: Group localStorage writes to avoid excessive I/O
- **Data Pruning**: Limit history to last 100 games to prevent storage bloat
- **Lazy Loading**: Load stats only when needed for display
- **Memory Management**: Clear references to completed games after persistence

All data models defined and ready for contract generation.
