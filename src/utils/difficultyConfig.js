/**
 * Difficulty Configuration
 * Defines parameters for each challenge level
 */

export const DIFFICULTY_CONFIGS = {
  easy: {
    id: "easy",
    gridSize: { rows: 3, cols: 3 },
    totalCards: 12,
    totalPairs: 6,
    scoreMultiplier: 1,
    name: "Easy",
    description: "3×3 grid with 6 pairs",
    color: "green",
  },
  medium: {
    id: "medium",
    gridSize: { rows: 4, cols: 4 },
    totalCards: 16,
    totalPairs: 8,
    scoreMultiplier: 1.5,
    name: "Medium",
    description: "4×4 grid with 8 pairs",
    color: "yellow",
  },
  hard: {
    id: "hard",
    gridSize: { rows: 6, cols: 6 },
    totalCards: 36,
    totalPairs: 18,
    scoreMultiplier: 2,
    name: "Hard",
    description: "6×6 grid with 18 pairs",
    color: "red",
  },
};

/**
 * Get difficulty configuration by ID
 * @param {string} difficultyId - "easy" | "medium" | "hard"
 * @returns {Object} Difficulty configuration
 */
export const getDifficultyConfig = (difficultyId) => {
  return DIFFICULTY_CONFIGS[difficultyId] || DIFFICULTY_CONFIGS.easy;
};

/**
 * Get all difficulty options
 * @returns {Array} Array of difficulty configurations
 */
export const getAllDifficulties = () => {
  return Object.values(DIFFICULTY_CONFIGS);
};

/**
 * Validate difficulty ID
 * @param {string} difficultyId - Difficulty to validate
 * @returns {boolean} True if valid
 */
export const isValidDifficulty = (difficultyId) => {
  return Object.keys(DIFFICULTY_CONFIGS).includes(difficultyId);
};
