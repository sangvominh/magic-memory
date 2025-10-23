/**
 * Timer Service
 * Manages game timing functionality with callbacks
 */

import { formatTime } from "../utils/timeFormatting";

class TimerService {
  constructor() {
    this.timers = new Map();
    this.MAX_DURATION = 600; // 10 minutes in seconds
  }

  /**
   * Start a new timer for a game session
   * @param {string} sessionId - Game session ID
   */
  startTimer(sessionId) {
    const timer = {
      startTime: Date.now(),
      pausedTime: 0,
      elapsedSeconds: 0,
      isRunning: true,
      isPaused: false,
      callbacks: [],
      interval: null,
    };

    // Start the interval
    timer.interval = setInterval(() => {
      if (!timer.isPaused) {
        const now = Date.now();
        const elapsed = Math.floor((now - timer.startTime - timer.pausedTime) / 1000);
        timer.elapsedSeconds = elapsed;

        // Notify all callbacks
        timer.callbacks.forEach((callback) => callback(elapsed));

        // Auto-stop at max duration
        if (elapsed >= this.MAX_DURATION) {
          this.stopTimer(sessionId);
        }
      }
    }, 1000);

    this.timers.set(sessionId, timer);
  }

  /**
   * Pause a running timer
   * @param {string} sessionId - Game session ID
   */
  pauseTimer(sessionId) {
    const timer = this.timers.get(sessionId);
    if (timer && timer.isRunning && !timer.isPaused) {
      timer.isPaused = true;
      timer.pauseStartTime = Date.now();
    }
  }

  /**
   * Resume a paused timer
   * @param {string} sessionId - Game session ID
   */
  resumeTimer(sessionId) {
    const timer = this.timers.get(sessionId);
    if (timer && timer.isRunning && timer.isPaused) {
      timer.pausedTime += Date.now() - timer.pauseStartTime;
      timer.isPaused = false;
    }
  }

  /**
   * Stop a timer and return elapsed time
   * @param {string} sessionId - Game session ID
   * @returns {number} Elapsed seconds
   */
  stopTimer(sessionId) {
    const timer = this.timers.get(sessionId);
    if (timer) {
      if (timer.interval) {
        clearInterval(timer.interval);
      }
      timer.isRunning = false;
      timer.isPaused = false;

      const elapsedSeconds = timer.elapsedSeconds;
      this.timers.delete(sessionId);
      return elapsedSeconds;
    }
    return 0;
  }

  /**
   * Get elapsed time for a session
   * @param {string} sessionId - Game session ID
   * @returns {number} Elapsed seconds
   */
  getElapsedTime(sessionId) {
    const timer = this.timers.get(sessionId);
    return timer ? timer.elapsedSeconds : 0;
  }

  /**
   * Get formatted time for display
   * @param {string} sessionId - Game session ID
   * @returns {string} Formatted time (MM:SS)
   */
  getFormattedTime(sessionId) {
    const elapsed = this.getElapsedTime(sessionId);
    return formatTime(elapsed);
  }

  /**
   * Check if timer is running
   * @param {string} sessionId - Game session ID
   * @returns {boolean} True if running
   */
  isTimerRunning(sessionId) {
    const timer = this.timers.get(sessionId);
    return timer ? timer.isRunning && !timer.isPaused : false;
  }

  /**
   * Get remaining time until max duration
   * @param {string} sessionId - Game session ID
   * @returns {number} Remaining seconds
   */
  getRemainingTime(sessionId) {
    const elapsed = this.getElapsedTime(sessionId);
    return Math.max(0, this.MAX_DURATION - elapsed);
  }

  /**
   * Subscribe to timer updates
   * @param {string} sessionId - Game session ID
   * @param {Function} callback - Callback function (receives elapsed seconds)
   * @returns {Function} Unsubscribe function
   */
  onTimerUpdate(sessionId, callback) {
    const timer = this.timers.get(sessionId);
    if (timer) {
      timer.callbacks.push(callback);

      // Return unsubscribe function
      return () => {
        const index = timer.callbacks.indexOf(callback);
        if (index > -1) {
          timer.callbacks.splice(index, 1);
        }
      };
    }
    return () => {};
  }

  /**
   * Subscribe to timer limit reached
   * @param {string} sessionId - Game session ID
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onTimerLimit(sessionId, callback) {
    return this.onTimerUpdate(sessionId, (elapsed) => {
      if (elapsed >= this.MAX_DURATION) {
        callback();
      }
    });
  }

  /**
   * Clean up all timers (useful on unmount)
   */
  cleanup() {
    this.timers.forEach((timer, sessionId) => {
      this.stopTimer(sessionId);
    });
    this.timers.clear();
  }
}

export const timerService = new TimerService();
