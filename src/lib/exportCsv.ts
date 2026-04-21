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

  // flow_label: human-readable ("Old", "New", "New 2", …).
  const header = ["client_id", "client_name", "flow_type", "flow_label", ...stepNames];
  const rows: string[][] = [header];

  for (const client of clients) {
    if (!opts.clientIds.has(client.id)) continue;
    if (opts.includeOldFlow) {
      const cells = [client.id, client.name, "old", "Old"];
      for (const n of stepNames) cells.push(client.oldFlow.stepStates[n]?.output ?? "");
      rows.push(cells);
    }
    if (opts.includeNewFlow) {
      client.newFlows.forEach((flow, idx) => {
        const label = idx === 0 ? "New" : `New ${idx + 1}`;
        const cells = [client.id, client.name, "new", label];
        for (const n of stepNames) cells.push(flow.stepStates[n]?.output ?? "");
        rows.push(cells);
      });
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
  let total = 0;
  for (const c of clients) {
    if (!opts.clientIds.has(c.id)) continue;
    if (opts.includeOldFlow) total += 1;
    if (opts.includeNewFlow) total += c.newFlows.length;
  }
  return total;
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
