"use client";

import { useState, useRef, useEffect } from "react";
import type { OutputType } from "@/config/pipelines";

interface CollapsibleFieldProps {
  label: string;
  value: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onResetOverride?: () => void;
  outputType?: OutputType;
  placeholder?: string;
  /** Whether a manual override is active (shows badge + reset button). */
  isManualOverride?: boolean;
  /** Badge text — defaults to "EDITED". */
  overrideBadgeLabel?: string;
  /** Tooltip on the badge. */
  overrideBadgeTooltip?: string;
  /** Reset-link label — defaults to "Reset Override". */
  resetOverrideLabel?: string;
}

function tryFormatJson(value: string): string {
  try { return JSON.stringify(JSON.parse(value), null, 2); }
  catch { return value; }
}

export function CollapsibleField({
  label,
  value,
  readOnly = false,
  onChange,
  onResetOverride,
  outputType,
  placeholder,
  isManualOverride = false,
  overrideBadgeLabel = "EDITED",
  overrideBadgeTooltip = "Manually overridden.",
  resetOverrideLabel = "Reset Override",
}: CollapsibleFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(value);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync draft when value changes externally (e.g. upstream step ran)
  useEffect(() => {
    if (!expanded) {
      setDraft(outputType === "json" ? tryFormatJson(value) : value);
    }
  }, [value, expanded, outputType]);

  // Auto-resize textarea
  useEffect(() => {
    if (expanded && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 400) + "px";
    }
  }, [expanded, draft]);

  const preview = value
    ? value.replace(/\s+/g, " ").slice(0, 60) + (value.length > 60 ? "…" : "")
    : "";
  const isImageUrl = outputType === "image_url" && value?.startsWith("http");

  function handleOpen() {
    setDraft(outputType === "json" ? tryFormatJson(value) : value);
    setExpanded(true);
  }

  function handleSave() {
    if (outputType === "json" && draft.trim()) {
      try { JSON.parse(draft); setJsonError(null); }
      catch { setJsonError("Invalid JSON — fix before saving."); return; }
    }
    onChange?.(draft);
    setExpanded(false);
  }

  function handleCollapse() {
    setDraft(value);
    setJsonError(null);
    setExpanded(false);
  }

  // ── Meta row (label + override badge + reset link + expand button) ──────
  const MetaRow = ({ showExpand }: { showExpand: boolean }) => (
    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
      <span className="text-[10px] uppercase tracking-widest text-neutral-500 truncate">
        {label}
      </span>
      {isManualOverride && (
        <>
          <span
            title={overrideBadgeTooltip}
            className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-900/60 text-amber-400 cursor-help flex-shrink-0"
          >
            {overrideBadgeLabel}
          </span>
          {onResetOverride && (
            <button
              onClick={onResetOverride}
              className="text-[9px] text-neutral-500 hover:text-red-400 underline transition-colors flex-shrink-0"
            >
              {resetOverrideLabel}
            </button>
          )}
        </>
      )}
      {showExpand && value && (
        <button
          onClick={handleOpen}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 ml-auto flex-shrink-0"
        >
          Expand
        </button>
      )}
    </div>
  );

  // ── Collapsed view ───────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <div className="flex flex-col gap-1 min-w-0">
        <MetaRow showExpand />
        {isImageUrl ? (
          <div className="cursor-pointer" onClick={handleOpen}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="output"
              className="w-full max-h-24 object-contain rounded border border-neutral-800" />
          </div>
        ) : value ? (
          <p
            className="text-[11px] text-neutral-400 font-mono leading-relaxed cursor-pointer hover:text-neutral-300 truncate"
            onClick={handleOpen}
          >
            {preview}
          </p>
        ) : (
          <p className="text-[11px] text-neutral-700 italic">{placeholder ?? "—"}</p>
        )}
      </div>
    );
  }

  // ── Expanded view ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        <MetaRow showExpand={false} />
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {!readOnly && (
            <button onClick={handleSave} className="text-[10px] text-green-400 hover:text-green-300">
              Save
            </button>
          )}
          <button onClick={handleCollapse} className="text-[10px] text-neutral-500 hover:text-neutral-300">
            Collapse
          </button>
        </div>
      </div>

      {jsonError && <p className="text-[10px] text-red-400 font-mono">{jsonError}</p>}

      {isImageUrl ? (
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="output"
            className="w-full max-h-64 object-contain rounded border border-neutral-700" />
          <p className="text-[10px] text-neutral-500 font-mono break-all">{value}</p>
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={readOnly ? (outputType === "json" ? tryFormatJson(value) : value) : draft}
          readOnly={readOnly}
          onChange={(e) => { setDraft(e.target.value); setJsonError(null); }}
          className="w-full text-[11px] font-mono text-neutral-200 leading-relaxed
            bg-neutral-950 border border-neutral-700 rounded p-2 resize-none
            focus:outline-none focus:ring-1 focus:ring-violet-500
            min-h-[60px] max-h-[400px] overflow-auto
            read-only:opacity-70 read-only:cursor-default"
          spellCheck={false}
        />
      )}
    </div>
  );
}
