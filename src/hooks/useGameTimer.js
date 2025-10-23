/**
 * useGameTimer Hook
 * Hook for timer state management and service integration
 */

import { useState, useEffect, useCallback } from "react";
import { timerService } from "../services/timerService";

export const useGameTimer = (sessionId, autoStart = false) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Start timer
  const start = useCallback(() => {
    if (sessionId && !isRunning) {
      timerService.startTimer(sessionId);
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [sessionId, isRunning]);

  // Pause timer
  const pause = useCallback(() => {
    if (sessionId && isRunning && !isPaused) {
      timerService.pauseTimer(sessionId);
      setIsPaused(true);
    }
  }, [sessionId, isRunning, isPaused]);

  // Resume timer
  const resume = useCallback(() => {
    if (sessionId && isRunning && isPaused) {
      timerService.resumeTimer(sessionId);
      setIsPaused(false);
    }
  }, [sessionId, isRunning, isPaused]);

  // Stop timer
  const stop = useCallback(() => {
    if (sessionId && isRunning) {
      const finalTime = timerService.stopTimer(sessionId);
      setIsRunning(false);
      setIsPaused(false);
      return finalTime;
    }
    return elapsedTime;
  }, [sessionId, isRunning, elapsedTime]);

  // Reset timer
  const reset = useCallback(() => {
    if (sessionId) {
      timerService.stopTimer(sessionId);
      setElapsedTime(0);
      setFormattedTime("00:00");
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [sessionId]);

  // Subscribe to timer updates
  useEffect(() => {
    if (sessionId && isRunning) {
      const unsubscribe = timerService.onTimerUpdate(sessionId, (elapsed) => {
        setElapsedTime(elapsed);
        setFormattedTime(timerService.getFormattedTime(sessionId));
      });

      return () => {
        unsubscribe();
      };
    }
  }, [sessionId, isRunning]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && sessionId && !isRunning) {
      start();
    }
  }, [autoStart, sessionId, isRunning, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId && isRunning) {
        timerService.stopTimer(sessionId);
      }
    };
  }, [sessionId, isRunning]);

  return {
    elapsedTime,
    formattedTime,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
  };
};
