import { LockOpen } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

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
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-200">
          <LockOpen size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Goal Unlock Control
          </h2>
          <p className="text-sm text-slate-500">
            Unlock a locked goal by goal ID. Candidate IDs are inferred from audit logs when available.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
          onChange={(event) => setGoalId(event.target.value)}
          placeholder="Enter locked goal ID"
          value={goalId}
        />
        <button
          className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canSubmit}
          onClick={() => handleUnlock()}
          type="button"
        >
          {unlockMutation.isPending ? "Unlocking..." : "Unlock Goal"}
        </button>
      </div>

      {lockedGoalCandidates.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Locked goal candidates
          </p>
          <div className="flex flex-wrap gap-2">
            {lockedGoalCandidates.slice(0, 8).map((candidate) => (
              <button
                className="max-w-full truncate rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                key={candidate}
                onClick={() => handleUnlock(candidate)}
                type="button"
              >
                {candidate}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default UnlockGoalPanel
