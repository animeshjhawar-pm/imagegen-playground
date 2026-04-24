"use client";

import { useMemo, useState } from "react";
import type { ClientState } from "@/state/playgroundReducer";
import type { PipelineDefinition } from "@/config/pipelines";
import {
  buildOutputsCsv,
  countExportRows,
  downloadCsv,
  type CsvExportOptions,
} from "@/lib/exportCsv";

interface ExportCsvDialogProps {
  isOpen: boolean;
  clients: ClientState[];
  pipeline: PipelineDefinition | null;
  /** Used for the filename prefix. */
  pageType: string | null;
  imageType: string | null;
  onCancel: () => void;
}

export function ExportCsvDialog({
  isOpen, clients, pipeline, pageType, imageType, onCancel,
}: ExportCsvDialogProps) {
  const initialClientIds = useMemo(
    () => new Set(clients.map((c) => c.id)),
    [clients]
  );
  const initialStepNames = useMemo(
    () => new Set(pipeline?.steps.map((s) => s.name) ?? []),
    [pipeline]
  );

  const [selectedClientIds, setSelectedClientIds] =
    useState<Set<string>>(initialClientIds);
  const [selectedStepNames, setSelectedStepNames] =
    useState<Set<string>>(initialStepNames);
  const [includeOld, setIncludeOld] = useState(true);
  const [includeNew, setIncludeNew] = useState(true);

  // Re-seed selections when the dialog opens with a new client/pipeline set.
  // Tracking via a key prop would also work; this is simpler.
  const [lastSignature, setLastSignature] = useState<string>("");
  const signature = JSON.stringify({
    cs: [...initialClientIds].sort(),
    st: [...initialStepNames].sort(),
  });
  if (isOpen && signature !== lastSignature) {
    setLastSignature(signature);
    setSelectedClientIds(new Set(initialClientIds));
    setSelectedStepNames(new Set(initialStepNames));
  }

  if (!isOpen || !pipeline) return null;

  const opts: CsvExportOptions = {
    clientIds: selectedClientIds,
    stepNames: selectedStepNames,
    includeOldFlow: includeOld,
    includeNewFlow: includeNew,
  };
  const rowCount = countExportRows(clients, opts);
  const canExport =
    rowCount > 0 &&
    selectedStepNames.size > 0 &&
    (includeOld || includeNew);

  function toggleClient(id: string) {
    setSelectedClientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function toggleStep(name: string) {
    setSelectedStepNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function handleExport() {
    if (!canExport || !pipeline) return;
    const csv = buildOutputsCsv(clients, pipeline, opts);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadCsv(
      `imagegen-outputs-${pageType ?? "page"}-${imageType ?? "image"}-${stamp}.csv`,
      csv
    );
    onCancel();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-[560px] max-w-[95vw] max-h-[85vh] rounded-lg border border-neutral-700 bg-neutral-900
          shadow-2xl shadow-violet-900/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-3 flex-shrink-0">
          <h2 className="text-sm font-semibold text-neutral-100">Export outputs to CSV</h2>
          <span className="text-[11px] text-neutral-500">
            {pageType}:{imageType} · {clients.length} client{clients.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-auto flex-1 flex flex-col gap-4">
          {/* Flows */}
          <Section title="Flows">
            <CheckItem
              checked={includeOld}
              onChange={() => setIncludeOld((v) => !v)}
              label="Old flow"
              hint="Existing production pipeline"
            />
            <CheckItem
              checked={includeNew}
              onChange={() => setIncludeNew((v) => !v)}
              label="New flow"
              hint="Experimental / revised pipeline"
            />
          </Section>

          {/* Steps */}
          <Section
            title="Steps (columns)"
            onSelectAll={() => setSelectedStepNames(new Set(initialStepNames))}
            onClear={() => setSelectedStepNames(new Set())}
            count={`${selectedStepNames.size} / ${initialStepNames.size}`}
          >
            <div className="grid grid-cols-1 gap-1">
              {pipeline.steps.map((step, i) => (
                <CheckItem
                  key={step.name}
                  checked={selectedStepNames.has(step.name)}
                  onChange={() => toggleStep(step.name)}
                  label={
                    <span className="flex items-center gap-2">
                      <span className="text-neutral-600 font-mono text-[10px]">{i + 1}.</span>
                      <span>{step.title}</span>
                      <code className="text-[10px] text-neutral-600 font-mono">{step.name}</code>
                    </span>
                  }
                />
              ))}
            </div>
          </Section>

          {/* Clients */}
          <Section
            title="Clients (rows)"
            onSelectAll={() => setSelectedClientIds(new Set(initialClientIds))}
            onClear={() => setSelectedClientIds(new Set())}
            count={`${selectedClientIds.size} / ${clients.length}`}
          >
            <div className="rounded border border-neutral-800 bg-neutral-950/40 max-h-[180px] overflow-auto">
              <ul className="divide-y divide-neutral-800/70">
                {clients.map((c) => (
                  <li key={c.id}>
                    <CheckItem
                      checked={selectedClientIds.has(c.id)}
                      onChange={() => toggleClient(c.id)}
                      label={
                        <span className="flex-1 min-w-0">
                          <span className="text-xs text-neutral-200 truncate">{c.name}</span>
                          <span className="ml-2 text-[10px] text-neutral-600 font-mono">{c.id}</span>
                        </span>
                      }
                      padded
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] text-neutral-500">
            {rowCount} row{rowCount === 1 ? "" : "s"} · {selectedStepNames.size} column{selectedStepNames.size === 1 ? "" : "s"}
          </span>
          <div className="flex-1" />
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-800
              text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!canExport}
            className="px-3 py-1.5 text-sm rounded font-medium
              bg-violet-600 text-white hover:bg-violet-500 transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⤓ Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Local UI helpers — inline, component-scoped.
// ---------------------------------------------------------------------------

function Section({
  title, count, onSelectAll, onClear, children,
}: {
  title: string;
  count?: string;
  onSelectAll?: () => void;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <h3 className="text-[10px] uppercase tracking-widest text-neutral-500">{title}</h3>
        {count && <span className="text-[10px] text-neutral-600 font-mono">{count}</span>}
        <div className="flex-1" />
        {onSelectAll && (
          <button onClick={onSelectAll} className="text-[11px] text-violet-300 hover:text-violet-200">
            Select all
          </button>
        )}
        {onSelectAll && onClear && <span className="text-neutral-700 text-[11px]">·</span>}
        {onClear && (
          <button onClick={onClear} className="text-[11px] text-neutral-400 hover:text-neutral-200">
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function CheckItem({
  checked, onChange, label, hint, padded,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  hint?: string;
  padded?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer hover:bg-neutral-900/60 rounded transition-colors ${
        padded ? "px-3 py-2" : "px-1 py-1"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-violet-500"
      />
      <span className="text-xs text-neutral-200 flex-1 min-w-0">{label}</span>
      {hint && <span className="text-[10px] text-neutral-500">{hint}</span>}
    </label>
  );
}
