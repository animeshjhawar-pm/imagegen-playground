"use client";

import type { StepStatus } from "@/config/pipelines";

const STATUS_CONFIG: Record<StepStatus, { color: string; label: string }> = {
  idle: { color: "bg-neutral-600", label: "Idle" },
  running: { color: "bg-yellow-400 animate-pulse", label: "Running" },
  completed: { color: "bg-green-500", label: "Completed" },
  failed: { color: "bg-red-500", label: "Failed" },
};

interface StatusDotProps {
  status: StepStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  const { color, label } = STATUS_CONFIG[status];
  return (
    <span
      title={label}
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${color}`}
    />
  );
}
