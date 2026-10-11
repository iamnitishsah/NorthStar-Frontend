import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import Button from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  Select,
} from "@/components/ui/form"
import InfoTooltip from "@/components/ui/info-tooltip"
import { ModalFooter, ModalShell, SectionCard } from "@/components/ui/surface"
import {
  GOAL_HELP,
  getCheckinAchievementHelp,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomHelp,
} from "@/lib/goal-help"
import type {
  Goal,
  ProgressStatus,
  QuarterKey,
  QuarterlyCheckinPayload,
} from "@/types/goal"
import { getTodayDateInputValue } from "@/modules/employee/utils/goal-form"
import { quarterKeys } from "@/modules/quarterly/utils/quarterly"

type Props = {
  goal: Goal
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (goalId: string, payload: QuarterlyCheckinPayload) => void
}

const progressStatusOptions: ProgressStatus[] = [
  "NOT_STARTED",
  "ON_TRACK",
  "COMPLETED",
]

type CheckinFormValues = {
  quarter: "1" | "2" | "3" | "4"
  achievement_value: string | number
  progress_status: ProgressStatus
}

function QuarterlyCheckinModal({
  goal,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const isTimeline = goal.uom_type === "TIMELINE"
  const nextQuarter =
    quarterKeys.find((quarter) => !goal.quarter?.[quarter]) ?? "4"
  const hasOpenQuarter = !goal.quarter?.[nextQuarter]
  const minAchievementDate = getTodayDateInputValue()
  const checkinSchema = z.object({
    quarter: z.enum(["1", "2", "3", "4"]),
    achievement_value: isTimeline
      ? z
          .string()
          .min(1, "Achievement date is required")
          .regex(
            /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/,
            "Use ISO date format (YYYY-MM-DD)"
          )
          .refine(
            (value) => value.slice(0, 10) >= minAchievementDate,
            "Achievement date cannot be in the past"
          )
      : goal.uom_type === "ZERO_BASED"
        ? z.number().min(0, "Achievement value cannot be negative")
        : z.number().gt(0, "Achievement value must be positive"),
    progress_status: z.enum(progressStatusOptions),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckinFormValues>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      quarter: nextQuarter,
      achievement_value: isTimeline ? "" : 0,
      progress_status: "ON_TRACK",
    },
  })

  function submit(values: CheckinFormValues) {
    const quarter = values.quarter as QuarterKey

    onSubmit(goal.goal_id, {
      quarter: {
        [quarter]: {
          achievement_value: values.achievement_value,
          progress_status: values.progress_status,
        },
      },
    })
  }

  return (
    <ModalShell
      title="Quarterly Check-in"
      description={goal.title}
      onClose={onClose}
      footer={
        <ModalFooter>
          <Button
            disabled={isSubmitting}
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || !hasOpenQuarter}
            form="quarterly-checkin-form"
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save Check-in"}
          </Button>
        </ModalFooter>
      }
    >
        <form
          className="space-y-5"
          id="quarterly-checkin-form"
          onSubmit={handleSubmit(submit)}
        >
          <SectionCard className="space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                <span>Thrust Area: {goal.thrust_area}</span>
                <InfoTooltip content={GOAL_HELP.thrustArea} />
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-surface-foreground">
                <span>Weightage: {goal.weightage}%</span>
                <InfoTooltip content={GOAL_HELP.weightage} />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-surface-foreground">
              <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1">
                <span>
                  Target: <strong>{goal.target_value}</strong>
                </span>
                <InfoTooltip content={getGoalTargetHelp(goal)} />
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1">
                <span>UoM: {goal.uom_type}</span>
                <InfoTooltip content={getUomHelp(goal.uom_type)} />
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1">
                <span>
                  Measure: {goal.measurement_type} (
                  {goal.measurement_type === "MIN"
                    ? "Higher is better"
                    : "Lower is better"}
                  )
                </span>
                <InfoTooltip
                  content={getMeasurementHelp(goal.measurement_type, goal.uom_type)}
                />
              </span>
            </div>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel tooltip={GOAL_HELP.quarterSequence}>
                Quarter
              </FieldLabel>
              <Select
                {...register("quarter")}
                disabled
              >
                <option value={nextQuarter}>Q{nextQuarter}</option>
              </Select>
              <FieldHint>
                Check-ins are submitted one quarter at a time in sequence.
              </FieldHint>
            </Field>

            <Field>
              <FieldLabel tooltip={getCheckinAchievementHelp(goal)}>
                {isTimeline ? "Achievement Date" : "Achievement Value"}
              </FieldLabel>
              <Input
                {...register("achievement_value", isTimeline ? {} : {
                  valueAsNumber: true,
                })}
                hasError={Boolean(errors.achievement_value)}
                min={isTimeline ? minAchievementDate : 0}
                step={isTimeline ? undefined : "any"}
                type={isTimeline ? "date" : "number"}
              />
              <FieldError message={errors.achievement_value?.message} />
            </Field>
          </div>

          <Field>
            <FieldLabel tooltip={GOAL_HELP.progressStatus}>
              Progress Status
            </FieldLabel>
            <Select
              {...register("progress_status")}
            >
              {progressStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <FieldError />
          </Field>
        </form>
    </ModalShell>
  )
}

export default QuarterlyCheckinModal
