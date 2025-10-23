# Quickstart Guide: Scoring and Challenge System

**Phase**: 1 - Design & Contracts  
**Date**: 2025-10-23

This guide provides step-by-step instructions for implementing the scoring and challenge system for Magic Memory.

## Prerequisites

- Node.js 18+ installed
- Existing Magic Memory project with React 19.2.0
- Basic familiarity with React hooks and localStorage

## Phase 1: Setup Dependencies

### 1.1 Install Required Packages

```bash
npm install tailwindcss @tailwindcss/forms postcss autoprefixer
npm install date-fns
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

### 1.2 Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

### 1.3 Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

### 1.4 Update CSS Files

Replace `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Phase 2: Create Core Services

### 2.1 Create Utility Functions

Create `src/lib/utils.js`:

```javascript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

### 2.2 Create Storage Service

Create `src/services/gameStorage.js`:

```javascript
const STORAGE_KEYS = {
  GAME_HISTORY: "magic-memory-history",
  CURRENT_GAME: "magic-memory-current",
  PERFORMANCE_STATS: "magic-memory-stats",
  USER_PREFERENCES: "magic-memory-preferences",
};

class StorageService {
  saveGameSession(session) {
    try {
      const history = this.loadGameHistory();
      history.push(session);

      // Keep only last 100 games to prevent storage bloat
      const limitedHistory = history.slice(-100);

      localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(limitedHistory));
      this.updatePerformanceMetrics(session);
    } catch (error) {
      console.error("Failed to save game session:", error);
    }
  }

  loadGameHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load game history:", error);
      return [];
    }
  }

  // ... implement other methods from contract
}

export const storageService = new StorageService();
```

### 2.3 Create Score Service

Create `src/services/scoreService.js`:

```javascript
const DIFFICULTY_CONFIGS = {
  easy: { multiplier: 1, maxScore: 1600 },
  medium: { multiplier: 1.5, maxScore: 2400 },
  hard: { multiplier: 2, maxScore: 3200 },
};

class ScoreService {
  calculateScore(timeInSeconds, mistakes, difficulty) {
    const baseScore = 1000;
    const maxTimeForBonus = 60;
    const mistakePenalty = 50;

    const timeBonus = Math.max(0, (maxTimeForBonus - timeInSeconds) * 10);
    const rawScore = baseScore + timeBonus - mistakes * mistakePenalty;
    const difficultyMultiplier = DIFFICULTY_CONFIGS[difficulty].multiplier;
    const finalScore = Math.max(0, rawScore * difficultyMultiplier);

    return {
      baseScore,
      timeBonus,
      mistakePenalty: mistakes * mistakePenalty,
      difficultyMultiplier,
      rawScore,
      finalScore,
      percentageOfMax: (finalScore / this.getMaxPossibleScore(difficulty)) * 100,
    };
  }

  calculateStars(score, maxPossibleScore) {
    const percentage = (score / maxPossibleScore) * 100;

    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    return 1;
  }

  getMaxPossibleScore(difficulty) {
    return DIFFICULTY_CONFIGS[difficulty].maxScore;
  }
}

export const scoreService = new ScoreService();
```

### 2.4 Create Timer Service

Create `src/services/timerService.js`:

```javascript
import { format, addSeconds } from "date-fns";

class TimerService {
  constructor() {
    this.timers = new Map();
  }

  startTimer(sessionId) {
    const timer = {
      startTime: Date.now(),
      elapsedSeconds: 0,
      isRunning: true,
      callbacks: [],
    };

    this.timers.set(sessionId, timer);
    this._runTimer(sessionId);
  }

  _runTimer(sessionId) {
    const timer = this.timers.get(sessionId);
    if (!timer || !timer.isRunning) return;

    timer.elapsedSeconds = Math.floor((Date.now() - timer.startTime) / 1000);

    // Notify callbacks
    timer.callbacks.forEach((callback) => callback(timer.elapsedSeconds));

    // Check max duration (10 minutes)
    if (timer.elapsedSeconds >= 600) {
      this.stopTimer(sessionId);
      return;
    }

    setTimeout(() => this._runTimer(sessionId), 1000);
  }

