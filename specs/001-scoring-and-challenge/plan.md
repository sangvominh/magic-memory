# Implementation Plan: Scoring and Challenge System

**Branch**: `001-scoring-and-challenge` | **Date**: 2025-10-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-scoring-and-challenge/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a comprehensive scoring and challenge system for the Magic Memory game that includes real-time timer functionality, performance-based scoring calculations, visual star rating feedback, and three difficulty levels (Easy 3x3, Medium 4x4, Hard 6x6). The system will use Tailwind CSS for styling with theme colors, ShadCN UI components for consistent interface elements, local storage for persistent data, and date-fns for time formatting.

## Technical Context

**Language/Version**: React 19.2.0 with Create React App  
**Primary Dependencies**: React, Tailwind CSS, ShadCN UI, date-fns  
**Storage**: Local Storage for game scores, preferences, and statistics  
**Testing**: NO TESTING (Constitution enforced - no unit, integration, or e2e tests)  
**Target Platform**: Web browsers (desktop, tablet, mobile)
**Project Type**: Single project (web application)  
**Performance Goals**: 60fps animations, <100ms layout shifts, real-time timer updates  
**Constraints**: <1MB bundle size, mobile-first responsive design, offline capability for game state  
**Scale/Scope**: Single-player memory game with local storage, 3 difficulty levels, scoring system

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Clean Code**: Components have single responsibilities (Timer, ScoreCalculator, GameSummary, DifficultySelector)
✅ **Simple UX**: Intuitive interface with clear visual feedback (star ratings, timer display, difficulty selection)
✅ **Responsive Design**: Mobile-first approach using Tailwind CSS for all device compatibility
✅ **Minimal Dependencies**:

- Tailwind CSS: Justified for responsive design and theme consistency (vs custom CSS)
- ShadCN UI: Justified for consistent, accessible components (vs building from scratch)
- date-fns: Justified for timer formatting (vs custom date handling)
- Local Storage: Native browser API, no external dependency
  ✅ **NO TESTING Policy**: No automated tests will be implemented, manual verification only
  ✅ **Performance Standards**: 60fps animations, real-time timer updates, <1MB bundle size target

**Post-Design Re-evaluation**:
✅ All dependencies remain justified and minimal
✅ Component architecture maintains single responsibility principle
✅ Service layer provides clean separation of concerns
✅ LocalStorage approach avoids external service dependencies
✅ React hooks pattern keeps components simple and focused
✅ Manual verification approach documented in quickstart guide

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── game/
│   │   ├── Timer.jsx
│   │   ├── ScoreCalculator.js
│   │   ├── GameSummary.jsx
│   │   └── DifficultySelector.jsx
│   ├── ui/           # ShadCN UI components
│   └── SingleCard.jsx # Existing component
├── services/
│   ├── gameStorage.js    # Local storage operations
│   ├── scoreService.js   # Score calculation logic
│   └── timerService.js   # Timer utility functions
├── hooks/
│   ├── useGameTimer.js
│   ├── useGameScore.js
│   └── useLocalStorage.js
├── utils/
│   ├── scoreCalculation.js
│   └── timeFormatting.js  # date-fns integration
├── styles/
│   └── globals.css       # Tailwind imports
└── App.jsx               # Main game container
```

**Structure Decision**: Single project structure selected as this is a self-contained web application. The existing `src/components/SingleCard.jsx` will be enhanced, and new scoring/timer components will be added alongside. Services layer handles business logic while hooks manage state and side effects.

## Phase 0: Research & Technology Decisions

_Research tasks to resolve unknowns from Technical Context._
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
