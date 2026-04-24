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
  /**
   * When present, renders a <select> dropdown inline instead of the
   * expand/textarea flow. Used for enumerated values like aspect_ratio.
   */
  options?: string[];
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
  options,
}: CollapsibleFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(value);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "ok" | "err">("idle");
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

  async function handleCopy() {
    if (!value) return;
    // Pretty-print JSON when copying so the clipboard payload is readable.
    const payload = outputType === "json" ? tryFormatJson(value) : value;
    try {
      await navigator.clipboard.writeText(payload);
      setCopyFeedback("ok");
    } catch {
      setCopyFeedback("err");
    }
    setTimeout(() => setCopyFeedback("idle"), 1500);
  }

  function CopyButton() {
    if (!value) return null;
    const tone =
      copyFeedback === "ok"  ? "text-green-400" :
      copyFeedback === "err" ? "text-red-400"   :
                                "text-neutral-500 hover:text-neutral-200";
    const title =
      copyFeedback === "ok"  ? "Copied" :
      copyFeedback === "err" ? "Copy failed" :
                                "Copy to clipboard";
    return (
      <button
        onClick={(e) => { e.stopPropagation(); void handleCopy(); }}
        title={title}
        aria-label={title}
        className={`inline-flex items-center flex-shrink-0 transition-colors ${tone}`}
      >
        {copyFeedback === "ok" ? (
          // Checkmark — visible confirmation that the clipboard write succeeded.
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            className="w-3.5 h-3.5">
            <path fillRule="evenodd"
              d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"
              clipRule="evenodd" />
          </svg>
        ) : copyFeedback === "err" ? (
          // X icon — clipboard write rejected (insecure context / permission).
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            className="w-3.5 h-3.5">
            <path fillRule="evenodd"
              d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 11.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"
              clipRule="evenodd" />
          </svg>
        ) : (
          // Clipboard — idle state.
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            className="w-3.5 h-3.5">
            <path d="M3.5 2A1.5 1.5 0 002 3.5v8A1.5 1.5 0 003.5 13h1V11.5h-1A1.5 1.5 0 013 10V4.5A1.5 1.5 0 014.5 3H10V2H3.5z"/>
            <path d="M5.5 4A1.5 1.5 0 004 5.5v8A1.5 1.5 0 005.5 15h7a1.5 1.5 0 001.5-1.5v-8A1.5 1.5 0 0012.5 4h-7zm0 1.5h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5z"/>
          </svg>
        )}
      </button>
    );
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
      {showExpand && (!readOnly || value) && (
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <CopyButton />
          {!readOnly && (
            <button
              onClick={handleOpen}
              className="text-[10px] text-indigo-400 hover:text-indigo-300"
            >
              {value ? "Expand" : "Edit"}
            </button>
          )}
          {readOnly && value && (
            <button
              onClick={handleOpen}
              className="text-[10px] text-indigo-400 hover:text-indigo-300"
            >
              Expand
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ── Dropdown view (enumerated values like aspect_ratio) ─────────────────
  // Skip the expand/textarea flow entirely when `options` is provided;
  // render a labelled <select> inline so the value is always visible.
  if (options && options.length > 0) {
    return (
      <div className="flex flex-col gap-1 min-w-0">
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
        </div>
        <select
          value={value}
          disabled={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full text-[11px] font-mono text-neutral-200
            bg-neutral-950 border border-neutral-700 rounded px-2 py-1.5
            focus:outline-none focus:ring-1 focus:ring-violet-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder ?? "— select —"}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

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
          // Empty state — clickable when editable so users can start typing
          // a value directly without any upstream step having run.
          <p
            className={`text-[11px] italic ${
              readOnly
                ? "text-neutral-700"
                : "text-neutral-600 cursor-pointer hover:text-indigo-300 underline decoration-neutral-800 decoration-dotted underline-offset-4"
            }`}
            onClick={readOnly ? undefined : handleOpen}
          >
            {readOnly ? (placeholder ?? "—") : "— click to type a value —"}
          </p>
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
          <CopyButton />
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
