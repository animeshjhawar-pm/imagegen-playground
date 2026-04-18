"use client";

import { formatCost } from "@/lib/costEstimates";

interface ConfirmRunAllModalProps {
  isOpen: boolean;
  stepCount: number;
  estimatedCost: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmRunAllModal({
  isOpen, stepCount, estimatedCost, onCancel, onConfirm,
}: ConfirmRunAllModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-[420px] max-w-[90vw] rounded-lg border border-neutral-700 bg-neutral-900 shadow-2xl
          shadow-violet-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold
              bg-red-900/60 text-red-300 border border-red-600/60">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              LIVE
            </span>
            <h2 className="text-sm font-semibold text-neutral-100">
              Run All — real API calls
            </h2>
          </div>
        </div>

        <div className="px-5 py-4 text-sm text-neutral-300 space-y-3">
          <p>
            Test Run is <span className="text-red-400 font-semibold">OFF</span>.
            This will fire real calls to Firecrawl, Portkey, and Replicate.
          </p>
          <div className="rounded border border-neutral-800 bg-neutral-950/60 p-3 text-[12px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">Steps to run</span>
              <span className="text-neutral-100">{stepCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Estimated cost</span>
              <span className="text-neutral-100">{formatCost(estimatedCost)}</span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500">
            Estimates are order-of-magnitude, not exact billing.
          </p>
        </div>

        <div className="px-5 py-3 border-t border-neutral-800 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-800
              text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded font-medium
              bg-violet-600 text-white hover:bg-violet-500 transition-colors"
          >
            Run for real
          </button>
        </div>
      </div>
    </div>
  );
}
