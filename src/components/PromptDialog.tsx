"use client";

import { useEffect, useState } from "react";

interface PromptDialogProps {
  isOpen: boolean;
  stepTitle: string;
  flowLabel: string; // "Old flow" | "New flow"
  /** The prompt that would be sent right now (override OR default/interpolated). */
  initialSystemPrompt: string;
  initialUserPrompt: string;
  /** Whether an override is currently active (for badge + reset button). */
  hasOverride: boolean;
  /** When true, the dialog is view-only — editing/save/reset buttons are hidden. */
  readOnly?: boolean;
  /** Closes the dialog with no state change. */
  onCancel: () => void;
  /** Save edits as an override. */
  onSave: (systemPrompt: string, userPrompt: string) => void;
  /** Save edits as an override and re-run the step. */
  onSaveAndRun: (systemPrompt: string, userPrompt: string) => void;
  /** Clear any existing override and close. */
  onResetToDefault: () => void;
}

export function PromptDialog({
  isOpen,
  stepTitle,
  flowLabel,
  initialSystemPrompt,
  initialUserPrompt,
  hasOverride,
  readOnly = false,
  onCancel,
  onSave,
  onSaveAndRun,
  onResetToDefault,
}: PromptDialogProps) {
  const [systemDraft, setSystemDraft] = useState(initialSystemPrompt);
  const [userDraft, setUserDraft] = useState(initialUserPrompt);

  // Reset drafts whenever the dialog reopens with a different step / flow.
  useEffect(() => {
    if (isOpen) {
      setSystemDraft(initialSystemPrompt);
      setUserDraft(initialUserPrompt);
    }
  }, [isOpen, initialSystemPrompt, initialUserPrompt]);

  if (!isOpen) return null;

  const isDirty =
    systemDraft !== initialSystemPrompt || userDraft !== initialUserPrompt;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-[720px] max-w-[95vw] max-h-[85vh] rounded-lg border border-neutral-700
          bg-neutral-900 shadow-2xl shadow-violet-900/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-2 flex-shrink-0">
          <h2 className="text-sm font-semibold text-neutral-100">
            Prompt used for <span className="text-violet-400">{stepTitle}</span>
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            · {flowLabel}
          </span>
          {readOnly && (
            <span
              title="Old flow is the frozen stormbreaker baseline — view only. Edit the new-flow prompt to iterate."
              className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded
                bg-neutral-800 text-neutral-400 cursor-help"
            >
              READ-ONLY · BASELINE
            </span>
          )}
          {!readOnly && hasOverride && (
            <span
              title="Prompt has been edited — running this step uses the edited version instead of the template."
              className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded
                bg-amber-900/60 text-amber-400 cursor-help"
            >
              EDITED
            </span>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4 overflow-auto flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500">
              System Prompt
            </label>
            <textarea
              value={systemDraft}
              readOnly={readOnly}
              onChange={(e) => setSystemDraft(e.target.value)}
              rows={8}
              className="w-full text-[11px] font-mono text-neutral-100 leading-relaxed
                bg-neutral-950 border border-neutral-700 rounded p-2 resize-y
                focus:outline-none focus:ring-1 focus:ring-violet-500
                min-h-[140px] read-only:opacity-90 read-only:cursor-default"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500">
              User Prompt (interpolated)
            </label>
            <textarea
              value={userDraft}
              readOnly={readOnly}
              onChange={(e) => setUserDraft(e.target.value)}
              rows={8}
              className="w-full text-[11px] font-mono text-neutral-100 leading-relaxed
                bg-neutral-950 border border-neutral-700 rounded p-2 resize-y
                focus:outline-none focus:ring-1 focus:ring-violet-500
                min-h-[140px] read-only:opacity-90 read-only:cursor-default"
              spellCheck={false}
            />
            {readOnly ? (
              <p className="text-[10px] text-neutral-500">
                Old flow is locked to the stormbreaker baseline. To change it,
                edit <code className="text-violet-300">src/config/prompts-old-flow.ts</code>{" "}
                — but do so deliberately: changes invalidate past comparisons.
              </p>
            ) : (
              <p className="text-[10px] text-neutral-500">
                This is the fully-interpolated prompt that will be sent. Editing it
                here bypasses the template — inputs will no longer rewrite it until
                you Reset. For a permanent change, edit{" "}
                <code className="text-violet-300">src/config/prompts-new-flow.ts</code>.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 flex items-center gap-2 flex-shrink-0">
          {!readOnly && hasOverride && (
            <button
              onClick={onResetToDefault}
              className="text-[11px] text-neutral-500 hover:text-red-400 underline transition-colors"
            >
              Reset to default prompt
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-800
              text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            {readOnly ? "Close" : "Cancel"}
          </button>
          {!readOnly && (
            <>
              <button
                onClick={() => onSave(systemDraft, userDraft)}
                disabled={!isDirty}
                className="px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-800
                  text-neutral-300 hover:bg-neutral-700 transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={() => onSaveAndRun(systemDraft, userDraft)}
                disabled={!isDirty}
                className="px-3 py-1.5 text-sm rounded font-medium
                  bg-violet-600 text-white hover:bg-violet-500 transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ▶ Save & Re-run
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
