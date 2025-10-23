/**
 * useGameScore Hook
 * Hook for score tracking and mistake counting
 */

import { useState, useCallback, useMemo } from "react";
import { scoreService } from "../services/scoreService";
import { gameStorage } from "../services/gameStorage";

export const useGameScore = (difficulty = "medium") => {
  const [mistakes, setMistakes] = useState(0);
  const [turns, setTurns] = useState(0);

  // Increment mistakes
  const incrementMistakes = useCallback(() => {
    setMistakes((prev) => prev + 1);
  }, []);

  // Increment turns
  const incrementTurns = useCallback(() => {
    setTurns((prev) => prev + 1);
  }, []);

  // Reset counters
  const reset = useCallback(() => {
    setMistakes(0);
    setTurns(0);
  }, []);

  // Calculate final score
  const calculateFinalScore = useCallback(
    (timeElapsed) => {
      const scoreCalculation = scoreService.calculateGameScore(timeElapsed, mistakes, difficulty);
      const maxScore = scoreService.getMaxScore(difficulty);
      const stars = scoreService.calculateStarRating(scoreCalculation.finalScore, maxScore);
      const breakdown = scoreService.getScoreBreakdown(scoreCalculation);

      return {
        ...scoreCalculation,
        stars,
        mistakes,
        turns,
        difficulty,
        scoreBreakdown: breakdown,
      };
    },
    [mistakes, turns, difficulty]
  );

  // Save game session to history
  const saveGameSession = useCallback(
    (scoreData) => {
      const session = {
        id: `game-${Date.now()}`,
        difficulty,
        startTime: new Date(Date.now() - scoreData.timeElapsed * 1000).toISOString(),
        endTime: new Date().toISOString(),
        timeElapsed: scoreData.timeElapsed,
        score: scoreData.finalScore,
        mistakes: scoreData.mistakes,
        stars: scoreData.stars,
        maxPossibleScore: scoreService.getMaxScore(difficulty),
        completed: true,
        cardPairs: 6, // Default for medium difficulty
      };

      gameStorage.saveGameSession(session);
      return session;
    },
    [difficulty]
  );

  // Check if new personal best
  const checkPersonalBest = useCallback(
    (score) => {
      const metrics = gameStorage.loadPerformanceMetrics();
      const bestScore = metrics.bestScoreByDifficulty[difficulty];

      return scoreService.compareToPersonalBest(score, difficulty, bestScore?.score);
    },
    [difficulty]
  );

  // Get current max possible score
  const maxPossibleScore = useMemo(() => {
    return scoreService.getMaxScore(difficulty);
  }, [difficulty]);

  return {
    mistakes,
    turns,
    incrementMistakes,
    incrementTurns,
    reset,
    calculateFinalScore,
    saveGameSession,
    checkPersonalBest,
    maxPossibleScore,
  };
};
