import { Info } from "lucide-react"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"

import type { GoalHelpContent, GoalHelpItem } from "@/lib/goal-help"
import { cn } from "@/lib/utils"

export type InfoTooltipProps = {
  title?: string
  description?: ReactNode
  formula?: string
  items?: GoalHelpItem[]
  content?: GoalHelpContent
  ariaLabel?: string
  className?: string
}

type Coords = {
  top: number
  left: number
  placement: "top" | "bottom"
}

function computePosition(buttonEl: HTMLButtonElement | null): Coords {
  if (!buttonEl || typeof window === "undefined") {
    return { top: 0, left: 0, placement: "top" }
  }

  const rect = buttonEl.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const maxTooltipWidth = Math.min(320, viewportWidth - 24)
  const halfWidth = maxTooltipWidth / 2
  const center = rect.left + rect.width / 2
  const left = Math.max(
    12 + halfWidth,
    Math.min(center, viewportWidth - 12 - halfWidth)
  )
  const placement = rect.top < 240 ? "bottom" : "top"
  const top = placement === "top" ? rect.top - 8 : rect.bottom + 8

  return { top, left, placement }
}

function InfoTooltip({
  title,
  description,
  formula,
  items,
  content,
  ariaLabel,
  className,
}: InfoTooltipProps) {
  const tooltipId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [coords, setCoords] = useState<Coords>({
    top: 0,
    left: 0,
    placement: "top",
  })

  const resolvedTitle = content?.title ?? title
  const resolvedDescription = content?.description ?? description
  const resolvedFormula = content?.formula ?? formula
  const resolvedItems = content?.items ?? items
  const resolvedAriaLabel =
    ariaLabel ?? (resolvedTitle ? `Info: ${resolvedTitle}` : "More information")

  function clearCloseTimer() {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  function openWithPosition() {
    clearCloseTimer()
    setCoords(computePosition(triggerRef.current))
    setIsOpen(true)
  }

  function scheduleClose() {
    if (isPinned) return
    clearCloseTimer()
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false)
    }, 130)
  }

  function handleTriggerMouseDown(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
  }

  function handleTriggerClick(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    clearCloseTimer()

    if (isOpen && isPinned) {
      setIsPinned(false)
      setIsOpen(false)
      return
    }

    setCoords(computePosition(triggerRef.current))
    setIsPinned(true)
    setIsOpen(true)
  }

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    function handleReposition() {
      setCoords(computePosition(triggerRef.current))
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null
      if (
        target &&
        !triggerRef.current?.contains(target) &&
        !popupRef.current?.contains(target)
      ) {
        setIsPinned(false)
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPinned(false)
        setIsOpen(false)
      }
    }

    window.addEventListener("scroll", handleReposition, {
      capture: true,
      passive: true,
    })
    window.addEventListener("resize", handleReposition, { passive: true })
    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("scroll", handleReposition, { capture: true })
      window.removeEventListener("resize", handleReposition)
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        aria-label={resolvedAriaLabel}
        className={cn(
          "inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
          isOpen && "border-primary bg-primary text-primary-foreground",
          className
        )}
        onBlur={() => {
          if (!isPinned) {
            scheduleClose()
          }
        }}
        onClick={handleTriggerClick}
        onFocus={openWithPosition}
        onMouseDown={handleTriggerMouseDown}
        onMouseEnter={openWithPosition}
        onMouseLeave={scheduleClose}
        ref={triggerRef}
        type="button"
      >
        <Info size={11} strokeWidth={2.5} />
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="z-[100] w-80 max-w-[calc(100vw-1.5rem)] rounded-xl border border-border bg-card p-3.5 text-left text-xs text-card-foreground shadow-enterprise-md"
            id={tooltipId}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
            ref={popupRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform:
                coords.placement === "top"
                  ? "translate(-50%, -100%)"
                  : "translate(-50%, 0)",
            }}
          >
            {resolvedTitle && (
              <div className="flex items-center gap-1.5 font-semibold text-card-foreground">
                <Info className="shrink-0 text-primary" size={13} />
                <span>{resolvedTitle}</span>
              </div>
            )}

            {resolvedDescription && (
              <p className="mt-1.5 leading-relaxed font-normal normal-case tracking-normal text-muted-foreground">
                {resolvedDescription}
              </p>
            )}

            {resolvedFormula && (
              <div className="mt-2 rounded-lg border border-primary/20 bg-primary/8 px-2.5 py-1.5 font-mono text-[11px] font-semibold normal-case tracking-normal text-primary">
                {resolvedFormula}
              </div>
            )}

            {resolvedItems && resolvedItems.length > 0 && (
              <div className="mt-2.5 space-y-2 border-t border-border pt-2 normal-case tracking-normal">
                {resolvedItems.map((item) => (
                  <div
                    className={cn(
                      "rounded-lg border border-border/70 bg-surface/70 px-2.5 py-1.5",
                      item.highlight && "border-primary/35 bg-primary/8"
                    )}
                    key={item.label}
                  >
                    <p className="font-semibold text-surface-foreground">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed font-normal text-muted-foreground">
                      {item.description}
                    </p>
                    {item.formula && (
                      <p className="mt-1 font-mono text-[10px] font-semibold text-primary">
                        {item.formula}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  )
}

export { InfoTooltip }
export default InfoTooltip

