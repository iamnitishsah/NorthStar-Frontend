import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger" | "ghost"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#0D47A1] text-white shadow-sm hover:bg-[#0A3A85] disabled:bg-[#0D47A1]",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:border-[#0D47A1]/30 hover:bg-[#0D47A1]/5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:bg-blue-400/10",
  danger:
    "bg-[#C62828] text-white hover:bg-red-800 disabled:bg-[#C62828]",
  ghost:
    "text-slate-700 hover:bg-slate-100 hover:text-[#0D47A1] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white",
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
      className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button
