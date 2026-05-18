import { X } from "lucide-react"
import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("dashboard-surface theme-transition rounded-lg p-5", className)}
      {...props}
    />
  )
}

function SectionCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inset-panel theme-transition rounded-md p-4", className)}
      {...props}
    />
  )
}

function MetricTile({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inset-panel theme-transition min-w-0 rounded-md p-3", className)}
      {...props}
    />
  )
}

type ModalShellProps = {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  onClose: () => void
}

const modalWidths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
}

function ModalShell({
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
  onClose,
}: ModalShellProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
      <div
        className={cn(
          "dashboard-surface flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-lg shadow-enterprise-md",
          modalWidths[maxWidth]
        )}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-card-foreground" id={titleId}>
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <button
            aria-label="Close modal"
            className="theme-transition shrink-0 rounded-md p-2 text-muted-foreground hover:bg-hover hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {children}
        </div>

        {footer && (
          <div className="border-t border-border px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function IconButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("theme-transition rounded-md p-2 text-muted-foreground hover:bg-hover hover:text-foreground", className)}
      type="button"
      {...props}
    />
  )
}

export {
  IconButton,
  MetricTile,
  ModalFooter,
  ModalShell,
  Panel,
  SectionCard,
}
