"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayground } from "@/context/PlaygroundContext";
import {
  IMAGE_TYPES_BY_PAGE,
  IMAGE_TYPE_LABELS,
  PIPELINES,
  type PageType,
  type ImageType,
} from "@/config/pipelines";
import { ImportClientDialog } from "./ImportClientDialog";
import { ExportCsvDialog } from "./ExportCsvDialog";

const PAGE_TYPE_OPTIONS: { value: PageType; label: string }[] = [
  { value: "blog",     label: "Blog" },
  { value: "service",  label: "Service" },
  { value: "category", label: "Category" },
  { value: "custom",   label: "Custom (tester)" },
];

export type RunScope = "both" | "old" | "new";

interface TopControlBarProps {
  /** Fire a full-pipeline run across every client, scoped to the chosen
   *  flow(s). `"both"` preserves the original Run All behaviour. */
  onRunAll: (scope: RunScope) => void;
  isRunningAll: boolean;
}

export function TopControlBar({ onRunAll, isRunningAll }: TopControlBarProps) {
  const { state, dispatch } = usePlayground();
  const { pageType, imageType, clients } = state;
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  // True when the dialog was opened automatically because the user just
  // completed a page-type + image-type selection without any clients yet.
  // On cancel, we fall through to adding a blank client so the user
  // always lands on SOMETHING actionable.
  const autoOpenedRef = useRef(false);
  const [runAllMenuOpen, setRunAllMenuOpen] = useState(false);
  const pipeline = pageType && imageType ? PIPELINES[`${pageType}:${imageType}`] : null;

  const imageTypeOptions = pageType ? IMAGE_TYPES_BY_PAGE[pageType] : [];
  const hasSelection    = pageType !== null && imageType !== null;
  const canAddClient    = hasSelection; // Fix 7: disabled until both selected

  // Auto-open Import dialog (Presets tab is the default) the first time
  // the user completes both dropdown selections without any clients. If
  // they cancel without picking anything, we add a blank client so the
  // pipeline table isn't empty. Re-fires if they later remove every
  // client and re-select an image type.
  useEffect(() => {
    if (hasSelection && clients.length === 0 && !importOpen) {
      autoOpenedRef.current = true;
      setImportOpen(true);
    }
  }, [hasSelection, clients.length, importOpen]);

  function handleDialogCancel() {
    const wasAuto = autoOpenedRef.current;
    autoOpenedRef.current = false;
    setImportOpen(false);
    if (wasAuto && clients.length === 0) {
      // Auto-open fallback: user cancelled without selecting → blank client.
      dispatch({ type: "ADD_CLIENT" });
    }
  }

  function handleAddBlankFromDialog() {
    autoOpenedRef.current = false;
    setImportOpen(false);
    dispatch({ type: "ADD_CLIENT" });
  }

  const selectCls = `
    bg-neutral-900 border border-neutral-700 rounded
    text-neutral-100 text-sm px-3 py-1.5
    focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500
    hover:border-violet-500/40 transition-colors cursor-pointer
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  return (
    <div className="border-b border-neutral-800/80 bg-neutral-900/50 px-6 py-4
      flex flex-wrap items-center gap-3">

      {/* Page Type */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-widest text-neutral-500">
          Page Type
        </label>
        <select
          value={pageType ?? ""}
          onChange={(e) =>
            dispatch({ type: "SELECT_PAGE_TYPE", pageType: e.target.value as PageType })
          }
          className={selectCls}
          style={{ minWidth: "130px" }}
        >
          <option value="" disabled>Select…</option>
          {PAGE_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Image Type */}
      <div className="flex flex-col gap-1">
        <label
          className={`text-[10px] uppercase tracking-widest ${
            pageType ? "text-neutral-500" : "text-neutral-700"
          }`}
        >
          Image Type
        </label>
        <select
          value={imageType ?? ""}
          onChange={(e) =>
            dispatch({ type: "SELECT_IMAGE_TYPE", imageType: e.target.value as ImageType })
          }
          disabled={!pageType}
          className={selectCls}
          style={{ minWidth: "210px" }}
        >
          <option value="" disabled>
            {pageType ? "Select image type…" : "Select page type first"}
          </option>
          {imageTypeOptions.map((it) => (
            <option key={it} value={it}>{IMAGE_TYPE_LABELS[it]}</option>
          ))}
        </select>
      </div>

      <div className="flex-1" />

      {/* Import Clients — single form or bulk CSV */}
      <button
        onClick={() => setImportOpen(true)}
        disabled={!canAddClient}
        title={canAddClient ? "Add clients via form or bulk CSV" : "Select Page Type and Image Type first"}
        className="px-3 py-1.5 text-sm rounded
          border border-neutral-700 bg-neutral-800
          text-neutral-300 hover:text-violet-300 hover:border-violet-600/50 hover:bg-neutral-700
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        ⇪ Import…
      </button>

      {/* Add Client — disabled until both dropdowns selected (Fix 7) */}
      <button
        onClick={() => dispatch({ type: "ADD_CLIENT" })}
        disabled={!canAddClient}
        title={canAddClient ? undefined : "Select Page Type and Image Type first"}
        className="px-3 py-1.5 text-sm rounded
          border border-neutral-700 bg-neutral-800
          text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        + Add Blank
      </button>

      {/* Export CSV — opens dialog to pick clients / steps / flows. */}
      <button
        onClick={() => setExportOpen(true)}
        disabled={!hasSelection || clients.length === 0}
        title={
          !hasSelection
            ? "Select Page Type and Image Type first"
            : clients.length === 0
              ? "Add at least one client first"
              : "Pick which clients, steps, and flows to include in the CSV"
        }
        className="px-3 py-1.5 text-sm rounded
          border border-neutral-700 bg-neutral-800
          text-neutral-300 hover:text-violet-300 hover:border-violet-600/50 hover:bg-neutral-700
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        ⤓ Export CSV
      </button>

      {/* Run All — violet primary CTA with scope dropdown. Same pattern
       *  as the per-step column Run-all button; lets the user restrict
       *  the wave to Old / New / both flows. */}
      <div className="relative">
        <button
          onClick={() =>
            setRunAllMenuOpen((v) => !v)
          }
          disabled={!hasSelection || clients.length === 0 || isRunningAll}
          className="px-4 py-1.5 text-sm rounded font-medium
            bg-violet-600 text-white hover:bg-violet-500
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors inline-flex items-center gap-1.5"
        >
          {isRunningAll ? "Running…" : "▶ Run All"}
          {!isRunningAll && (
            <svg viewBox="0 0 12 12" width="9" height="9" fill="currentColor" aria-hidden>
              <path d="M2 4l4 4 4-4H2z" />
            </svg>
          )}
        </button>
        {runAllMenuOpen && hasSelection && clients.length > 0 && !isRunningAll && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setRunAllMenuOpen(false)}
            />
            <div
              className="absolute right-0 top-[calc(100%+6px)] z-40 min-w-[200px]
                rounded border border-neutral-700 bg-neutral-900 shadow-xl shadow-black/50
                py-1"
            >
              <button
                onClick={() => { setRunAllMenuOpen(false); onRunAll("both"); }}
                className="w-full text-left px-3 py-2 text-[12px] text-neutral-100
                  hover:bg-violet-900/50 transition-colors flex items-center gap-2"
              >
                <span className="text-violet-400">▶</span>
                Run all
                <span className="text-[9px] text-neutral-500 uppercase tracking-wider ml-auto">default</span>
              </button>
              <button
                onClick={() => { setRunAllMenuOpen(false); onRunAll("old"); }}
                className="w-full text-left px-3 py-2 text-[12px] text-neutral-300
                  hover:bg-neutral-800 transition-colors"
              >
                Only Old flow
              </button>
              <button
                onClick={() => { setRunAllMenuOpen(false); onRunAll("new"); }}
                className="w-full text-left px-3 py-2 text-[12px] text-neutral-300
                  hover:bg-neutral-800 transition-colors"
              >
                Only New flow
              </button>
            </div>
          </>
        )}
      </div>

      <ImportClientDialog
        isOpen={importOpen}
        onCancel={handleDialogCancel}
        onImport={(seeds) => {
          autoOpenedRef.current = false;
          dispatch({ type: "IMPORT_CLIENTS", seeds });
          setImportOpen(false);
        }}
        onAddBlank={handleAddBlankFromDialog}
        pageType={pageType}
        imageType={imageType}
      />

      <ExportCsvDialog
        isOpen={exportOpen}
        clients={clients}
        pipeline={pipeline}
        pageType={pageType}
        imageType={imageType}
        onCancel={() => setExportOpen(false)}
      />
    </div>
  );
}
