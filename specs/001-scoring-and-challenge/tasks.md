---
description: "Task list for Scoring and Challenge System implementation"
---

# Tasks: Scoring and Challenge System

**Input**: Design documents from `/specs/001-scoring-and-challenge/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: NO TESTING - Constitution enforces no unit tests, integration tests, or e2e tests. Focus on implementation and manual verification only.

**Organization**: Tasks are grouped by user story to enable independent implementation and manual verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `public/` at repository root (no test directories per constitution)
- Paths shown below assume single project structure as defined in plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and basic structure

- [ ] T001 Install and configure Tailwind CSS with postcss and autoprefixer dependencies
- [ ] T002 Install date-fns dependency for timer formatting
- [ ] T003 Install ShadCN UI dependencies (@radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge)
- [ ] T004 Configure tailwind.config.js with custom theme colors and ShadCN integration
- [ ] T005 Update src/index.css with Tailwind directives and custom CSS variables
- [ ] T006 Create src/lib/utils.js with cn utility function for class merging
- [ ] T007 [P] Create src/styles/globals.css for additional styling if needed
- [ ] T008 [P] Create directory structure: src/components/game/, src/components/ui/, src/services/, src/hooks/, src/utils/

## Phase 2: Foundational (Core Services & Utilities)

**Purpose**: Implement core business logic services that all user stories depend on

- [ ] T009 [P] Create src/utils/scoreCalculation.js with score calculation formulas
- [ ] T010 [P] Create src/utils/timeFormatting.js with date-fns integration for timer display
- [ ] T011 Create src/services/gameStorage.js with localStorage operations for game data persistence
- [ ] T012 Create src/services/scoreService.js implementing score calculation and star rating logic
- [ ] T013 Create src/services/timerService.js implementing timer management with callbacks
- [ ] T013a [P] Implement timer security measures to prevent manipulation (server-time validation, integrity checks)
- [ ] T014 Create src/hooks/useLocalStorage.js for localStorage state management
- [ ] T015 Create src/components/ui/button.jsx as base ShadCN button component
- [ ] T016 [P] Create difficulty configuration constants in src/utils/difficultyConfig.js

## Phase 3: User Story 1 - Time-Based Scoring (Priority: P1)

**Goal**: Implement visible timer that tracks gameplay and calculates scores based on time and accuracy

**Manual Verification**: Can be verified by starting a game, observing the timer counting up, making some correct and incorrect matches, completing the game, and confirming that the final score reflects both time taken and mistakes made.

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create src/hooks/useGameTimer.js hook for timer state management and service integration
- [ ] T018 [P] [US1] Create src/hooks/useGameScore.js hook for score tracking and mistake counting
- [ ] T019 [US1] Create src/components/game/Timer.jsx component with real-time display and formatting
- [ ] T020 [US1] Integrate timer service with game session lifecycle in src/services/gameService.js
- [ ] T021 [US1] Implement score calculation integration when game completes
- [ ] T022 [US1] Add mistake tracking to existing card flip logic in src/App.jsx
- [ ] T023 [US1] Integrate timer display into main game interface in src/App.jsx

**Checkpoint**: At this point, User Story 1 should be fully functional with timer display, score calculation, and mistake tracking

---

## Phase 4: User Story 2 - Visual Performance Summary (Priority: P1)

**Goal**: Display comprehensive summary screen with score, time, mistakes, and star rating after game completion

**Manual Verification**: Can be verified by completing any game and confirming that a summary screen appears showing total score, completion time, number of mistakes, and a star rating (1-3 stars) with clear visual indicators.

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create src/components/game/GameSummary.jsx with complete performance display
- [ ] T025 [P] [US2] Create src/components/game/StarRating.jsx component for visual star display
- [ ] T026 [US2] Implement game state management for summary screen display in src/App.jsx
- [ ] T027 [US2] Add automatic summary screen trigger when game completes
- [ ] T028 [US2] Integrate performance metrics display with score service results
- [ ] T029 [US2] Add play again functionality to return to game menu
- [ ] T030 [US2] Style summary screen with Tailwind CSS for responsive design

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently via manual verification

---

## Phase 5: User Story 3 - Multiple Difficulty Levels (Priority: P2)

**Goal**: Implement three selectable difficulty levels (Easy 3x3, Medium 4x4, Hard 6x6) with appropriate scoring multipliers

**Manual Verification**: Can be verified by accessing a difficulty selection screen before starting a game, choosing each difficulty level, and confirming that Easy and Medium use appropriate grid sizes while Hard mode uses a 6x6 grid with 36 cards.

### Implementation for User Story 3

- [ ] T031 [P] [US3] Create src/components/game/DifficultySelector.jsx for difficulty level selection
- [ ] T032 [P] [US3] Implement dynamic card grid generation based on difficulty in src/utils/cardGenerator.js
- [ ] T033 [US3] Add difficulty-based score multiplier logic to score service
- [ ] T034 [US3] Update existing card shuffle logic to support variable grid sizes in src/App.jsx
- [ ] T035 [US3] Integrate difficulty selector into game menu/start screen
- [ ] T036 [US3] Implement difficulty-specific card image sets and grid layouts
- [ ] T037 [US3] Add responsive CSS for different grid sizes across all device types
- [ ] T038 [US3] Update game session tracking to include difficulty level

**Checkpoint**: At this point, all three User Stories should work independently and together as a complete system

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, performance optimization, and edge case handling

- [ ] T039 [P] Implement 10-minute time limit with automatic game end functionality
- [ ] T040 [P] Add game abandonment handling when user exits before completion
- [ ] T041 [P] Implement localStorage data validation and error handling
- [ ] T042 [P] Add performance optimizations for timer updates and large grid sizes
- [ ] T043 [P] Implement responsive design testing and mobile touch optimization
- [ ] T044 Update existing SingleCard component styling to work with new Tailwind theme
- [ ] T045 Add smooth animations for game state transitions and star celebrations
- [ ] T046 Implement bundle size optimization and lazy loading if needed
- [ ] T047 Final integration testing across all user stories and edge cases
- [ ] T048 Performance validation: 60fps animations, <1MB bundle, <100ms layout shifts

---

## Dependencies & Execution Strategy

### User Story Dependencies

- **US1 (Time-Based Scoring)**: No dependencies - can start immediately after Phase 2
- **US2 (Visual Summary)**: Depends on US1 (needs scoring calculation)
- **US3 (Difficulty Levels)**: Independent of US1/US2, can be developed in parallel

### Parallel Execution Opportunities

- **Phase 1 (Setup)**: T007-T008 can run in parallel with T001-T006
- **Phase 2 (Foundational)**: T009-T010, T015-T016 can run in parallel with core services
- **Phase 3 (US1)**: T017-T018 can run in parallel, T019 independent of T020-T021
- **Phase 4 (US2)**: T024-T025 can run in parallel, T030 independent of other tasks
- **Phase 5 (US3)**: T031-T032 can run in parallel, T037-T038 can run independently
- **Phase 6 (Polish)**: T039-T043 can all run in parallel

### MVP Delivery Strategy

1. **MVP 1**: Complete Phases 1-3 (US1 only) - Basic timer and scoring
2. **MVP 2**: Add Phase 4 (US2) - Complete game with summary screen
3. **MVP 3**: Add Phase 5 (US3) - Full feature with difficulty levels
4. **Final**: Add Phase 6 - Production ready with polish and optimization

### Independent Testing Approach

Each user story can be manually verified independently:

- **US1**: Start game → observe timer → make matches/mistakes → verify score calculation
- **US2**: Complete any game → verify summary screen shows all required information
- **US3**: Select different difficulties → verify appropriate grid sizes and multipliers

---

## Summary

**Total Tasks**: 48 tasks organized into 6 phases
**Parallel Opportunities**: 19 tasks can run in parallel (marked with [P])
**User Story Breakdown**:

- Setup & Foundation: 16 tasks (T001-T016)
- US1 (Time-Based Scoring): 7 tasks (T017-T023)
- US2 (Visual Summary): 7 tasks (T024-T030)
- US3 (Difficulty Levels): 8 tasks (T031-T038)
- Polish & Cross-cutting: 10 tasks (T039-T048)

**Constitution Compliance**: ✅ No automated tests, manual verification only
**Performance Focus**: ✅ 60fps animations, <1MB bundle, responsive design
**Clean Architecture**: ✅ Single responsibility components, service layer separation
