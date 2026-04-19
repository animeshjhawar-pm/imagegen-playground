"use client";

import { useState } from "react";
import type { ImportedClientSeed } from "@/state/playgroundReducer";
import { CLIENT_SAMPLES, getClientSampleBySlug } from "@/config/client-samples";

interface ImportClientDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onImport: (seeds: ImportedClientSeed[]) => void;
}

type Tab = "single" | "csv";

// Column names the CSV importer understands. Match the client context
// field names so they flow straight through with no remapping.
const CSV_COLUMNS = [
  "client_name",
  "client_homepage_url",
  "company_logo_url",
  "business_context_token",
  "clean_html",
  "branding_json",
] as const;

// ---------------------------------------------------------------------------
// Dummy template download
// ---------------------------------------------------------------------------
function csvEscape(v: string): string {
  return /[,"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadCsvTemplate() {
  const header = CSV_COLUMNS.join(",");
  const sample = [
    "Metro Wholesale SD",
    "https://www.metrowholesalesd.com/",
    "https://cdn.shopify.com/.../logo.png",
    "Wholesale beverage and grocery distributor serving San Diego.",
    "", // clean_html — optional; leave blank to let Firecrawl scrape
    "", // branding_json — optional; leave blank to let Firecrawl extract
  ].map(csvEscape).join(",");
  const empty = ["", "", "", "", "", ""].join(",");
  const csv = `${header}\n${sample}\n${empty}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "imagegen-playground-clients-template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Minimal RFC-4180-ish CSV parser (handles quoted fields + embedded commas +
// escaped quotes ""). Good enough for an internal import form.
// ---------------------------------------------------------------------------
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; continue; }
      if (ch === '"') { inQuotes = false; continue; }
      field += ch;
      continue;
    }

    if (ch === '"') { inQuotes = true; continue; }
    if (ch === ",") { row.push(field); field = ""; continue; }
    if (ch === "\r") { continue; }
    if (ch === "\n") { row.push(field); field = ""; rows.push(row); row = []; continue; }
    field += ch;
  }
  // Flush trailing field/row
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

function csvToSeeds(text: string): { seeds: ImportedClientSeed[]; errors: string[] } {
  const rows = parseCsv(text);
  const errors: string[] = [];
  if (rows.length < 2) {
    return { seeds: [], errors: ["CSV needs a header row plus at least one data row."] };
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx: Record<string, number> = {};
  for (const col of CSV_COLUMNS) {
    idx[col] = header.indexOf(col);
  }

  if (idx.client_homepage_url === -1) {
    errors.push("CSV must contain a `client_homepage_url` column.");
    return { seeds: [], errors };
  }

  const seeds: ImportedClientSeed[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const url = (idx.client_homepage_url >= 0 ? row[idx.client_homepage_url] : "")?.trim();
    if (!url) {
      errors.push(`Row ${r + 1}: missing client_homepage_url — skipped.`);
      continue;
    }
    const context: Record<string, string> = {
      client_homepage_url: url,
    };
    if (idx.company_logo_url       >= 0 && row[idx.company_logo_url]?.trim())       context.company_logo_url       = row[idx.company_logo_url].trim();
    if (idx.business_context_token >= 0 && row[idx.business_context_token]?.trim()) context.business_context_token = row[idx.business_context_token].trim();

    const cleanHtml   = idx.clean_html    >= 0 ? row[idx.clean_html] ?? ""   : "";
    const brandingRaw = idx.branding_json >= 0 ? row[idx.branding_json] ?? "" : "";
    const scrapeSeed =
      cleanHtml.trim() || brandingRaw.trim()
        ? { clean_html: cleanHtml, branding_json: brandingRaw }
        : undefined;

    seeds.push({
      name: (idx.client_name >= 0 ? row[idx.client_name] : "")?.trim() || "",
      context,
      scrapeSeed,
    });
  }

  return { seeds, errors };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ImportClientDialog({ isOpen, onCancel, onImport }: ImportClientDialogProps) {
  const [tab, setTab] = useState<Tab>("single");

  // Single-client form
  const [name, setName]                       = useState("");
  const [homepage, setHomepage]               = useState("");
  const [logoUrl, setLogoUrl]                 = useState("");
  const [businessContext, setBusinessContext] = useState("");
  const [cleanHtml, setCleanHtml]             = useState("");
  const [brandingJson, setBrandingJson]       = useState("");
  const [seedOpen, setSeedOpen]               = useState(false);
  const [singleError, setSingleError]         = useState<string | null>(null);
  // Advanced stormbreaker variables — populated when a Preset client is
  // picked. Each is a stringified JSON blob that drops straight into
  // client.context at import time.
  const [advanced, setAdvanced] = useState<Record<string, string>>({});

  // CSV state
  const [csvFilename, setCsvFilename]   = useState<string>("");
  const [csvSeeds, setCsvSeeds]         = useState<ImportedClientSeed[]>([]);
  const [csvErrors, setCsvErrors]       = useState<string[]>([]);

  function resetAll() {
    setName(""); setHomepage(""); setLogoUrl("");
    setBusinessContext(""); setCleanHtml(""); setBrandingJson("");
    setSeedOpen(false); setSingleError(null);
    setAdvanced({});
    setCsvFilename(""); setCsvSeeds([]); setCsvErrors([]);
    setTab("single");
  }

  function handleCancel() {
    resetAll();
    onCancel();
  }

  function handleSingleImport() {
    if (!homepage.trim()) {
      setSingleError("Website / homepage URL is required.");
      return;
    }
    if (brandingJson.trim()) {
      try { JSON.parse(brandingJson); }
      catch { setSingleError("Branding JSON is not valid JSON."); return; }
    }
    const context: Record<string, string> = { client_homepage_url: homepage.trim() };
    if (logoUrl.trim())         context.company_logo_url       = logoUrl.trim();
    if (businessContext.trim()) context.business_context_token = businessContext.trim();
    // Preset-filled advanced stormbreaker vars (may all be "" if nothing picked).
    for (const [k, v] of Object.entries(advanced)) {
      if (v && v.trim()) context[k] = v;
    }

    const scrapeSeed =
      cleanHtml.trim() || brandingJson.trim()
        ? { clean_html: cleanHtml, branding_json: brandingJson || "{}" }
        : undefined;

    onImport([{ name: name.trim(), context, scrapeSeed }]);
    resetAll();
  }

  async function handleCsvFile(file: File) {
    const text = await file.text();
    const { seeds, errors } = csvToSeeds(text);
    setCsvFilename(file.name);
    setCsvSeeds(seeds);
    setCsvErrors(errors);
  }

  function handleCsvImport() {
    if (csvSeeds.length === 0) return;
    onImport(csvSeeds);
    resetAll();
  }

  if (!isOpen) return null;

  const TAB_BTN = (id: Tab, label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`px-3 py-1.5 text-xs font-medium rounded-t border-b-2 transition-colors ${
        tab === id
          ? "border-violet-500 text-violet-300"
          : "border-transparent text-neutral-500 hover:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );

  const INPUT_CLASS = `bg-neutral-800 border border-neutral-700 rounded
    text-neutral-100 text-xs px-2 py-1.5 font-mono
    focus:outline-none focus:ring-1 focus:ring-violet-500
    hover:border-violet-500/40 transition-colors`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        className="w-[640px] max-w-[95vw] max-h-[90vh] rounded-lg border border-neutral-700
          bg-neutral-900 shadow-2xl shadow-violet-900/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-4 flex-shrink-0">
          <h2 className="text-sm font-semibold text-neutral-100">Import Clients</h2>
          <div className="flex-1" />
          {TAB_BTN("single", "Single Client")}
          {TAB_BTN("csv", "Bulk CSV")}
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-auto flex-1">
          {tab === "single" ? (
            <div className="flex flex-col gap-3">
              {/* Preset picker — fills every field with real prod data for one of the 10 sample clients. */}
              <div className="flex items-center gap-2 px-3 py-2 rounded border border-violet-900/50 bg-violet-950/20">
                <label className="text-[10px] uppercase tracking-widest text-violet-300 whitespace-nowrap">
                  Preset client
                </label>
                <select
                  value=""
                  onChange={(e) => {
                    const sample = getClientSampleBySlug(e.target.value);
                    if (!sample) return;
                    setName(sample.name);
                    setHomepage(sample.url);
                    setLogoUrl(sample.primaryLogoUrl);
                    // Default the short Business Context to the service topic,
                    // falling back to category, then blog. Users typing another
                    // topic later just overwrite it.
                    setBusinessContext(
                      sample.sampleServiceTopic ||
                      sample.sampleCategoryTopic ||
                      sample.sampleBlogTopic ||
                      ""
                    );
                    setAdvanced({
                      design_tokens_json:       sample.designTokensJson,
                      company_info_json:        sample.companyInfoJson,
                      paa_data_json:            sample.paaDataJson,
                      service_catalog_json:     sample.serviceCatalogJson,
                      product_information_json: sample.productInformationJson,
                      blog_content_markdown:    "",
                    });
                    setSeedOpen(true);
                    setSingleError(null);
                  }}
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded
                    text-neutral-100 text-xs px-2 py-1.5
                    focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">— pick one of 10 real prod clients —</option>
                  {CLIENT_SAMPLES.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name} · {s.url}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                    Client name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Metro Wholesale"
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                    Website / Homepage URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={homepage}
                    onChange={(e) => setHomepage(e.target.value)}
                    placeholder="https://www.example.com"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Logo URL (optional)
                </label>
                <input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://.../logo.png"
                  className={INPUT_CLASS}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Business context (optional)
                </label>
                <textarea
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  rows={3}
                  placeholder="Short description of the business, used as input to Step 3."
                  className={INPUT_CLASS + " resize-y"}
                />
              </div>

              {/* Collapsible: pre-seed Step 1 */}
              <div className="rounded border border-neutral-800 bg-neutral-950/40">
                <button
                  onClick={() => setSeedOpen((v) => !v)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  <span>{seedOpen ? "▾" : "▸"}</span>
                  <span className="font-medium">Pre-seed Step 1 output (optional)</span>
                  <span className="text-neutral-600 text-[10px]">
                    · skip the Firecrawl call if you already have the data
                  </span>
                </button>
                {seedOpen && (
                  <div className="px-3 pb-3 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                        Cleaned HTML / Markdown
                      </label>
                      <textarea
                        value={cleanHtml}
                        onChange={(e) => setCleanHtml(e.target.value)}
                        rows={4}
                        placeholder="Paste the scraped HTML / markdown."
                        className={INPUT_CLASS + " resize-y"}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                        Branding JSON
                      </label>
                      <textarea
                        value={brandingJson}
                        onChange={(e) => setBrandingJson(e.target.value)}
                        rows={4}
                        placeholder={'{\n  "primary_color": "#...",\n  ...\n}'}
                        className={INPUT_CLASS + " resize-y"}
                      />
                    </div>
                  </div>
                )}
              </div>

              {singleError && (
                <p className="text-[11px] text-red-400">{singleError}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-neutral-400 leading-relaxed">
                Upload a CSV with columns:{" "}
                <code className="text-violet-300 text-[11px]">client_name</code>,{" "}
                <code className="text-violet-300 text-[11px]">client_homepage_url</code>{" "}
                (required),{" "}
                <code className="text-violet-300 text-[11px]">company_logo_url</code>,{" "}
                <code className="text-violet-300 text-[11px]">business_context_token</code>,{" "}
                <code className="text-violet-300 text-[11px]">clean_html</code>,{" "}
                <code className="text-violet-300 text-[11px]">branding_json</code>. Rows with
                <code className="text-violet-300 text-[11px]"> clean_html</code> /
                <code className="text-violet-300 text-[11px]"> branding_json</code> pre-seed
                Step 1, skipping the Firecrawl call.
              </p>

              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center gap-2 px-3 py-2 rounded border border-dashed
                  border-neutral-700 bg-neutral-950/40 cursor-pointer hover:border-violet-500/50 transition-colors">
                  <span className="text-xs text-neutral-300">
                    {csvFilename ? `📄 ${csvFilename}` : "Choose CSV file…"}
                  </span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleCsvFile(f);
                    }}
                  />
                </label>
                <button
                  onClick={downloadCsvTemplate}
                  title="Download a CSV with the correct column headers and a sample row"
                  className="px-3 py-2 text-[11px] rounded border border-neutral-700 bg-neutral-800
                    text-violet-300 hover:text-violet-200 hover:border-violet-600/50
                    hover:bg-neutral-700 transition-colors whitespace-nowrap"
                >
                  ↓ Download template
                </button>
              </div>

              {csvErrors.length > 0 && (
                <div className="rounded border border-amber-900/60 bg-amber-950/30 p-2 text-[11px]
                  text-amber-300 font-mono">
                  {csvErrors.map((e, i) => <div key={i}>• {e}</div>)}
                </div>
              )}

              {csvSeeds.length > 0 && (
                <div className="rounded border border-neutral-800 bg-neutral-950/40 overflow-hidden">
                  <div className="px-3 py-2 bg-neutral-900/60 border-b border-neutral-800 text-[11px] text-neutral-400">
                    {csvSeeds.length} client{csvSeeds.length === 1 ? "" : "s"} ready to import
                  </div>
                  <div className="max-h-[180px] overflow-auto">
                    <table className="w-full text-[11px]">
                      <thead className="bg-neutral-950/80 sticky top-0">
                        <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                          <th className="px-2 py-1 text-left">Name</th>
                          <th className="px-2 py-1 text-left">Homepage</th>
                          <th className="px-2 py-1 text-left">Logo</th>
                          <th className="px-2 py-1 text-left">Seeded</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        {csvSeeds.map((s, i) => (
                          <tr key={i} className="border-t border-neutral-800">
                            <td className="px-2 py-1 text-neutral-300 truncate">{s.name || `(Client ${i + 1})`}</td>
                            <td className="px-2 py-1 text-neutral-400 truncate max-w-[200px]">{s.context.client_homepage_url}</td>
                            <td className="px-2 py-1 text-neutral-500">{s.context.company_logo_url ? "✓" : "—"}</td>
                            <td className="px-2 py-1 text-neutral-500">{s.scrapeSeed ? "✓ Step 1" : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 flex items-center gap-2 flex-shrink-0">
          <div className="flex-1" />
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-800
              text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          {tab === "single" ? (
            <button
              onClick={handleSingleImport}
              disabled={!homepage.trim()}
              className="px-3 py-1.5 text-sm rounded font-medium
                bg-violet-600 text-white hover:bg-violet-500 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add Client
            </button>
          ) : (
            <button
              onClick={handleCsvImport}
              disabled={csvSeeds.length === 0}
              className="px-3 py-1.5 text-sm rounded font-medium
                bg-violet-600 text-white hover:bg-violet-500 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import {csvSeeds.length || ""} client{csvSeeds.length === 1 ? "" : "s"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
