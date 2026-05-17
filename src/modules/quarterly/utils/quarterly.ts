import type { Goal, ProgressStatus, QuarterKey } from "@/types/goal"

export const quarterKeys: QuarterKey[] = ["1", "2", "3", "4"]

export function getQuarterLabel(quarter: QuarterKey) {
  return `Q${quarter}`
}

export function normalizeQuarterMap(goal: Goal): Goal {
  const rawQuarter = goal.quarter as unknown

  if (!rawQuarter) return goal

  if (Array.isArray(rawQuarter)) {
    const normalized: Goal["quarter"] = {}

    rawQuarter.forEach((entry, index) => {
      const quarterKey = String(index + 1) as QuarterKey

      if (quarterKeys.includes(quarterKey) && entry) {
        normalized[quarterKey] = entry
      }
    })

    return {
      ...goal,
      quarter: normalized,
    }
  }

  if (typeof rawQuarter === "object") {
    const record = rawQuarter as Record<
      string,
      NonNullable<Goal["quarter"]>[QuarterKey]
    >
    const keys = Object.keys(record)
    const hasZeroIndex = keys.includes("0")
    const hasQuarterKeys = keys.some((key) => quarterKeys.includes(key as QuarterKey))

    if (hasZeroIndex && !hasQuarterKeys) {
      const normalized: Goal["quarter"] = {}

      keys.forEach((key) => {
        const index = Number(key)

        if (!Number.isNaN(index)) {
          const quarterKey = String(index + 1) as QuarterKey
          const entry = record[key]

          if (quarterKeys.includes(quarterKey) && entry) {
            normalized[quarterKey] = entry
          }
        }
      })

      return {
        ...goal,
        quarter: normalized,
      }
    }
  }

  return goal
}

export function getProgressStatusClassName(status?: ProgressStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800"
    case "ON_TRACK":
      return "bg-sky-100 text-sky-800"
    case "NOT_STARTED":
      return "bg-slate-100 text-slate-700"
    default:
      return "bg-slate-100 text-slate-500"
  }
}

export function getProgressBarClassName(progress?: number | null) {
  if (progress === null || progress === undefined) return "bg-slate-300"
  if (progress >= 100) return "bg-emerald-500"
  if (progress >= 50) return "bg-sky-500"
  return "bg-amber-500"
}

export function getQuarterProgress(goal: Goal, quarter: QuarterKey) {
  const quarterProgress = goal.quarter?.[quarter]?.progress_percentage

  if (quarterProgress !== undefined && quarterProgress !== null) {
    return quarterProgress
  }

  const quarterIndex = quarterKeys.indexOf(quarter)

  for (let index = quarterIndex - 1; index >= 0; index -= 1) {
    const previousProgress =
      goal.quarter?.[quarterKeys[index]]?.progress_percentage

    if (previousProgress !== undefined && previousProgress !== null) {
      return previousProgress
    }
  }

  return null
}

export function getQuarterAchievement(goal: Goal, quarter: QuarterKey) {
  const quarterAchievement = goal.quarter?.[quarter]?.achievement_value

  if (quarterAchievement !== undefined && quarterAchievement !== null) {
    return quarterAchievement
  }

  const quarterIndex = quarterKeys.indexOf(quarter)

  for (let index = quarterIndex - 1; index >= 0; index -= 1) {
    const previousAchievement =
      goal.quarter?.[quarterKeys[index]]?.achievement_value

    if (previousAchievement !== undefined && previousAchievement !== null) {
      return previousAchievement
    }
  }

  return null
}

export function clampProgress(progress?: number | null) {
  if (progress === null || progress === undefined) return 0

  return Math.max(0, Math.min(progress, 100))
}

export function getLatestQuarter(goal: Goal) {
  return [...quarterKeys]
    .reverse()
    .find((quarter) => goal.quarter?.[quarter])
}
