# Feature Specification: Scoring and Challenge System

**Feature Branch**: `001-scoring-and-challenge`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: User description: "Scoring and Challenge System. The application must implement a detailed scoring system and introduce difficulty levels to enhance replayability and user engagement."

## User Scenarios & Manual Verification _(mandatory)_

### User Story 1 - Time-Based Scoring (Priority: P1)

A player wants to see their performance tracked with a visible timer and score calculation based on their speed and accuracy. When they start a game, they see a timer counting up, and when they finish, they receive a score based on completion time and number of incorrect card flips.

**Why this priority**: Core scoring mechanics are essential for any competitive game experience and provide immediate feedback to players about their performance.

**Manual Verification**: Can be verified by starting a game, observing the timer counting up, making some correct and incorrect matches, completing the game, and confirming that the final score reflects both time taken and mistakes made.

**Acceptance Scenarios**:

1. **Given** a new game is started, **When** the first card is flipped, **Then** a visible timer begins counting up from 00:00
2. **Given** the game is in progress, **When** the timer is running, **Then** the timer display updates every second visibly to the player
3. **Given** a game is completed, **When** all pairs are matched, **Then** the timer stops and final time is recorded
4. **Given** a completed game, **When** calculating the score, **Then** faster completion times result in higher base scores
5. **Given** a completed game, **When** calculating the score, **Then** each incorrect card flip reduces the final score

---

### User Story 2 - Visual Performance Summary (Priority: P1)

After completing a memory game, a player wants to see a comprehensive summary screen showing their performance with visual feedback including their score, time, mistakes, and a star rating system (1-3 stars) that gives them immediate understanding of how well they performed.

**Why this priority**: Visual feedback is crucial for player satisfaction and motivation to replay. The star system provides clear, gamified feedback that encourages improvement.

**Manual Verification**: Can be verified by completing any game and confirming that a summary screen appears showing total score, completion time, number of mistakes, and a star rating (1-3 stars) with clear visual indicators.

**Acceptance Scenarios**:

1. **Given** a game is completed, **When** the last pair is matched, **Then** a summary screen appears automatically
2. **Given** the summary screen is displayed, **When** viewing the results, **Then** the player sees their total score prominently displayed
3. **Given** the summary screen is displayed, **When** viewing the results, **Then** the player sees their completion time in MM:SS format
4. **Given** the summary screen is displayed, **When** viewing the results, **Then** the player sees the total number of incorrect flips made
5. **Given** the summary screen is displayed, **When** viewing the results, **Then** the player sees a star rating (1-3 stars) based on their performance
6. **Given** excellent performance, **When** score meets top threshold, **Then** 3 stars are displayed with visual celebration
7. **Given** good performance, **When** score meets middle threshold, **Then** 2 stars are displayed
8. **Given** completed game with poor performance, **When** score is below middle threshold, **Then** 1 star is displayed

---

### User Story 3 - Multiple Difficulty Levels (Priority: P2)

A player wants to choose from different challenge levels (Easy, Medium, Hard) before starting a game to match their skill level and increase replay value. The Hard difficulty should provide significantly more challenge with a larger 6x6 grid (36 cards total, 18 pairs).

**Why this priority**: Different difficulty levels cater to various skill levels and provide progression paths for players to advance their abilities, significantly increasing replay value.

**Manual Verification**: Can be verified by accessing a difficulty selection screen before starting a game, choosing each difficulty level, and confirming that Easy and Medium use the current grid size while Hard mode uses a 6x6 grid with 36 cards.

**Acceptance Scenarios**:

1. **Given** starting a new game, **When** the player accesses game options, **Then** three difficulty levels are available: Easy, Medium, Hard
2. **Given** Easy difficulty is selected, **When** the game starts, **Then** a 3x3 grid with 6 pairs (12 cards) is displayed
3. **Given** Medium difficulty is selected, **When** the game starts, **Then** a 4x4 grid with 8 pairs (16 cards) is displayed
4. **Given** Hard difficulty is selected, **When** the game starts, **Then** a 6x6 grid with 18 pairs (36 cards) is displayed
5. **Given** different difficulties, **When** calculating scores, **Then** Hard mode achievements receive score multipliers for the increased challenge

