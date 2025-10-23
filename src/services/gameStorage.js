/**
 * Game Storage Service
 * Handles localStorage operations for game data persistence
 */

const STORAGE_KEYS = {
  GAME_HISTORY: "magic-memory-history",
  CURRENT_GAME: "magic-memory-current",
  PERFORMANCE_STATS: "magic-memory-stats",
  USER_PREFERENCES: "magic-memory-preferences",
};

class GameStorageService {
  /**
   * Save a completed game session to history
   * @param {Object} session - Game session data
   */
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

  /**
   * Load game history from localStorage
   * @returns {Array} Array of game sessions
   */
  loadGameHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load game history:", error);
      return [];
    }
  }

  /**
   * Save current game state for resume capability
   * @param {Object} gameState - Current game state
   */
  saveCurrentGame(gameState) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save current game:", error);
    }
  }

  /**
   * Load current game state
   * @returns {Object|null} Current game state or null
   */
  loadCurrentGame() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load current game:", error);
      return null;
    }
  }

  /**
   * Clear current game state
   */
  clearCurrentGame() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
    } catch (error) {
      console.error("Failed to clear current game:", error);
    }
  }

  /**
   * Update performance metrics with new game session
   * @param {Object} session - Completed game session
   */
  updatePerformanceMetrics(session) {
    try {
      const metrics = this.loadPerformanceMetrics();

      metrics.totalGamesPlayed += 1;
      metrics.totalTimePlayed += session.timeElapsed;
      metrics.totalStarsEarned += session.stars;

      // Update best scores by difficulty
      if (
        !metrics.bestScoreByDifficulty[session.difficulty] ||
        session.score > metrics.bestScoreByDifficulty[session.difficulty].score
      ) {
        metrics.bestScoreByDifficulty[session.difficulty] = {
          score: session.score,
          timeElapsed: session.timeElapsed,
          stars: session.stars,
          date: session.endTime,
        };
      }

      // Update fastest times by difficulty
      if (
        !metrics.fastestTimeByDifficulty[session.difficulty] ||
        session.timeElapsed < metrics.fastestTimeByDifficulty[session.difficulty]
      ) {
        metrics.fastestTimeByDifficulty[session.difficulty] = session.timeElapsed;
      }

      // Count perfect games (3 stars)
      if (session.stars === 3) {
        metrics.perfectGames += 1;
      }

      // Calculate average score
      const history = this.loadGameHistory();
      const totalScore = history.reduce((sum, game) => sum + game.score, 0);
      metrics.averageScore = totalScore / history.length;

      localStorage.setItem(STORAGE_KEYS.PERFORMANCE_STATS, JSON.stringify(metrics));
    } catch (error) {
      console.error("Failed to update performance metrics:", error);
    }
  }

  /**
   * Load performance metrics
   * @returns {Object} Performance metrics
   */
  loadPerformanceMetrics() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERFORMANCE_STATS);
      return data
        ? JSON.parse(data)
        : {
            totalGamesPlayed: 0,
            totalTimePlayed: 0,
            averageScore: 0,
            bestScoreByDifficulty: {},
            fastestTimeByDifficulty: {},
            totalStarsEarned: 0,
            perfectGames: 0,
            improvementTrend: 0,
          };
    } catch (error) {
      console.error("Failed to load performance metrics:", error);
      return {
        totalGamesPlayed: 0,
        totalTimePlayed: 0,
        averageScore: 0,
        bestScoreByDifficulty: {},
        fastestTimeByDifficulty: {},
        totalStarsEarned: 0,
        perfectGames: 0,
        improvementTrend: 0,
      };
    }
  }

  /**
   * Save user preferences
   * @param {Object} preferences - User preferences
   */
  savePreferences(preferences) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  }

  /**
   * Load user preferences
   * @returns {Object} User preferences
   */
  loadPreferences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data
        ? JSON.parse(data)
        : {
            defaultDifficulty: "medium",
            soundEnabled: true,
            showTimer: true,
            animationSpeed: "normal",
          };
    } catch (error) {
      console.error("Failed to load preferences:", error);
      return {
        defaultDifficulty: "medium",
        soundEnabled: true,
        showTimer: true,
        animationSpeed: "normal",
      };
    }
  }

  /**
   * Clear all game data
   */
  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear all data:", error);
    }
  }

  /**
   * Export all data as JSON string
   * @returns {string} JSON data
   */
  exportData() {
    try {
      const data = {
        history: this.loadGameHistory(),
        currentGame: this.loadCurrentGame(),
        metrics: this.loadPerformanceMetrics(),
        preferences: this.loadPreferences(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Failed to export data:", error);
      return "{}";
    }
  }

  /**
   * Import data from JSON string
   * @param {string} jsonData - JSON data string
   * @returns {boolean} Success status
   */
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);

      if (data.history) {
        localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(data.history));
      }
      if (data.currentGame) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(data.currentGame));
      }
      if (data.metrics) {
        localStorage.setItem(STORAGE_KEYS.PERFORMANCE_STATS, JSON.stringify(data.metrics));
      }
      if (data.preferences) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences));
      }

      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }
}

export const gameStorage = new GameStorageService();