  getFormattedTime(sessionId) {
    const timer = this.timers.get(sessionId);
    if (!timer) return "00:00";

    const date = addSeconds(new Date(0), timer.elapsedSeconds);
    return format(date, "mm:ss");
  }

  onTimerUpdate(sessionId, callback) {
    const timer = this.timers.get(sessionId);
    if (timer) {
      timer.callbacks.push(callback);
    }

    return () => {
      if (timer) {
        timer.callbacks = timer.callbacks.filter((cb) => cb !== callback);
      }
    };
  }

  // ... implement other methods from contract
}

export const timerService = new TimerService();
```

## Phase 3: Create React Hooks

### 3.1 Create Game Timer Hook

Create `src/hooks/useGameTimer.js`:

```javascript
import { useState, useEffect } from "react";
import { timerService } from "../services/timerService";

export const useGameTimer = (sessionId) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = timerService.onTimerUpdate(sessionId, (elapsed) => {
      setElapsedTime(elapsed);
      setFormattedTime(timerService.getFormattedTime(sessionId));
    });

    return unsubscribe;
  }, [sessionId]);

  const startTimer = () => {
    if (sessionId) {
      timerService.startTimer(sessionId);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    if (sessionId) {
      const finalTime = timerService.stopTimer(sessionId);
      setIsRunning(false);
      return finalTime;
    }
  };

  return {
    elapsedTime,
    formattedTime,
    isRunning,
    startTimer,
    stopTimer,
  };
};
```

### 3.2 Create Game Score Hook

Create `src/hooks/useGameScore.js`:

```javascript
import { useState, useCallback } from "react";
import { scoreService } from "../services/scoreService";

export const useGameScore = () => {
  const [currentScore, setCurrentScore] = useState(null);
  const [mistakes, setMistakes] = useState(0);

  const recordMistake = useCallback(() => {
    setMistakes((prev) => prev + 1);
  }, []);

  const calculateFinalScore = useCallback(
    (timeInSeconds, difficulty) => {
      const calculation = scoreService.calculateScore(timeInSeconds, mistakes, difficulty);
      const maxScore = scoreService.getMaxPossibleScore(difficulty);
      const stars = scoreService.calculateStars(calculation.finalScore, maxScore);

      const result = {
        ...calculation,
        stars,
        mistakes,
      };

      setCurrentScore(result);
      return result;
    },
    [mistakes]
  );

  const resetScore = useCallback(() => {
    setCurrentScore(null);
    setMistakes(0);
  }, []);

  return {
    currentScore,
    mistakes,
    recordMistake,
    calculateFinalScore,
    resetScore,
  };
};
```

## Phase 4: Create UI Components

### 4.1 Create Base Button Component

Create `src/components/ui/button.jsx`:

```javascript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 4.2 Create Timer Component

Create `src/components/game/Timer.jsx`:

```javascript
import React from "react";
import { cn } from "../../lib/utils";

export const Timer = ({ time, isRunning, className }) => {
  return (
    <div
      className={cn(
        "text-2xl font-mono font-bold tracking-wider",
        "bg-card text-card-foreground",
        "px-4 py-2 rounded-lg border",
        isRunning ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {time}
    </div>
  );
};
```

### 4.3 Create Difficulty Selector Component

Create `src/components/game/DifficultySelector.jsx`:

```javascript
import React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy", description: "3×3 grid", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", description: "4×4 grid", color: "bg-yellow-100 text-yellow-800" },
  { value: "hard", label: "Hard", description: "6×6 grid", color: "bg-red-100 text-red-800" },
];

export const DifficultySelector = ({ selectedDifficulty, onSelect, disabled = false }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-center">Choose Difficulty</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DIFFICULTY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={selectedDifficulty === option.value ? "default" : "outline"}
            className={cn(
              "h-auto p-4 flex flex-col items-center space-y-2",
              selectedDifficulty === option.value && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
          >
            <span className={cn("px-2 py-1 rounded text-xs font-medium", option.color)}>{option.label}</span>
            <span className="text-sm text-muted-foreground">{option.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
```

