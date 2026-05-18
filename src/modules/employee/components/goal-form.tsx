import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Goal } from "@/types/goal"

import {
  getGoalFormDefaultValues,
  getTodayDateInputValue,
  goalFormSchema,
  isSharedGoalFieldReadonly,
  measurementOptions,
  toGoalPayload,
  toUpdateGoalPayload,
  uomOptions,
} from "../utils/goal-form"
import type { GoalFormValues } from "../utils/goal-form"

type Props = {
  mode: "create" | "edit"
  goal?: Goal
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (payload: ReturnType<typeof toGoalPayload>) => void
  onUpdate: (goal: Goal, payload: ReturnType<typeof toUpdateGoalPayload>) => void
}

function fieldClassName(isReadonly = false) {
  return [
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition",
    "focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15",
    isReadonly
      ? "pointer-events-none cursor-not-allowed bg-slate-100 text-slate-500"
      : "",
  ].join(" ")
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p className="mt-1 text-sm text-red-600">
      {message}
    </p>
  )
}

function GoalForm({
  mode,
  goal,
  isSubmitting,
  onCancel,
  onSubmit,
  onUpdate,
}: Props) {
  const isShared = isSharedGoalFieldReadonly(goal)
  const isEditMode = mode === "edit"

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: getGoalFormDefaultValues(goal),
  })

  const uomType = useWatch({
    control,
    name: "uom_type",
  })
  const isTimeline = uomType === "TIMELINE"
  const isZeroBased = uomType === "ZERO_BASED"
  const minTargetDate = getTodayDateInputValue()

  useEffect(() => {
    reset(getGoalFormDefaultValues(goal))
  }, [goal, reset])

  useEffect(() => {
    if (!isZeroBased) return

    setValue("measurement_type", "MIN")
    setValue("target_value", 1)
  }, [isZeroBased, setValue])

  function submit(values: GoalFormValues) {
    if (isEditMode && goal) {
      onUpdate(goal, toUpdateGoalPayload(values, goal))
      return
    }

    onSubmit(toGoalPayload(values))
  }

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(submit)}
    >
      {isShared && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-[#EF6C00]">
          Shared goal details are managed by the owner. Only editable fields can be changed here.
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-950">
          Goal Definition
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Capture the business outcome, measurement basis, and governance weightage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">
            Thrust Area
          </span>
          <input
            {...register("thrust_area")}
            className={fieldClassName(isEditMode && isShared)}
            readOnly={isEditMode && isShared}
          />
          <FieldError message={errors.thrust_area?.message} />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">
            Title
          </span>
          <input
            {...register("title")}
            className={fieldClassName(isEditMode && isShared)}
            readOnly={isEditMode && isShared}
          />
          <FieldError message={errors.title?.message} />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">
          Description
        </span>
        <textarea
          {...register("description")}
          className={`${fieldClassName(isEditMode && isShared)} min-h-24 resize-y`}
          readOnly={isEditMode && isShared}
          rows={4}
        />
        <FieldError message={errors.description?.message} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">
            UOM Type
          </span>
          <select
            {...register("uom_type")}
            className={fieldClassName(isEditMode && isShared)}
            aria-disabled={isEditMode && isShared}
            tabIndex={isEditMode && isShared ? -1 : undefined}
          >
            {uomOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError message={errors.uom_type?.message} />
        </label>

        {!isZeroBased && (
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">
              Measurement Type
            </span>
            <select
              {...register("measurement_type")}
              className={fieldClassName(isEditMode && isShared)}
              aria-disabled={isEditMode && isShared}
              tabIndex={isEditMode && isShared ? -1 : undefined}
            >
              {measurementOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldError message={errors.measurement_type?.message} />
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">
            Target Value
          </span>
          <input
            {...register("target_value")}
            className={fieldClassName(isZeroBased || (isEditMode && isShared))}
            readOnly={isZeroBased || (isEditMode && isShared)}
            step="any"
            type="number"
          />
          <FieldError message={errors.target_value?.message} />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">
            Weightage
          </span>
          <input
            {...register("weightage")}
            className={fieldClassName()}
            max={100}
            min={10}
            type="number"
          />
          <FieldError message={errors.weightage?.message} />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">
            Target Date
            {isTimeline ? " *" : ""}
          </span>
          <input
            {...register("target_date")}
            className={fieldClassName(isEditMode && isShared)}
            min={minTargetDate}
            readOnly={isEditMode && isShared}
            type="date"
          />
          <FieldError message={errors.target_date?.message} />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-md bg-[#0D47A1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0A3A85] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Update Goal" : "Create Goal"}
        </button>
      </div>
    </form>
  )
}

export default GoalForm
