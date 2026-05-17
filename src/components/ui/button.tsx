import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger" | "ghost"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-900",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600",
  ghost:
    "text-slate-700 hover:bg-slate-100",
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button
