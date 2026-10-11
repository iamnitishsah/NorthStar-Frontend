import type { HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

type Tone = "default" | "success" | "warning" | "danger" | "info" | "accent"

const tones: Record<Tone, string> = {
  default: "border-border bg-muted text-surface-foreground",
  success: "border-success/25 bg-success/12 text-success",
  warning: "border-warning/25 bg-warning/12 text-warning",
  danger: "border-destructive/25 bg-destructive/12 text-destructive",
  info: "border-info/25 bg-info/12 text-info",
  accent: "border-accent/25 bg-accent/12 text-accent",
}

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone
  icon?: ReactNode
}

function StatusBadge({
  children,
  className,
  icon,
  tone = "default",
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    >
      {icon}
      <span className="truncate">{children}</span>
    </span>
  )
}

function ProgressBadge({
  children,
  className,
  tone = "default",
  ...props
}: StatusBadgeProps) {
  return (
    <StatusBadge
      className={cn("font-medium", className)}
      tone={tone}
      {...props}
    >
      {children}
    </StatusBadge>
  )
}

export { ProgressBadge, StatusBadge }
