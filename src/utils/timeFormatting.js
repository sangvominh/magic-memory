/**
 * Time Formatting Utilities
 * Handles time display formatting for game timer
 */

import { format, addSeconds } from "date-fns";

/**
 * Format seconds into MM:SS format
 * @param {number} seconds - Number of seconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatTime = (seconds) => {
  if (typeof seconds !== "number" || seconds < 0) {
    return "00:00";
  }

  const date = addSeconds(new Date(0), seconds);
  return format(date, "mm:ss");
};

/**
 * Format milliseconds into MM:SS format
 * @param {number} milliseconds - Number of milliseconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatMilliseconds = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  return formatTime(seconds);
};

/**
 * Parse MM:SS format to seconds
 * @param {string} timeString - Time in MM:SS format
 * @returns {number} Number of seconds
 */
export const parseTimeToSeconds = (timeString) => {
  const parts = timeString.split(":");
  if (parts.length !== 2) return 0;

  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;

  return minutes * 60 + seconds;
};

/**
 * Get human-readable duration description
 * @param {number} seconds - Number of seconds
 * @returns {string} Human-readable duration
 */
export const getReadableDuration = (seconds) => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};
