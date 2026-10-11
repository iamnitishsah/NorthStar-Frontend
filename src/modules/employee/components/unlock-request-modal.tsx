import { useState } from "react"

import Button from "@/components/ui/button"
import { Field, FieldHint, FieldLabel, Textarea } from "@/components/ui/form"
import InfoTooltip from "@/components/ui/info-tooltip"
import { ModalFooter, ModalShell, SectionCard } from "@/components/ui/surface"
import {
  GOAL_HELP,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomHelp,
} from "@/lib/goal-help"
import type { Goal } from "@/types/goal"

type Props = {
  goal: Goal
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (goalId: string, reason: string) => void
}

function UnlockRequestModal({
  goal,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Props) {
  const [reason, setReason] = useState("")
  const trimmedReason = reason.trim()
  const canSubmit =
    trimmedReason.length >= 5 &&
    trimmedReason.length <= 500 &&
    !isSubmitting

  return (
    <ModalShell
      title="Unlock request"
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
            disabled={!canSubmit}
            onClick={() => onSubmit(goal.goal_id, trimmedReason)}
          >
            {isSubmitting ? "Requesting..." : "Request Unlock"}
          </Button>
        </ModalFooter>
      }
    >
      <div className="space-y-4">
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

        <Field>
          <FieldLabel tooltip={GOAL_HELP.unlockReason}>
            Reason
          </FieldLabel>
          <Textarea
            className="min-h-28"
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what needs to change in this locked goal."
            value={reason}
          />
          <FieldHint>
            {trimmedReason.length}/500 characters. Minimum 5 required.
          </FieldHint>
        </Field>
      </div>
    </ModalShell>
  )
}

export default UnlockRequestModal
