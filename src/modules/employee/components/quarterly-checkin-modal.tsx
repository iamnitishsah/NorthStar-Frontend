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
import { ModalFooter, ModalShell } from "@/components/ui/surface"
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>
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
              <FieldLabel>
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
            <FieldLabel>
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
