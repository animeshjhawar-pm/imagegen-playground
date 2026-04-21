// ---------------------------------------------------------------------------
// CSV export of step outputs across all clients in the current pipeline.
//
// Schema: one row per (client × flow). Columns are
//   client_id, client_name, flow_type, <step1>, <step2>, ...
// where each step column holds that step's `output` string verbatim.
// Inputs / context fields are intentionally excluded — only outputs.
// ---------------------------------------------------------------------------

import type { ClientState } from "@/state/playgroundReducer";
import type { PipelineDefinition } from "@/config/pipelines";

/** Quote a value if it contains commas, quotes, or newlines (RFC 4180). */
function csvEscape(v: string): string {
  return /[,"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export interface CsvExportOptions {
  /** Client IDs to include. Rows for all other clients are dropped. */
  clientIds: Set<string>;
  /** Step names to include as columns. Order follows pipeline.steps. */
  stepNames: Set<string>;
  /** Which flow rows to emit per client. */
  includeOldFlow: boolean;
  includeNewFlow: boolean;
}

export function buildOutputsCsv(
  clients: ClientState[],
  pipeline: PipelineDefinition,
  opts: CsvExportOptions
): string {
  const stepNames = pipeline.steps
    .map((s) => s.name)
    .filter((n) => opts.stepNames.has(n));

  const header = ["client_id", "client_name", "flow_type", ...stepNames];
  const rows: string[][] = [header];

  const flows: Array<"old" | "new"> = [];
  if (opts.includeOldFlow) flows.push("old");
  if (opts.includeNewFlow) flows.push("new");

  for (const client of clients) {
    if (!opts.clientIds.has(client.id)) continue;
    for (const flowType of flows) {
      const flow = flowType === "old" ? client.oldFlow : client.newFlow;
      const cells = [client.id, client.name, flowType];
      for (const stepName of stepNames) {
        cells.push(flow.stepStates[stepName]?.output ?? "");
      }
      rows.push(cells);
    }
  }

  return rows.map((r) => r.map(csvEscape).join(",")).join("\n") + "\n";
}

/** Number of data rows (excluding header) that `buildOutputsCsv` will emit
 *  under the given options. Useful for a live count in the export dialog. */
export function countExportRows(
  clients: ClientState[],
  opts: CsvExportOptions
): number {
  const perClient = (opts.includeOldFlow ? 1 : 0) + (opts.includeNewFlow ? 1 : 0);
  let selectedClients = 0;
  for (const c of clients) if (opts.clientIds.has(c.id)) selectedClients += 1;
  return selectedClients * perClient;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
