export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] gap-3 text-center px-4">
      <div className="text-5xl text-neutral-700">⬡</div>
      <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
        Select a <span className="text-neutral-200">Page Type</span> and{" "}
        <span className="text-neutral-200">Image Type</span> above to load a pipeline.
      </p>
      <p className="text-neutral-700 text-xs font-mono">
        blog / service / category → image type → 5 steps
      </p>
    </div>
  );
}
