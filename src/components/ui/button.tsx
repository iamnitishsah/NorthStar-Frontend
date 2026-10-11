import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "danger" | "ghost"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-enterprise-sm hover:brightness-110 active:scale-[0.99] disabled:bg-primary",
  secondary:
    "border border-border bg-card text-card-foreground shadow-enterprise-sm hover:border-primary/40 hover:bg-hover active:scale-[0.99]",
  danger:
    "bg-destructive text-destructive-foreground shadow-enterprise-sm hover:brightness-110 active:scale-[0.99] disabled:bg-destructive",
  ghost:
    "text-muted-foreground hover:bg-hover hover:text-foreground",
}

function Button({
  children,
  className = "",
  icon,
  type = "button",
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "theme-transition inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button
