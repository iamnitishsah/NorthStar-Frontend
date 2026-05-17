import { useState } from "react"

import Button from "@/components/ui/button"
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
  const canSubmit = trimmedReason.length >= 3 && !isSubmitting

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Unlock request
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            {goal.title}
          </h2>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">
            Reason
          </span>
          <textarea
            className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what needs to change in this locked goal."
            value={reason}
          />
        </label>

        <div className="mt-5 flex justify-end gap-3">
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
        </div>
      </div>
    </div>
  )
}

export default UnlockRequestModal
