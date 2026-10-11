import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import Button from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Input } from "@/components/ui/form"
import InfoTooltip from "@/components/ui/info-tooltip"
import { ModalFooter, ModalShell, SectionCard } from "@/components/ui/surface"
import {
  GOAL_HELP,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomHelp,
} from "@/lib/goal-help"
import type { ApproveGoalPayload, Goal } from "@/types/goal"

type Props = {
  goal: Goal
  isSubmitting: boolean
  onClose: () => void
  onApprove: (goalId: string, payload: ApproveGoalPayload) => void
}

function getApproveSchema() {
  return z.object({
    target_value: z.number(),
    weightage: z.number().min(10).max(100),
  })
  .superRefine((value, context) => {
    if (value.target_value <= 0) {
      context.addIssue({
        code: "custom",
        message: "Target value must be greater than 0",
        path: ["target_value"],
      })
    }
  })
}

type ApproveFormValues = z.infer<ReturnType<typeof getApproveSchema>>

function ApproveGoalModal({
  goal,
  isSubmitting,
  onClose,
  onApprove,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApproveFormValues>({
    resolver: zodResolver(getApproveSchema()),
    defaultValues: {
      target_value: goal.target_value,
      weightage: goal.weightage,
    },
  })

  function submit(values: ApproveFormValues) {
    onApprove(goal.goal_id, {
      target_value: values.target_value,
      weightage: values.weightage,
    })
  }

  return (
    <ModalShell
      title="Approve Goal"
      description="Review and optionally tweak the target or weightage before locking."
      onClose={onClose}
      footer={
        <ModalFooter>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            form="approve-goal-form"
            type="submit"
          >
            {isSubmitting ? "Approving..." : "Approve Goal"}
          </Button>
        </ModalFooter>
      }
    >
        <form
          className="space-y-5"
          id="approve-goal-form"
          onSubmit={handleSubmit(submit)}
        >
          <SectionCard className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span>{goal.thrust_area}</span>
                <InfoTooltip content={GOAL_HELP.thrustArea} />
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-surface-foreground">
                <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5">
                  <span>UoM: {goal.uom_type}</span>
                  <InfoTooltip content={getUomHelp(goal.uom_type)} />
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5">
                  <span>
                    Measure: {goal.measurement_type} (
                    {goal.measurement_type === "MIN"
                      ? "Higher is better"
                      : "Lower is better"}
                    )
                  </span>
                  <InfoTooltip
                    content={getMeasurementHelp(
                      goal.measurement_type,
                      goal.uom_type
                    )}
                  />
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-surface-foreground">
                {goal.title}
              </h3>
              <InfoTooltip content={getGoalTargetHelp(goal)} />
            </div>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel tooltip={GOAL_HELP.targetValue}>
                Target Value
              </FieldLabel>
              <Input
                {...register("target_value", {
                  valueAsNumber: true,
                })}
                hasError={Boolean(errors.target_value)}
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
                {...register("weightage", {
                  valueAsNumber: true,
                })}
                hasError={Boolean(errors.weightage)}
                max={100}
                min={10}
                type="number"
              />
              <FieldError message={errors.weightage?.message} />
            </Field>
          </div>
        </form>
    </ModalShell>
  )
}

export default ApproveGoalModal