---

### Edge Cases

- When a player exits the game before completion, all progress is lost and no score is recorded to encourage completion
- Games have a maximum 10 minute time limit, after which the game ends automatically and score is calculated based on pairs matched
- Perfect game (no incorrect flips and completion under 60 seconds) receives a 200 point bonus on top of calculated score
- How should the star rating thresholds be calculated for different difficulty levels?
- What happens if the timer reaches an extremely long duration (over 1 hour)?
- How should the system handle rapid card clicking that might cause UI issues?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a visible timer that starts counting from 00:00 when the first card is flipped
- **FR-002**: System MUST track and record completion time when all pairs are successfully matched
- **FR-003**: System MUST count and track the number of incorrect card flips during gameplay
- **FR-004**: System MUST calculate a final score using the formula: `base 1000 points + time bonus - mistake penalties` where time bonus = `max(0, 300 - (timeInSeconds * 2))` and mistake penalty = `mistakes * 50 points`
- **FR-005**: System MUST display a post-game summary screen showing score, time, mistakes, and star rating
- **FR-006**: System MUST implement a 3-star rating system using percentage-based thresholds calculated against theoretical maximum score for the difficulty level: 3 stars (90%+ of max possible score), 2 stars (70-89%), 1 star (below 70%)
- **FR-007**: System MUST provide three selectable difficulty levels: Easy, Medium, and Hard
- **FR-008**: Easy difficulty MUST use a 3x3 grid with 6 pairs (12 cards total)
- **FR-009**: Medium difficulty MUST use a 4x4 grid with 8 pairs (16 cards total)
- **FR-010**: Hard difficulty MUST use a 6x6 grid with 18 pairs (36 cards total)
- **FR-011**: System MUST apply score multipliers by difficulty: Easy 1x, Medium 1.5x, Hard 2x
- **FR-012**: System MUST allow players to select difficulty level before starting each game
- **FR-013**: Timer MUST continue running until game completion or exit
- **FR-014**: System MUST prevent timer manipulation or cheating
- **FR-015**: System MUST enforce a maximum 10 minute time limit per game, automatically ending games that exceed this duration

### Key Entities _(include if feature involves data)_

- **GameSession**: Represents a single game instance with start time, end time, difficulty level, score, and performance metrics
- **Score**: Contains calculated points based on time and accuracy, star rating, and difficulty multiplier
- **Timer**: Tracks elapsed game time with start/stop functionality and display formatting
- **Difficulty**: Defines game parameters including grid size, card count, and scoring thresholds
- **PerformanceMetrics**: Tracks completion time, incorrect flips, accuracy percentage, and derived statistics

## Clarifications

### Session 2025-10-23

- Q: Score Calculation Formula → A: Base points + time bonus - mistake penalties (e.g., 1000 + (60-seconds)*10 - mistakes*50)
- Q: Star Rating Thresholds → A: Percentage-based: 3 stars (90%+ of max possible), 2 stars (70-89%), 1 star (below 70%)
- Q: Score Multipliers by Difficulty → A: Moderate: Easy 1x, Medium 1.5x, Hard 2x
- Q: Game Exit Behavior → A: Progress lost - no score saved, encourages game completion
- Q: Maximum Time Limit → A: 10 minute maximum - balance thoughtful play with reasonable limits

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Players can see their game timer update in real-time with 1-second precision throughout gameplay
- **SC-002**: Players receive immediate visual feedback through the star rating system within 2 seconds of game completion
- **SC-003**: Hard difficulty mode successfully displays and functions with 36 cards in a 6x6 grid layout
- **SC-004**: Score calculation accurately reflects both speed (faster = higher score) and accuracy (fewer mistakes = higher score) components
- **SC-005**: Players can distinguish between difficulty levels through clear grid size differences and appropriate challenge scaling
- **SC-006**: Summary screen displays all required information (score, time, mistakes, stars) in a single, comprehensive view
- **SC-007**: Star rating thresholds provide meaningful differentiation where achieving 3 stars requires demonstrably superior performance
- **SC-008**: Game completion rate increases by 25% due to motivational scoring system
- **SC-009**: Player session duration increases by 40% through engaging difficulty progression
