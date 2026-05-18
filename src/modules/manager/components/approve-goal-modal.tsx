import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import Button from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Input } from "@/components/ui/form"
import { ModalFooter, ModalShell, SectionCard } from "@/components/ui/surface"
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
          <SectionCard>
            <p className="text-sm text-muted-foreground">
              {goal.thrust_area}
            </p>
            <h3 className="font-semibold text-surface-foreground">
              {goal.title}
            </h3>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>
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
              <FieldLabel>
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
