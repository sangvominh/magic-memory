/**
 * Score Calculation Utilities
 * Implements the scoring formula for Magic Memory game
 */

const DIFFICULTY_CONFIGS = {
  easy: { multiplier: 1, maxScore: 1600 },
  medium: { multiplier: 1.5, maxScore: 2400 },
  hard: { multiplier: 2, maxScore: 3200 },
};

/**
 * Calculate score based on time, mistakes, and difficulty
 * @param {number} timeInSeconds - Total game time in seconds
 * @param {number} mistakes - Number of incorrect card flips
 * @param {string} difficulty - "easy" | "medium" | "hard"
 * @returns {Object} Score breakdown and final score
 */
export const calculateScore = (timeInSeconds, mistakes, difficulty) => {
  const baseScore = 1000;
  const maxTimeForBonus = 60;
  const mistakePenalty = 50;

  const timeBonus = Math.max(0, (maxTimeForBonus - timeInSeconds) * 10);
  const rawScore = baseScore + timeBonus - mistakes * mistakePenalty;
  const difficultyMultiplier = DIFFICULTY_CONFIGS[difficulty]?.multiplier || 1;
  const finalScore = Math.max(0, Math.round(rawScore * difficultyMultiplier));

  return {
    baseScore,
    timeBonus,
    mistakePenalty: mistakes * mistakePenalty,
    difficultyMultiplier,
    rawScore: Math.max(0, rawScore),
    finalScore,
    percentageOfMax: (finalScore / getMaxPossibleScore(difficulty)) * 100,
  };
};

/**
 * Calculate star rating based on performance percentage
 * @param {number} score - Final calculated score
 * @param {number} maxPossibleScore - Maximum possible score for difficulty
 * @returns {1|2|3} Star rating
 */
export const calculateStars = (score, maxPossibleScore) => {
  const percentage = (score / maxPossibleScore) * 100;

  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  return 1;
};

/**
 * Get maximum possible score for a difficulty level
 * @param {string} difficulty - "easy" | "medium" | "hard"
 * @returns {number} Maximum possible score
 */
export const getMaxPossibleScore = (difficulty) => {
  return DIFFICULTY_CONFIGS[difficulty]?.maxScore || 1600;
};

/**
 * Get difficulty multiplier
 * @param {string} difficulty - "easy" | "medium" | "hard"
 * @returns {number} Score multiplier
 */
export const getDifficultyMultiplier = (difficulty) => {
  return DIFFICULTY_CONFIGS[difficulty]?.multiplier || 1;
};
