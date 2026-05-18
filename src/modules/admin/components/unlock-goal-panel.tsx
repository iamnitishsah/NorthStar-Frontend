import { LockOpen } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import Button from "@/components/ui/button"
import { Input } from "@/components/ui/form"
import { Panel } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import { useUnlockGoal } from "../hooks/use-admin"

type Props = {
  lockedGoalCandidates: string[]
}

function getErrorMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? error.response?.data?.detail || fallback
    : fallback
}

function UnlockGoalPanel({ lockedGoalCandidates }: Props) {
  const [goalId, setGoalId] = useState("")
  const unlockMutation = useUnlockGoal()
  const canSubmit = goalId.trim().length > 0 && !unlockMutation.isPending

  function handleUnlock(selectedGoalId = goalId) {
    const id = selectedGoalId.trim()
    if (!id) return
    if (!window.confirm(`Unlock goal ${id}?`)) return

    unlockMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Goal unlocked")
        setGoalId("")
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Unlock failed"))
      },
    })
  }

  return (
    <Panel className="min-w-0">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <LockOpen size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-card-foreground">
            Goal Unlock Control
          </h2>
          <p className="text-sm text-muted-foreground">
            Unlock a locked goal by goal ID. Candidate IDs are inferred from audit logs when available.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Input
          className="min-w-0 flex-1"
          onChange={(event) => setGoalId(event.target.value)}
          placeholder="Enter locked goal ID"
          value={goalId}
        />
        <Button
          className="shrink-0"
          disabled={!canSubmit}
          onClick={() => handleUnlock()}
          type="button"
          variant="danger"
        >
          {unlockMutation.isPending ? "Unlocking..." : "Unlock Goal"}
        </Button>
      </div>

      {lockedGoalCandidates.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-surface-foreground">
            Locked goal candidates
          </p>
          <div className="flex flex-wrap gap-2">
            {lockedGoalCandidates.slice(0, 8).map((candidate) => (
              <button
                className="max-w-full"
                key={candidate}
                onClick={() => handleUnlock(candidate)}
                type="button"
              >
                <StatusBadge className="max-w-full" tone="default">
                  {candidate}
                </StatusBadge>
              </button>
            ))}
          </div>
        </div>
      )}
    </Panel>
  )
}

export default UnlockGoalPanel
