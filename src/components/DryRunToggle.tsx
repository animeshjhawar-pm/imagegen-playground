"use client";

import { usePlayground } from "@/context/PlaygroundContext";

export function DryRunToggle() {
  const { isDryRun, setIsDryRun } = usePlayground();

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <span className="text-[10px] uppercase tracking-widest text-neutral-500">
          Test Run
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isDryRun}
          onClick={() => setIsDryRun(!isDryRun)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-neutral-950
            ${isDryRun ? "bg-violet-600" : "bg-neutral-700"}`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform
              ${isDryRun ? "translate-x-5" : "translate-x-1"}`}
          />
        </button>
      </label>

      {!isDryRun && (
        <span
          title="Real API calls will fire — costs apply"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold
            bg-red-900/60 text-red-300 border border-red-600/60 animate-pulse"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          LIVE
        </span>
      )}
    </div>
  );
}
