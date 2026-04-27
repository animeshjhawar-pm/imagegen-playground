"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePlayground } from "@/context/PlaygroundContext";
import type { PipelineDefinition, PageType, ImageType } from "@/config/pipelines";
import type { ClientState, PlaygroundAction } from "@/state/playgroundReducer";
import { FlowRow } from "./FlowRow";
import { CompareViewDialog } from "./CompareViewDialog";

// ---------------------------------------------------------------------------
// Inline SVG chevrons — no lucide-react dep
// ---------------------------------------------------------------------------
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className={className ?? "w-4 h-4"}>
      <path fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd" />
    </svg>
  );
}
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className={className ?? "w-4 h-4"}>
      <path fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function flowStepSummary(
  flow: ClientState["oldFlow"],
  stepNames: string[]
): string {
  const done = stepNames.filter(
    (n) => flow.stepStates[n]?.status === "completed"
  ).length;
  return `${done}/${stepNames.length}`;
}

/** Aggregate completion across every new-flow lane. */
function newFlowsSummary(
  flows: ClientState["newFlows"],
  stepNames: string[]
): string {
  if (flows.length === 0) return "0/0";
  const totalCells = stepNames.length * flows.length;
  let done = 0;
  for (const flow of flows) {
    for (const n of stepNames) {
      if (flow.stepStates[n]?.status === "completed") done += 1;
    }
  }
  return `${done}/${totalCells}`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ClientGroupProps {
  client: ClientState;
  /** Display-only 1-based position in the client list (prefixed to the name). */
  position: number;
  pipeline: PipelineDefinition;
  pageType: PageType;
  imageType: ImageType;
  colSpan: number;
  isLastAdded: boolean;
  /** Run the full pipeline left-to-right for one (client, flow, lane). */
  onRunRow: (clientId: string, flowType: "old" | "new", flowIndex: number) => void;
  /** Global run scope — null = idle, "all" = full Run All, otherwise the
   *  step-name being column-run. */
  runningScope: null | "all" | string;
  /** Row-scope keys for in-flight per-row runs (multiple may run
   *  concurrently). */
  runningRows: ReadonlySet<string>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ClientGroup({
  client, position, pipeline, pageType, imageType, colSpan, isLastAdded,
  onRunRow, runningScope, runningRows,
}: ClientGroupProps) {
  const { dispatch } = usePlayground();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(client.name);
  // Which Compare dialog (if any) is open. The merged blog:cover_thumbnail
  // pipeline produces TWO image outputs per flow (16:9 cover + 3:2
  // thumbnail), each with its own Compare CTA; everything else uses the
  // single `generate_image` step.
  const [compareKind, setCompareKind] =
    useState<null | "generate_image" | "generate_cover_image" | "generate_thumbnail_image">(null);
  const headerRowRef = useRef<HTMLTableRowElement>(null);

  // Helper — picks the newFlows[0] output for a given image-gen step
  // name. We always use lane 0 for the "New" side so the CTA stays
  // stable when the user has added extra New lanes.
  const genOutput = (stepName: string, side: "old" | "new") =>
    (side === "new"
      ? client.newFlows[0]?.stepStates?.[stepName]?.output
      : client.oldFlow?.stepStates?.[stepName]?.output
    )?.trim() ?? "";

  const isCoverThumb = pageType === "blog" && imageType === "cover_thumbnail";
  // Service amp-up uses different step names per flow: old-flow
  // refined image lives at show_refined_image; new-flow generated
  // image lives at the regular generate_image step.
  const isAmpUp = pageType === "service" && imageType === "amp_up";

  // For non-amp_up pipelines old + new both come from generate_image.
  // For amp_up, old comes from show_refined_image and new from generate_image.
  const singleNewOut  = genOutput("generate_image", "new");
  const singleOldOut  = isAmpUp
    ? genOutput("show_refined_image", "old")
    : genOutput("generate_image", "old");
  const coverNewOut   = genOutput("generate_cover_image", "new");
  const coverOldOut   = genOutput("generate_cover_image", "old");
  const thumbNewOut   = genOutput("generate_thumbnail_image", "new");
  const thumbOldOut   = genOutput("generate_thumbnail_image", "old");

  // One CTA per comparison, gated on both sides having output. When
  // the pipeline has no old flow at all (custom tester) there's
  // nothing to compare, so all CTAs are suppressed.
  const hasOldFlow = !pipeline.omitOldFlow;
  const canCompareSingle    = hasOldFlow && !isCoverThumb && !!singleNewOut && !!singleOldOut;
  const canCompareCover     = hasOldFlow && isCoverThumb  && !!coverNewOut  && !!coverOldOut;
  const canCompareThumbnail = hasOldFlow && isCoverThumb  && !!thumbNewOut  && !!thumbOldOut;

  // Map the currently-open dialog back to its pair.
  const compareImages = (() => {
    switch (compareKind) {
      case "generate_image":           return { newUrl: singleNewOut, oldUrl: singleOldOut, label: isAmpUp ? " · Amp-Up Refine vs Generate" : "" };
      case "generate_cover_image":     return { newUrl: coverNewOut,  oldUrl: coverOldOut,  label: " · Cover (16:9)" };
      case "generate_thumbnail_image": return { newUrl: thumbNewOut,  oldUrl: thumbOldOut,  label: " · Thumbnail (3:2)" };
      default: return null;
    }
  })();

  // Picker step output (shared across flows) — the human-readable
  // description the user selected as the seed for Build Image Prompt.
  // Surfaced in the Compare dialog so reviewers know what brief the two
  // images were generated against.
  const pickerStep = pipeline.steps.find((s) => s.picker);
  const inputDescription = pickerStep
    ? (
        client.oldFlow?.stepStates?.[pickerStep.name]?.output ??
        client.newFlows[0]?.stepStates?.[pickerStep.name]?.output ??
        ""
      ).trim()
    : "";

  // Fix 8: scroll into view for newly-added clients
  useEffect(() => {
    if (isLastAdded) {
      headerRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const t = setTimeout(() => dispatch({ type: "CLEAR_LAST_ADDED" }), 600);
      return () => clearTimeout(t);
    }
  }, [isLastAdded, dispatch]);

  const stepNames = pipeline.steps.map((s) => s.name);
  const oldSummary = flowStepSummary(client.oldFlow, stepNames);
  const newSummary = newFlowsSummary(client.newFlows, stepNames);
  const laneCount = client.newFlows.length;

  // Fix 3: count filled context fields for the panel header badge
  const filledCtx = pipeline.clientContextFields.filter(
    (f) => (client.context[f.name] ?? "").trim() !== ""
  ).length;
  const totalCtx = pipeline.clientContextFields.length;

  function commitName() {
    dispatch({ type: "UPDATE_CLIENT_NAME", clientId: client.id, name: nameDraft });
    setEditingName(false);
  }

  // ── Chevron A: client header row ─────────────────────────────────────────
  return (
    <>
      <tr
        ref={headerRowRef}
        // When the client group is collapsed, the whole row is a click
        // target so users don't have to aim for the small chevron. When
        // expanded, clicks pass through so inline controls (rename /
        // Remove / Chevron A) keep working normally.
        onClick={
          client.isCollapsed
            ? () => dispatch({ type: "TOGGLE_CLIENT_COLLAPSE", clientId: client.id })
            : undefined
        }
        className={`border-b border-neutral-800 bg-neutral-900 sticky top-[41px] z-[5] ${
          client.isCollapsed ? "cursor-pointer hover:bg-neutral-800/70 transition-colors" : ""
        }`}
      >
        <td colSpan={colSpan} className="px-5 py-4">
          <div className="flex items-center gap-0">
            {/* Chevron A — collapses entire client group */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "TOGGLE_CLIENT_COLLAPSE", clientId: client.id });
              }}
              className="w-5 h-5 flex items-center justify-center mr-3 rounded
                text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors flex-shrink-0"
              title={client.isCollapsed ? "Expand client" : "Collapse client"}
            >
              {client.isCollapsed
                ? <ChevronRight className="w-4 h-4" />
                : <ChevronDown  className="w-4 h-4" />}
            </button>

            {/* Client name — click to edit inline */}
            {editingName ? (
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitName();
                  if (e.key === "Escape") { setNameDraft(client.name); setEditingName(false); }
                }}
                className="bg-transparent border-b border-violet-500 text-neutral-100
                  text-lg font-semibold focus:outline-none px-0 py-0 min-w-[140px]"
              />
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setEditingName(true); }}
                className="group flex items-center gap-1.5 text-lg font-semibold ml-1
                  text-neutral-100 hover:text-violet-300 transition-colors"
                title="Click to rename"
              >
                <span className="text-neutral-500 font-mono text-base tabular-nums">
                  {position}.
                </span>
                <span>{client.name}</span>
                {/* pencil icon — visible on hover */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                  className="w-3.5 h-3.5 text-neutral-600 group-hover:text-violet-400 transition-colors">
                  <path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L6.75 6.774a2.75 2.75 0 00-.596.892l-.79 2.107a.75.75 0 00.966.966l2.108-.79a2.75 2.75 0 00.892-.597l4.261-4.262a1.75 1.75 0 000-2.477zM3.75 11a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z" />
                </svg>
              </button>
            )}

            {/* Compact status summary when collapsed */}
            {client.isCollapsed && (
              <span className="ml-4 text-[11px] text-neutral-500 font-mono">
                {newSummary} steps (New) · {oldSummary} (Old)
              </span>
            )}

            <div className="flex-1" />

            {/* Compare View CTAs — each surfaces only when BOTH old and
             *  new flow have produced non-empty output for that step.
             *  Regular pipelines get a single button; the merged
             *  blog:cover_thumbnail pipeline gets two (one per aspect
             *  ratio) since it renders two images per flow. */}
            {canCompareSingle && (
              <CompareButton
                label="Compare View"
                title="Open the new vs. old generate_image output side-by-side"
                onClick={(e) => { e.stopPropagation(); setCompareKind("generate_image"); }}
              />
            )}
            {canCompareCover && (
              <CompareButton
                label="Compare Cover (16:9)"
                title="Old vs. new 16:9 cover image"
                onClick={(e) => { e.stopPropagation(); setCompareKind("generate_cover_image"); }}
              />
            )}
            {canCompareThumbnail && (
              <CompareButton
                label="Compare Thumbnail (3:2)"
                title="Old vs. new 3:2 thumbnail image"
                onClick={(e) => { e.stopPropagation(); setCompareKind("generate_thumbnail_image"); }}
              />
            )}

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "REMOVE_CLIENT", clientId: client.id });
              }}
              className="text-xs text-neutral-500 hover:text-red-400 transition-colors ml-4"
              title="Remove client"
            >
              ✕ Remove
            </button>
          </div>
        </td>
      </tr>

      {/* Everything below is hidden when Chevron A collapses the group */}
      {!client.isCollapsed && (
        <>
          {/* ── Chevron B: context panel ────────────────────────────────── */}
          {/* Indented with ml-8 so it's visually nested under Chevron A.
           *  Whole row is clickable so users can toggle without aiming
           *  for the small chevron/label exactly. */}
          <tr
            className="border-b border-neutral-800/60 bg-neutral-950/60 cursor-pointer
              hover:bg-neutral-900/60 transition-colors group/ctxrow"
            onClick={() =>
              dispatch({ type: "TOGGLE_CLIENT_CONTEXT_COLLAPSE", clientId: client.id })
            }
          >
            <td colSpan={colSpan} className="px-5 py-1.5">
              <div className="ml-8 flex items-center gap-1.5 select-none">
                {/* Chevron B — smaller than Chevron A */}
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0
                  text-neutral-500 group-hover/ctxrow:text-neutral-300 transition-colors">
                  {client.isContextCollapsed
                    ? <ChevronRight className="w-3.5 h-3.5" />
                    : <ChevronDown  className="w-3.5 h-3.5" />}
                </span>
                <span className="text-xs font-medium tracking-wider uppercase text-neutral-400
                  group-hover/ctxrow:text-neutral-200 transition-colors">
                  Client Context
                </span>
                <span className="text-neutral-600 text-xs">·</span>
                <span className="text-[10px] text-neutral-600 font-mono">
                  {filledCtx}/{totalCtx} filled
                </span>
              </div>
            </td>
          </tr>

          {/* Context fields panel */}
          {!client.isContextCollapsed && (
            <tr className="border-b border-neutral-800/60">
              <td colSpan={colSpan} className="px-5 py-3 bg-neutral-950/30">
                <ClientContextFieldsPanel
                  client={client}
                  pipeline={pipeline}
                  dispatch={dispatch}
                />
              </td>
            </tr>
          )}

          {/* Old flow — always exactly one lane, rendered as the first row
           *  so shared (rowspan'd) cells like the Choose Image Description
           *  picker attach to it. Hidden entirely on pipelines flagged
           *  `omitOldFlow` (custom tester pipeline). */}
          {!pipeline.omitOldFlow && (
            <FlowRow flowType="old" client={client} pipeline={pipeline}
              pageType={pageType} imageType={imageType}
              isFirstFlowRow={true}
              totalFlowRows={1 + laneCount}
              onRunRow={onRunRow}
              runningScope={runningScope}
              runningRows={runningRows} />
          )}

          {/* New flow lanes — one row per entry in client.newFlows.
           *  Added lanes (index > 0) carry a trash icon; the last lane
           *  also carries the "+ Add lane" button. */}
          {client.newFlows.map((_, idx) => {
            const isLast = idx === laneCount - 1;
            const canRemove = idx > 0;
            // When the pipeline omits the old flow, the new flow's first
            // lane becomes the row that "owns" the rowspan'd picker
            // cells. Otherwise the old-flow row is always first.
            const isAnchorRow = !!pipeline.omitOldFlow && idx === 0;
            const totalRows   = pipeline.omitOldFlow ? laneCount : 1 + laneCount;
            return (
              <FlowRow
                key={`new-${idx}`}
                flowType="new"
                flowIndex={idx}
                client={client}
                pipeline={pipeline}
                pageType={pageType}
                imageType={imageType}
                isFirstFlowRow={isAnchorRow}
                totalFlowRows={totalRows}
                onRunRow={onRunRow}
                runningScope={runningScope}
                runningRows={runningRows}
                labelAdornment={
                  (canRemove || isLast) ? (
                    <div className="flex items-center gap-1">
                      {canRemove && (
                        <button
                          onClick={() =>
                            dispatch({ type: "REMOVE_NEW_FLOW", clientId: client.id, flowIndex: idx })
                          }
                          title={`Remove lane "New ${idx + 1}"`}
                          aria-label={`Remove New lane ${idx + 1}`}
                          className="w-5 h-5 flex items-center justify-center rounded
                            text-neutral-500 hover:text-red-300 hover:bg-red-900/40
                            border border-neutral-800 hover:border-red-900/60 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            className="w-3 h-3">
                            <path fillRule="evenodd"
                              d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"
                              clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      {isLast && (
                        <button
                          onClick={() => dispatch({ type: "ADD_NEW_FLOW", clientId: client.id })}
                          title={`Add another New lane (will be labeled "New ${laneCount + 1}")`}
                          aria-label="Add another new flow lane"
                          className="w-5 h-5 flex items-center justify-center rounded
                            text-indigo-400 hover:text-indigo-200 hover:bg-indigo-900/40
                            border border-dashed border-indigo-900/60 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            className="w-3 h-3">
                            <path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : null
                }
              />
            );
          })}
        </>
      )}
      {/* Compare dialog — portaled to <body> so it escapes the <tbody>
       *  ancestor (non-<tr> children are invalid there). The single
       *  dialog is reused for all compare variants; the active pair
       *  is resolved via `compareImages` above. */}
      {compareImages && typeof document !== "undefined" && createPortal(
        <CompareViewDialog
          isOpen={true}
          clientName={`${client.name}${compareImages.label}`}
          newImageUrl={compareImages.newUrl}
          oldImageUrl={compareImages.oldUrl}
          inputDescription={inputDescription}
          onClose={() => setCompareKind(null)}
        />,
        document.body,
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function CompareButton({
  label,
  title,
  onClick,
}: {
  label: string;
  title: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="text-xs px-2 py-1 rounded font-medium mr-2
        border border-violet-700/60 bg-violet-950/40 text-violet-200
        hover:bg-violet-900/60 hover:border-violet-500/80
        transition-colors inline-flex items-center gap-1.5"
    >
      <span aria-hidden>⧉</span>
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Context fields panel — renders the always-visible fields in a 2-col grid
// and tucks the advanced stormbreaker-input JSON fields behind a disclosure.
// ---------------------------------------------------------------------------

function ClientContextFieldsPanel({
  client,
  pipeline,
  dispatch,
}: {
  client: ClientState;
  pipeline: PipelineDefinition;
  dispatch: React.Dispatch<PlaygroundAction>;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const basic    = pipeline.clientContextFields.filter((f) => !f.advanced);
  const advanced = pipeline.clientContextFields.filter((f) =>  f.advanced);
  const advancedFilled = advanced.filter(
    (f) => (client.context[f.name] ?? "").trim() !== ""
  ).length;

  function renderField(field: typeof basic[number]) {
    const val = client.context[field.name] ?? field.default ?? "";

    if (field.kind === "url" || field.kind === "text") {
      return (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <input
            type={field.kind === "url" ? "url" : "text"}
            value={val}
            placeholder={field.kind === "url" ? "https://…" : ""}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_CLIENT_CONTEXT",
                clientId: client.id,
                field: field.name,
                value: e.target.value,
              })
            }
            className="bg-neutral-800 border border-neutral-700 rounded
              text-neutral-100 text-xs px-2 py-1.5 font-mono
              focus:outline-none focus:ring-1 focus:ring-violet-500
              hover:border-violet-500/40 transition-colors"
          />
        </div>
      );
    }

    if (field.kind === "select") {
      return (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500">
            {field.label}
          </label>
          <select
            value={val}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_CLIENT_CONTEXT",
                clientId: client.id,
                field: field.name,
                value: e.target.value,
              })
            }
            className="bg-neutral-800 border border-neutral-700 rounded
              text-neutral-100 text-xs px-2 py-1.5
              focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            {field.options?.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      );
    }

    const isJson = field.kind === "json";
    return (
      <div key={field.name} className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-widest text-neutral-500">
          {field.label}
          {field.required
            ? <span className="text-red-500 ml-0.5">*</span>
            : <span className="text-neutral-600 ml-1 normal-case tracking-normal">(opt)</span>}
        </label>
        <textarea
          value={val}
          rows={isJson ? 5 : 3}
          placeholder={isJson ? '{\n  "primary_color": "#...",\n  ...\n}' : ""}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_CLIENT_CONTEXT",
              clientId: client.id,
              field: field.name,
              value: e.target.value,
            })
          }
          className="bg-neutral-800 border border-neutral-700 rounded
            text-neutral-100 text-xs px-2 py-1.5 font-mono resize-y
            focus:outline-none focus:ring-1 focus:ring-violet-500
            hover:border-violet-500/40 transition-colors min-h-[5.25rem]"
        />
      </div>
    );
  }

  return (
    <div className="ml-8 flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {basic.map(renderField)}
      </div>

      {advanced.length > 0 && (
        <div className="rounded border border-neutral-800/80 bg-neutral-950/40">
          <button
            onClick={() => setAdvancedOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <span>{advancedOpen ? "▾" : "▸"}</span>
            <span className="font-medium">Advanced stormbreaker inputs</span>
            <span className="text-neutral-600 text-[10px]">
              · design_tokens / company_info / paa_data / service_catalog / product_information / blog_content
            </span>
            <span className="ml-auto text-[10px] text-neutral-500 font-mono">
              {advancedFilled}/{advanced.length} set
            </span>
          </button>
          {advancedOpen && (
            <div className="px-3 pb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {advanced.map(renderField)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
