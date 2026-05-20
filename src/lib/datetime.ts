export const DISPLAY_TIME_ZONE = "Asia/Kolkata"

type DateTimeInput = Date | number | string | null | undefined

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  timeZone: DISPLAY_TIME_ZONE,
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  hour: "2-digit",
  hour12: true,
  minute: "2-digit",
  month: "short",
  timeZone: DISPLAY_TIME_ZONE,
  timeZoneName: "short",
  year: "numeric",
})

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-IN", {
  numeric: "auto",
  style: "short",
})

const utcOffsetPattern = /([zZ]|[+-]\d{2}:?\d{2})$/
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
const dateLikeKeyPattern =
  /(^|_)(date|timestamp|submitted_at|approved_at|returned_at|created_at|updated_at)$/i

function normalizeUtcString(value: string) {
  const trimmed = value.trim()

  if (dateOnlyPattern.test(trimmed)) {
    return `${trimmed}T00:00:00Z`
  }

  if (utcOffsetPattern.test(trimmed)) {
    return trimmed
  }

  if (trimmed.includes("T") || /^\d{4}-\d{2}-\d{2} /.test(trimmed)) {
    return `${trimmed.replace(" ", "T")}Z`
  }

  return trimmed
}

export function toDisplayDate(value: DateTimeInput) {
  if (!value) return null

  const date =
    typeof value === "string" ? new Date(normalizeUtcString(value)) : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateIST(value: DateTimeInput, fallback = "-") {
  const date = toDisplayDate(value)

  return date ? dateFormatter.format(date) : fallback
}

export function formatDateTimeIST(value: DateTimeInput, fallback = "-") {
  const date = toDisplayDate(value)

  return date ? dateTimeFormatter.format(date) : fallback
}

export function formatRelativeTimeIST(value: DateTimeInput, fallback = "-") {
  const date = toDisplayDate(value)

  if (!date) return fallback

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const units = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ] as const

  const [unit, seconds] =
    units.find(([, secondsInUnit]) => Math.abs(diffSeconds) >= secondsInUnit) ??
    units[units.length - 1]

  return relativeTimeFormatter.format(Math.round(diffSeconds / seconds), unit)
}

export function formatDateTimeByKey(key: string, value: string) {
  if (!dateLikeKeyPattern.test(key)) return value

  return /date$/i.test(key) ? formatDateIST(value, value) : formatDateTimeIST(value, value)
}

export function formatDateTimeFieldsIST(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(formatDateTimeFieldsIST)
  }

  if (!value || typeof value !== "object") {
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      typeof entry === "string"
        ? formatDateTimeByKey(key, entry)
        : formatDateTimeFieldsIST(entry),
    ])
  )
}
