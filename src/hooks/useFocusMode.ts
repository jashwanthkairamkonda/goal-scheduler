import { useState, useEffect, useRef, useCallback } from "react";

export interface FocusSession {
  id: string;
  goalId: string;
  goalTitle: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  completed: boolean;
}

interface FocusModeState {
  isActive: boolean;
  goalId: string | null;
  goalTitle: string;
  remainingSeconds: number;
  totalSeconds: number;
  sessions: FocusSession[];
}

export function useFocusMode() {
  const [state, setState] = useState<FocusModeState>({
    isActive: false,
    goalId: null,
    goalTitle: "",
    remainingSeconds: 0,
    totalSeconds: 0,
    sessions: JSON.parse(localStorage.getItem("focus-sessions") || "[]"),
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Tick countdown
  useEffect(() => {
    if (!state.isActive) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.remainingSeconds <= 1) {
          // Timer ended
          return { ...prev, remainingSeconds: 0, isActive: false };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearTimer();
  }, [state.isActive, clearTimer]);

  // Handle timer completion
  useEffect(() => {
    if (!state.isActive && state.totalSeconds > 0 && state.remainingSeconds === 0 && startTimeRef.current) {
      const session: FocusSession = {
        id: crypto.randomUUID(),
        goalId: state.goalId || "",
        goalTitle: state.goalTitle,
        startTime: startTimeRef.current,
        endTime: new Date(),
        durationMinutes: Math.round(state.totalSeconds / 60),
        completed: true,
      };
      startTimeRef.current = null;
      setState((prev) => {
        const sessions = [...prev.sessions, session];
        localStorage.setItem("focus-sessions", JSON.stringify(sessions));
        return { ...prev, sessions, totalSeconds: 0 };
      });
    }
  }, [state.isActive, state.remainingSeconds, state.totalSeconds, state.goalId, state.goalTitle]);

  // Browser notification on completion
  useEffect(() => {
    if (!state.isActive && state.totalSeconds === 0 && state.sessions.length > 0) {
      const last = state.sessions[state.sessions.length - 1];
      if (last?.completed && Date.now() - new Date(last.endTime).getTime() < 2000) {
        if (Notification.permission === "granted") {
          new Notification("Focus Mode Complete! 🎉", {
            body: `Great work on "${last.goalTitle}"! You focused for ${last.durationMinutes} minutes.`,
          });
        }
      }
    }
  }, [state.sessions, state.isActive, state.totalSeconds]);

  const startFocus = useCallback((goalId: string, goalTitle: string, durationMinutes: number) => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    startTimeRef.current = new Date();
    const totalSeconds = durationMinutes * 60;
    setState((prev) => ({
      ...prev,
      isActive: true,
      goalId,
      goalTitle,
      remainingSeconds: totalSeconds,
      totalSeconds,
    }));
  }, []);

  const endFocus = useCallback(() => {
    clearTimer();
    const session: FocusSession = {
      id: crypto.randomUUID(),
      goalId: state.goalId || "",
      goalTitle: state.goalTitle,
      startTime: startTimeRef.current || new Date(),
      endTime: new Date(),
      durationMinutes: Math.round((state.totalSeconds - state.remainingSeconds) / 60),
      completed: false,
    };
    startTimeRef.current = null;
    setState((prev) => {
      const sessions = [...prev.sessions, session];
      localStorage.setItem("focus-sessions", JSON.stringify(sessions));
      return {
        ...prev,
        isActive: false,
        goalId: null,
        goalTitle: "",
        remainingSeconds: 0,
        totalSeconds: 0,
        sessions,
      };
    });
  }, [clearTimer, state.goalId, state.goalTitle, state.totalSeconds, state.remainingSeconds]);

  return {
    isActive: state.isActive,
    goalTitle: state.goalTitle,
    remainingSeconds: state.remainingSeconds,
    totalSeconds: state.totalSeconds,
    sessions: state.sessions,
    justCompleted:
      !state.isActive && state.totalSeconds === 0 && state.sessions.length > 0 &&
      state.sessions[state.sessions.length - 1]?.completed &&
      Date.now() - new Date(state.sessions[state.sessions.length - 1].endTime).getTime() < 5000,
    startFocus,
    endFocus,
  };
}
