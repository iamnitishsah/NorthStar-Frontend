import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger" | "ghost"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-enterprise-sm hover:bg-primary/90 disabled:bg-primary",
  secondary:
    "border border-border bg-card text-card-foreground hover:border-primary/35 hover:bg-hover",
  danger:
    "bg-destructive text-primary-foreground hover:bg-destructive/90 disabled:bg-destructive",
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
      className={`theme-transition inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button
