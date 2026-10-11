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
import InfoTooltip from "@/components/ui/info-tooltip"
import { SectionCard } from "@/components/ui/surface"
import {
  GOAL_HELP,
  getMeasurementHelp,
  getUomFieldHelp,
  getUomHelp,
} from "@/lib/goal-help"
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
  const measurementType = useWatch({
    control,
    name: "measurement_type",
  })
  const isTimeline = uomType === "TIMELINE"
  const isZeroBased = uomType === "ZERO_BASED"
  const minTargetDate = getTodayDateInputValue()
  const activeUomHelp = getUomHelp(uomType)
  const activeMeasurementHelp = getMeasurementHelp(measurementType, uomType)

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-surface-foreground">
              Goal Definition
            </p>
            <InfoTooltip content={GOAL_HELP.goalDefinition} />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 font-mono font-semibold text-card-foreground">
              <span>UoM: {uomType}</span>
              <InfoTooltip content={activeUomHelp} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 font-mono font-semibold text-card-foreground">
              <span>
                Measure: {isZeroBased ? "MIN" : measurementType} (
                {(isZeroBased ? "MIN" : measurementType) === "MIN"
                  ? "Higher is better"
                  : "Lower is better"}
                )
              </span>
              <InfoTooltip content={activeMeasurementHelp} />
            </span>
          </div>
        </div>
        <FieldHint className="mt-1 text-sm">
          Capture the business outcome, measurement basis, and governance weightage.
        </FieldHint>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel tooltip={GOAL_HELP.thrustArea}>
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
          <FieldLabel tooltip={GOAL_HELP.title}>
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
        <FieldLabel tooltip={GOAL_HELP.description}>
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
          <FieldLabel tooltip={getUomFieldHelp(uomType)}>
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

        <Field>
          <FieldLabel tooltip={activeMeasurementHelp}>
            Measurement Type (MIN / MAX)
          </FieldLabel>
          <Select
            {...register("measurement_type")}
            aria-disabled={isZeroBased || (isEditMode && isShared)}
            className={
              isZeroBased || (isEditMode && isShared)
                ? "pointer-events-none bg-muted text-muted-foreground"
                : undefined
            }
            hasError={Boolean(errors.measurement_type)}
            tabIndex={isZeroBased || (isEditMode && isShared) ? -1 : undefined}
          >
            {measurementOptions.map((option) => (
              <option key={option} value={option}>
                {option} ({option === "MIN" ? "Higher is better" : "Lower is better"})
              </option>
            ))}
          </Select>
          <FieldError message={errors.measurement_type?.message} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel tooltip={GOAL_HELP.targetValue}>
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
          <FieldLabel tooltip={GOAL_HELP.weightage}>
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
          <FieldLabel tooltip={GOAL_HELP.targetDate}>
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
