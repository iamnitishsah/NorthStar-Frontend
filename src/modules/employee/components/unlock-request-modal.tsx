import { useState } from "react"

import Button from "@/components/ui/button"
import { Field, FieldHint, FieldLabel, Textarea } from "@/components/ui/form"
import { ModalFooter, ModalShell } from "@/components/ui/surface"
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
        <Field>
          <FieldLabel>
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
    </ModalShell>
  )
}

export default UnlockRequestModal
