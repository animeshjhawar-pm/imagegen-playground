"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CompareViewDialogProps {
  isOpen: boolean;
  clientName: string;
  /** Latest image URL from the NEW flow's generate_image step.
   *  When empty, the caller should not render the dialog. */
  newImageUrl: string;
  /** Latest image URL from the OLD flow's generate_image step. */
  oldImageUrl: string;
  /** Picker-step output shared across flows — the human-readable brief
   *  both images were generated against. Shown in a collapsible strip
   *  along the top of the dialog. */
  inputDescription?: string;
  onClose: () => void;
}

/**
 * Full-viewport side-by-side image comparison. New image on the left,
 * Old image on the right, each with its own caption + independent
 * zoom / pan controls. Dialog sizes to the maximum usable area (96vw
 * × 94vh) so the images render as large as possible. Esc closes.
 */
export function CompareViewDialog({
  isOpen, clientName, newImageUrl, oldImageUrl, inputDescription, onClose,
}: CompareViewDialogProps) {
  const [descExpanded, setDescExpanded] = useState(false);

  // Esc-to-close.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasDescription = !!inputDescription?.trim();
  const descPreview = hasDescription
    ? inputDescription!.replace(/\s+/g, " ").trim().slice(0, 180)
    : "";
  const descHasMore =
    hasDescription && inputDescription!.replace(/\s+/g, " ").trim().length > 180;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[96vw] h-[94vh] rounded-lg border border-neutral-700
          bg-neutral-950 shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-3 flex-shrink-0">
          <h2 className="text-sm font-semibold text-neutral-100">
            Compare — <span className="text-violet-400">{clientName}</span>
          </h2>
          <span className="text-[11px] text-neutral-500">
            latest outputs · scroll on an image to zoom · drag to pan
          </span>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-900
              text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Close (Esc)
          </button>
        </div>

        {/* Input description — collapsible strip between header and
         *  images. Shows a single-line preview when collapsed; expands
         *  to a scrollable block so long descriptions don't push the
         *  images down. */}
        {hasDescription && (
          <div className="border-b border-neutral-800 bg-neutral-950/60 flex-shrink-0">
            <button
              onClick={() => setDescExpanded((v) => !v)}
              className="w-full flex items-center gap-2 px-5 py-2 text-left
                hover:bg-neutral-900/60 transition-colors group"
              title={descExpanded ? "Hide full description" : "Show full description"}
            >
              <span
                className={`inline-block w-3 text-neutral-500 group-hover:text-neutral-300
                  transition-transform ${descExpanded ? "rotate-90" : ""}`}
                aria-hidden
              >
                ▸
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500
                group-hover:text-neutral-300 transition-colors flex-shrink-0">
                Input Description
              </span>
              {!descExpanded && (
                <span className="text-xs text-neutral-400 truncate min-w-0">
                  {descPreview}{descHasMore ? "…" : ""}
                </span>
              )}
              <span className="flex-1" />
              <span className="text-[10px] text-neutral-600 font-mono flex-shrink-0">
                {descExpanded ? "click to collapse" : "click to expand"}
              </span>
            </button>
            {descExpanded && (
              <div className="px-5 pb-3 pt-1 max-h-[28vh] overflow-y-auto">
                <pre className="text-xs text-neutral-200 whitespace-pre-wrap font-mono
                  leading-relaxed">{inputDescription}</pre>
              </div>
            )}
          </div>
        )}

        {/* Body: 50/50 panels */}
        <div className="flex-1 min-h-0 flex">
          <ImagePanel url={newImageUrl} label="New Image" accent="violet" />
          <div className="w-[5px] bg-neutral-800 flex-shrink-0" />
          <ImagePanel url={oldImageUrl} label="Old Image" accent="neutral" />
        </div>
      </div>
    </div>
  );
}

interface ImagePanelProps {
  url: string;
  label: string;
  accent: "violet" | "neutral";
}

function ImagePanel({ url, label, accent }: ImagePanelProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragRef = useRef<null | { startX: number; startY: number; baseX: number; baseY: number }>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Reset zoom/pan when the URL changes so a new compare starts at fit.
  useEffect(() => {
    resetView();
  }, [url, resetView]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0018; // slower than default for finer control
    setZoom((z) => {
      const next = Math.max(0.25, Math.min(8, z * (1 + delta)));
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return; // no pan when at fit
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    setPan({ x: d.baseX + (e.clientX - d.startX), y: d.baseY + (e.clientY - d.startY) });
  };
  const handleMouseUp = () => {
    dragRef.current = null;
  };

  const accentClass = accent === "violet"
    ? "border-violet-700/60 bg-violet-950/30 text-violet-200"
    : "border-neutral-700 bg-neutral-900 text-neutral-300";

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Caption + controls */}
      <div className={`px-4 py-2.5 border-b ${accentClass} flex items-center gap-3`}>
        <span className="text-xl font-bold tracking-wide">{label}</span>
        <div className="flex-1" />
        <button
          onClick={() => setZoom((z) => Math.max(0.25, z / 1.25))}
          title="Zoom out"
          className="px-2 py-0.5 text-xs rounded border border-neutral-700 bg-neutral-900
            text-neutral-300 hover:bg-neutral-800 transition-colors"
        >
          −
        </button>
        <span className="text-[11px] font-mono text-neutral-400 w-14 text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(8, z * 1.25))}
          title="Zoom in"
          className="px-2 py-0.5 text-xs rounded border border-neutral-700 bg-neutral-900
            text-neutral-300 hover:bg-neutral-800 transition-colors"
        >
          +
        </button>
        <button
          onClick={resetView}
          title="Reset zoom + pan"
          className="px-2 py-0.5 text-xs rounded border border-neutral-700 bg-neutral-900
            text-neutral-300 hover:bg-neutral-800 transition-colors"
        >
          Fit
        </button>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            title="Open full image in a new tab"
            className="px-2 py-0.5 text-xs rounded border border-neutral-700 bg-neutral-900
              text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            ↗
          </a>
        )}
      </div>

      {/* Image viewport */}
      <div
        ref={panelRef}
        className="flex-1 min-h-0 overflow-hidden bg-neutral-950 select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "default" }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={label}
            draggable={false}
            className="w-full h-full object-contain pointer-events-none transition-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-neutral-600 text-sm italic">
            No image for this side yet.
          </div>
        )}
      </div>
    </div>
  );
}
