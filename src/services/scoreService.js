/**
 * Score Service
 * Handles all scoring calculations and star rating determinations
 */

import { calculateScore, calculateStars, getMaxPossibleScore } from "../utils/scoreCalculation";

class ScoreService {
  /**
   * Calculate score based on game performance
   * @param {number} timeInSeconds - Game duration in seconds
   * @param {number} mistakes - Number of incorrect flips
   * @param {string} difficulty - Game difficulty level
   * @returns {Object} Score calculation breakdown
   */
  calculateGameScore(timeInSeconds, mistakes, difficulty) {
    return calculateScore(timeInSeconds, mistakes, difficulty);
  }

  /**
   * Calculate star rating
   * @param {number} score - Final score
   * @param {number} maxPossibleScore - Maximum possible score
   * @returns {1|2|3} Star rating
   */
  calculateStarRating(score, maxPossibleScore) {
    return calculateStars(score, maxPossibleScore);
  }

  /**
   * Get maximum possible score for difficulty
   * @param {string} difficulty - Game difficulty level
   * @returns {number} Maximum possible score
   */
  getMaxScore(difficulty) {
    return getMaxPossibleScore(difficulty);
  }

  /**
   * Get detailed score breakdown for display
   * @param {Object} calculation - Score calculation object
   * @returns {Object} Formatted score breakdown
   */
  getScoreBreakdown(calculation) {
    return {
      components: {
        base: {
          points: calculation.baseScore,
          description: "Base points",
        },
        timeBonus: {
          points: calculation.timeBonus,
          description: "Speed bonus",
        },
        mistakes: {
          points: -calculation.mistakePenalty,
          description: `Mistake penalty`,
        },
        difficulty: {
          multiplier: calculation.difficultyMultiplier,
          description: "Difficulty multiplier",
        },
      },
      rawScore: calculation.rawScore,
      finalScore: calculation.finalScore,
      percentageOfMax: calculation.percentageOfMax,
    };
  }

  /**
   * Compare score to personal best
   * @param {number} score - Current score
   * @param {string} difficulty - Game difficulty
   * @param {number} previousBest - Previous best score
   * @returns {Object} Comparison results
   */
  compareToPersonalBest(score, difficulty, previousBest) {
    const isNewBest = !previousBest || score > previousBest;
    const improvement = previousBest ? score - previousBest : score;

    return {
      isNewBest,
      improvement,
      previousBest: previousBest || 0,
      improvementPercentage: previousBest ? (improvement / previousBest) * 100 : 0,
    };
  }

  /**
   * Determine performance level based on percentage
   * @param {number} percentageOfMax - Score as percentage of max
   * @returns {string} Performance level
   */
  getPerformanceLevel(percentageOfMax) {
    if (percentageOfMax >= 90) return "Excellent";
    if (percentageOfMax >= 70) return "Good";
    if (percentageOfMax >= 50) return "Average";
    return "Needs Improvement";
  }
}

export const scoreService = new ScoreService();
