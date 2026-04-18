"use client";

interface FinalOutputCellProps {
  output: string;
  status: string;
}

export function FinalOutputCell({ output, status }: FinalOutputCellProps) {
  const isUrl = output?.startsWith("http");

  return (
    <td className="align-top p-2 min-w-[200px] max-w-[220px] border-l border-neutral-800">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-widest text-neutral-500">
          Final Output
        </span>

        {!output && status !== "failed" ? (
          <p className="text-[11px] text-neutral-700 italic">— No output yet —</p>
        ) : status === "failed" ? (
          <p className="text-[11px] text-red-400 font-mono">{output || "Step failed"}</p>
        ) : isUrl ? (
          <div className="flex flex-col gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={output}
              alt="Generated image"
              className="w-full max-h-64 object-contain rounded border border-neutral-700"
            />
            <a
              href={output}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-indigo-400 hover:text-indigo-300 truncate"
            >
              Open ↗
            </a>
          </div>
        ) : (
          <pre className="text-[10px] text-neutral-300 font-mono whitespace-pre-wrap break-all">
            {output}
          </pre>
        )}
      </div>
    </td>
  );
}
