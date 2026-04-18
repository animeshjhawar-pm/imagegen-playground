"use client";

import React, { createContext, useContext, useReducer, useState } from "react";
import {
  playgroundReducer,
  initialState,
  type PlaygroundState,
  type PlaygroundAction,
} from "@/state/playgroundReducer";

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------
interface PlaygroundContextValue {
  state: PlaygroundState;
  dispatch: React.Dispatch<PlaygroundAction>;
  /** Test Run ON → mocked responses; OFF → real API calls. Default: ON. */
  isDryRun: boolean;
  setIsDryRun: (v: boolean) => void;
}

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playgroundReducer, initialState);
  const [isDryRun, setIsDryRun] = useState(true); // default ON — safe by default

  return (
    <PlaygroundContext.Provider value={{ state, dispatch, isDryRun, setIsDryRun }}>
      {children}
    </PlaygroundContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function usePlayground(): PlaygroundContextValue {
  const ctx = useContext(PlaygroundContext);
  if (!ctx) throw new Error("usePlayground must be used inside PlaygroundProvider");
  return ctx;
}
