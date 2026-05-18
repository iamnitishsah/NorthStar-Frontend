import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import Button from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  Select,
  Textarea,
} from "@/components/ui/form"
import { SectionCard } from "@/components/ui/surface"
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
        <div className="rounded-md border border-warning/25 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
          Shared goal details are managed by the owner. Only editable fields can be changed here.
        </div>
      )}

      <SectionCard>
        <p className="text-sm font-semibold text-surface-foreground">
          Goal Definition
        </p>
        <FieldHint className="mt-1 text-sm">
          Capture the business outcome, measurement basis, and governance weightage.
        </FieldHint>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>
            Thrust Area
          </FieldLabel>
          <Input
            {...register("thrust_area")}
            className={isEditMode && isShared ? "pointer-events-none bg-muted text-muted-foreground" : undefined}
            hasError={Boolean(errors.thrust_area)}
            readOnly={isEditMode && isShared}
          />
          <FieldError message={errors.thrust_area?.message} />
        </Field>

        <Field>
          <FieldLabel>
            Title
          </FieldLabel>
          <Input
            {...register("title")}
            className={isEditMode && isShared ? "pointer-events-none bg-muted text-muted-foreground" : undefined}
            hasError={Boolean(errors.title)}
            readOnly={isEditMode && isShared}
          />
          <FieldError message={errors.title?.message} />
        </Field>
      </div>

      <Field>
        <FieldLabel>
          Description
        </FieldLabel>
        <Textarea
          {...register("description")}
          className={isEditMode && isShared ? "pointer-events-none bg-muted text-muted-foreground" : undefined}
          hasError={Boolean(errors.description)}
          readOnly={isEditMode && isShared}
          rows={4}
        />
        <FieldError message={errors.description?.message} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>
            UOM Type
          </FieldLabel>
          <Select
            {...register("uom_type")}
            aria-disabled={isEditMode && isShared}
            className={isEditMode && isShared ? "pointer-events-none bg-muted text-muted-foreground" : undefined}
            hasError={Boolean(errors.uom_type)}
            tabIndex={isEditMode && isShared ? -1 : undefined}
          >
            {uomOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError message={errors.uom_type?.message} />
        </Field>

        {!isZeroBased && (
          <Field>
            <FieldLabel>
              Measurement Type
            </FieldLabel>
            <Select
              {...register("measurement_type")}
              aria-disabled={isEditMode && isShared}
              className={isEditMode && isShared ? "pointer-events-none bg-muted text-muted-foreground" : undefined}
              hasError={Boolean(errors.measurement_type)}
              tabIndex={isEditMode && isShared ? -1 : undefined}
            >
              {measurementOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <FieldError message={errors.measurement_type?.message} />
          </Field>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel>
            Target Value
          </FieldLabel>
          <Input
            {...register("target_value")}
            className={isZeroBased || (isEditMode && isShared) ? "pointer-events-none bg-muted text-muted-foreground" : undefined}
            hasError={Boolean(errors.target_value)}
            readOnly={isZeroBased || (isEditMode && isShared)}
            step="any"
            type="number"
          />
          <FieldError message={errors.target_value?.message} />
        </Field>

        <Field>
          <FieldLabel>
            Weightage
          </FieldLabel>
          <Input
            {...register("weightage")}
            hasError={Boolean(errors.weightage)}
            max={100}
            min={10}
            type="number"
          />
          <FieldError message={errors.weightage?.message} />
        </Field>

        <Field>
          <FieldLabel>
            Target Date
            {isTimeline ? " *" : ""}
          </FieldLabel>
          <Input
            {...register("target_date")}
            className={isEditMode && isShared ? "pointer-events-none bg-muted text-muted-foreground" : undefined}
            hasError={Boolean(errors.target_date)}
            min={minTargetDate}
            readOnly={isEditMode && isShared}
            type="date"
          />
          <FieldError message={errors.target_date?.message} />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          onClick={onCancel}
          type="button"
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Update Goal" : "Create Goal"}
        </Button>
      </div>
    </form>
  )
}

export default GoalForm
