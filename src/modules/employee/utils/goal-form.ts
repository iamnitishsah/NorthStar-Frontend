import { z } from "zod"

import type {
  CreateGoalPayload,
  Goal,
  MeasurementType,
  UOMType,
  UpdateGoalPayload,
} from "@/types/goal"

export const uomOptions: UOMType[] = [
  "NUMERIC",
  "PERCENTAGE",
  "TIMELINE",
  "ZERO_BASED",
]

export const measurementOptions: MeasurementType[] = [
  "MIN",
  "MAX",
]

export const goalFormSchema = z
  .object({
    thrust_area: z.string().trim().min(3, "Minimum 3 characters").max(100),
    title: z.string().trim().min(3, "Minimum 3 characters").max(100),
    description: z.string().trim().max(500).optional(),
    uom_type: z.enum(uomOptions),
    measurement_type: z.enum(measurementOptions),
    target_value: z.coerce.number(),
    weightage: z.coerce.number().min(10).max(100),
    target_date: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.uom_type === "TIMELINE" && !value.target_date) {
      context.addIssue({
        code: "custom",
        message: "Target date is required for timeline goals",
        path: ["target_date"],
      })
    }

    if (value.target_value <= 0) {
      context.addIssue({
        code: "custom",
        message: "Target value must be greater than 0",
        path: ["target_value"],
      })
    }
  })

export type GoalFormValues = z.input<typeof goalFormSchema>

export function isEditableGoal(goal: Goal) {
  return (
    goal.status === "DRAFT" ||
    goal.status === "RETURNED" ||
    goal.status === "ADMIN_UNLOCKED"
  )
}

export function isSharedGoalFieldReadonly(goal?: Goal) {
  return Boolean(goal?.is_shared)
}

export function toDateInputValue(value?: string | null) {
  return value ? value.slice(0, 10) : ""
}

export function getGoalFormDefaultValues(goal?: Goal): GoalFormValues {
  return {
    thrust_area: goal?.thrust_area ?? "",
    title: goal?.title ?? "",
    description: goal?.description ?? "",
    uom_type: goal?.uom_type ?? "NUMERIC",
    measurement_type: goal?.measurement_type ?? "MIN",
    target_value: goal?.target_value ?? 1,
    weightage: goal?.weightage ?? 10,
    target_date: toDateInputValue(goal?.target_date),
  }
}

export function toGoalPayload(
  values: GoalFormValues
): CreateGoalPayload {
  const isZeroBased = values.uom_type === "ZERO_BASED"
  const targetDate = values.target_date
    ? `${values.target_date}T00:00:00Z`
    : null

  return {
    thrust_area: values.thrust_area.trim(),
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    uom_type: values.uom_type,
    measurement_type: isZeroBased ? "MIN" : values.measurement_type,
    target_value: isZeroBased ? 1 : Number(values.target_value),
    weightage: Number(values.weightage),
    target_date: targetDate,
    progress_status: "NOT_STARTED",
  }
}

export function toUpdateGoalPayload(
  values: GoalFormValues,
  goal?: Goal
): UpdateGoalPayload {
  const payload = toGoalPayload(values)

  if (!isSharedGoalFieldReadonly(goal)) {
    return payload
  }

  return {
    weightage: payload.weightage,
  }
}
