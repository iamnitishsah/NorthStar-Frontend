import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"

import { cn } from "@/lib/utils"

type FieldProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode
}

function Field({ children, className, ...props }: FieldProps) {
  return (
    <label
      className={cn("block space-y-1.5", className)}
      {...props}
    >
      {children}
    </label>
  )
}

function FieldLabel({
  className,
  ...props
}: LabelHTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("text-sm font-semibold text-surface-foreground", className)}
      {...props}
    />
  )
}

function FieldHint({
  className,
  ...props
}: LabelHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs leading-5 text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  message,
  className,
}: {
  message?: string
  className?: string
}) {
  return (
    <p
      className={cn("min-h-5 text-sm leading-5 text-destructive", className)}
      aria-live="polite"
    >
      {message ?? ""}
    </p>
  )
}

const controlClassName =
  "theme-transition w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:border-destructive aria-[invalid=true]:focus:ring-destructive/20"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      aria-invalid={hasError || undefined}
      className={cn(controlClassName, className)}
      {...props}
    />
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean
}

function Textarea({ className, hasError, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={hasError || undefined}
      className={cn(controlClassName, "min-h-24 resize-y", className)}
      {...props}
    />
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean
}

function Select({ className, hasError, ...props }: SelectProps) {
  return (
    <select
      aria-invalid={hasError || undefined}
      className={cn(controlClassName, className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  Select,
  Textarea,
}
