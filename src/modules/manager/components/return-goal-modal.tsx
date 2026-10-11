import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import Button from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Textarea } from "@/components/ui/form"
import InfoTooltip from "@/components/ui/info-tooltip"
import { ModalFooter, ModalShell, SectionCard } from "@/components/ui/surface"
import {
  GOAL_HELP,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomHelp,
} from "@/lib/goal-help"
import type { Goal, ReturnGoalPayload } from "@/types/goal"

type Props = {
  goal: Goal
  isSubmitting: boolean
  onClose: () => void
  onReturn: (goalId: string, payload: ReturnGoalPayload) => void
}

const returnSchema = z.object({
  manager_note: z.string().trim().min(1, "Manager note is required").max(500),
})

type ReturnFormValues = z.infer<typeof returnSchema>

function ReturnGoalModal({
  goal,
  isSubmitting,
  onClose,
  onReturn,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      manager_note: "",
    },
  })

  function submit(values: ReturnFormValues) {
    onReturn(goal.goal_id, {
      manager_note: values.manager_note.trim(),
    })
  }

  return (
    <ModalShell
      title="Return Goal"
      description="Add a clear note so the employee can revise and resubmit."
      onClose={onClose}
      footer={
        <ModalFooter>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            form="return-goal-form"
            type="submit"
            variant="danger"
          >
            {isSubmitting ? "Returning..." : "Return Goal"}
          </Button>
        </ModalFooter>
      }
    >
        <form
          className="space-y-5"
          id="return-goal-form"
          onSubmit={handleSubmit(submit)}
        >
          <SectionCard>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground">
                {goal.thrust_area}
              </p>
              <InfoTooltip content={GOAL_HELP.thrustArea} />
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <h3 className="font-semibold text-surface-foreground">
                {goal.title}
              </h3>
              <InfoTooltip content={GOAL_HELP.title} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5 font-mono text-surface-foreground">
                <span>Weightage: {goal.weightage}%</span>
                <InfoTooltip content={GOAL_HELP.weightage} />
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5 font-mono text-surface-foreground">
                <span>Target: {goal.target_value} {goal.uom_type}</span>
                <InfoTooltip content={getGoalTargetHelp(goal)} />
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5 font-mono text-surface-foreground">
                <span>UoM: {goal.uom_type}</span>
                <InfoTooltip content={getUomHelp(goal.uom_type)} />
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5 font-mono text-surface-foreground">
                <span>
                  Measure: {goal.measurement_type} ({goal.measurement_type === "MIN" ? "Higher is better" : "Lower is better"})
                </span>
                <InfoTooltip
                  content={getMeasurementHelp(goal.measurement_type, goal.uom_type)}
                />
              </span>
            </div>
          </SectionCard>

          <Field>
            <FieldLabel tooltip={GOAL_HELP.managerReturnNote}>
              Manager Note
            </FieldLabel>
            <Textarea
              {...register("manager_note")}
              className="min-h-32"
              hasError={Boolean(errors.manager_note)}
              rows={5}
            />
            <FieldError message={errors.manager_note?.message} />
          </Field>
        </form>
    </ModalShell>
  )
}

export default ReturnGoalModal