## Phase 5: Integration with Existing App

### 5.1 Update Main App Component

Modify `src/App.jsx` to integrate the new system:

```javascript
import { useState, useEffect } from "react";
import SingleCard from "./components/SingleCard";
import { Timer } from "./components/game/Timer";
import { DifficultySelector } from "./components/game/DifficultySelector";
import { GameSummary } from "./components/game/GameSummary";
import { useGameTimer } from "./hooks/useGameTimer";
import { useGameScore } from "./hooks/useGameScore";
import { Button } from "./components/ui/button";
import "./App.css";

// ... existing cardImages array

function App() {
  const [gameState, setGameState] = useState("menu"); // 'menu', 'playing', 'summary'
  const [difficulty, setDifficulty] = useState("easy");
  const [sessionId, setSessionId] = useState(null);

  // ... existing game state
  const { formattedTime, startTimer, stopTimer } = useGameTimer(sessionId);
  const { mistakes, recordMistake, calculateFinalScore, resetScore } = useGameScore();

  const startNewGame = (selectedDifficulty) => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setDifficulty(selectedDifficulty);
    setGameState("playing");
    resetScore();
    shuffleCards();
    startTimer();
  };

  // ... existing game logic with mistake tracking

  return (
    <div className="App">
      {gameState === "menu" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-center">Magic Memory</h1>
          <DifficultySelector selectedDifficulty={difficulty} onSelect={setDifficulty} />
          <div className="text-center">
            <Button onClick={() => startNewGame(difficulty)}>Start Game</Button>
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Timer time={formattedTime} isRunning={true} />
            <div className="text-lg">
              Mistakes: <span className="font-bold text-destructive">{mistakes}</span>
            </div>
          </div>

          {/* Existing game grid */}
          <div className="card-grid">
            {cards.map((card) => (
              <SingleCard
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={card === choiceOne || card === choiceTwo || card.matched}
                disabled={disable}
              />
            ))}
          </div>
        </div>
      )}

      {gameState === "summary" && <GameSummary score={currentScore} onPlayAgain={() => setGameState("menu")} />}
    </div>
  );
}

export default App;
```

### 5.2 Update Package.json Scripts

Add Tailwind build process to `package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Phase 6: Testing and Validation

### 6.1 Manual Testing Checklist

- [ ] Timer starts when first card is flipped
- [ ] Timer displays in MM:SS format
- [ ] Mistakes are tracked correctly
- [ ] Score calculation follows formula
- [ ] Star ratings display based on performance
- [ ] Difficulty selector works properly
- [ ] Game data persists in localStorage
- [ ] Responsive design works on mobile

### 6.2 Performance Validation

- [ ] Bundle size remains under 1MB
- [ ] Timer updates smoothly (60fps)
- [ ] No memory leaks with timer cleanup
- [ ] localStorage operations don't block UI

### 6.3 Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## Common Issues and Solutions

### Issue: Timer doesn't start

**Solution**: Ensure sessionId is properly set before calling startTimer

### Issue: Styles not applying

**Solution**: Verify Tailwind CSS is properly imported in index.css

### Issue: localStorage errors

**Solution**: Add try-catch blocks and fallback to defaults

### Issue: Bundle size too large

**Solution**: Use dynamic imports for non-critical components

## Next Steps

After completing this quickstart:

1. Run `/speckit.tasks` to generate implementation task list
2. Begin development following the task breakdown
3. Implement manual testing for each user story
4. Deploy to staging environment for validation

This quickstart provides the foundation for implementing the complete scoring and challenge system while maintaining code quality and performance standards.
