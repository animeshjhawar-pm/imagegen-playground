"use client";

import React, { createContext, useContext, useReducer } from "react";
import {
  playgroundReducer,
  initialState,
  type PlaygroundState,
  type PlaygroundAction,
} from "@/state/playgroundReducer";

// ---------------------------------------------------------------------------
// Context value
//
// Dry-run / test-run mode was removed on 2026-04-24 — the playground now
// always hits real providers. The previous `isDryRun` toggle was hiding
// real failures (silent empty Portkey responses, etc.) behind mocked
// outputs.
// ---------------------------------------------------------------------------
interface PlaygroundContextValue {
  state: PlaygroundState;
  dispatch: React.Dispatch<PlaygroundAction>;
}

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playgroundReducer, initialState);

  return (
    <PlaygroundContext.Provider value={{ state, dispatch }}>
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
