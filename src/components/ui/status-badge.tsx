import type { HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

type Tone = "default" | "success" | "warning" | "danger" | "info" | "accent"

const tones: Record<Tone, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-destructive/12 text-destructive",
  info: "bg-info/12 text-info",
  accent: "bg-accent/12 text-accent",
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
        "inline-flex max-w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
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
