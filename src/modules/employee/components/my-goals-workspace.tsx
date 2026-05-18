import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import type { Goal } from "@/types/goal"
import type { QuarterlyCheckinPayload } from "@/types/goal"

import { useMyGoals } from "../hooks/use-my-goals"
import {
  useDeleteGoal,
  useQuarterlyCheckin,
  useRequestGoalUnlock,
  useSubmitGoals,
} from "../hooks/use-goal-actions"
import { isEditableGoal } from "../utils/goal-form"
import GoalCard from "./goal-card"
import GoalModal from "./goal-modal"
import GoalsEmptyState from "./goals-empty-state"
import GoalsSummary from "./goals-summary"
import QuarterlyCheckinModal from "./quarterly-checkin-modal"
import UnlockRequestModal from "./unlock-request-modal"

type ModalState =
  | { mode: "create"; goal?: undefined }
  | { mode: "edit"; goal: Goal }
  | { mode: "checkin"; goal: Goal }
  | { mode: "unlock-request"; goal: Goal }
  | null

function getErrorMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? error.response?.data?.detail || fallback
    : fallback
}

function MyGoalsWorkspace() {
  const [modal, setModal] = useState<ModalState>(null)
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([])
  const { data = [], isLoading, isError, error } = useMyGoals()
  const deleteMutation = useDeleteGoal()
  const submitMutation = useSubmitGoals()
  const checkinMutation = useQuarterlyCheckin()
  const unlockRequestMutation = useRequestGoalUnlock()

  const editableGoals = useMemo(
    () => data.filter(isEditableGoal),
    [data]
  )
  const lockedGoals = useMemo(
    () => data.filter((goal) => goal.status === "LOCKED"),
    [data]
  )
  const lockedWeightage = useMemo(
    () => lockedGoals.reduce((sum, goal) => sum + goal.weightage, 0),
    [lockedGoals]
  )
  const editableGoalIds = useMemo(
    () => new Set(editableGoals.map((goal) => goal.goal_id)),
    [editableGoals]
  )
  const activeSelectedGoalIds = useMemo(
    () => selectedGoalIds.filter((goalId) => editableGoalIds.has(goalId)),
    [editableGoalIds, selectedGoalIds]
  )
  const selectedGoals = useMemo(
    () =>
      editableGoals.filter((goal) =>
        activeSelectedGoalIds.includes(goal.goal_id)
      ),
    [activeSelectedGoalIds, editableGoals]
  )
  const selectedWeightage = useMemo(
    () =>
      selectedGoals.reduce((sum, goal) => sum + goal.weightage, 0),
    [selectedGoals]
  )
  const totalSubmissionWeightage = selectedWeightage + lockedWeightage
  const totalSubmissionGoals = selectedGoals.length + lockedGoals.length
  const canSubmit =
    selectedGoals.length > 0 &&
    totalSubmissionGoals <= 8 &&
    totalSubmissionWeightage === 100 &&
    selectedGoals.every((goal) => goal.weightage >= 10) &&
    !submitMutation.isPending

  function handleSelectGoal(goal: Goal, isSelected: boolean) {
    setSelectedGoalIds((prev) => {
      const currentSelectedIds = prev.filter((goalId) =>
        editableGoalIds.has(goalId)
      )
      const next = new Set(currentSelectedIds)

      if (isSelected) {
        if (next.size + lockedGoals.length >= 8) {
          toast.error("Submitted goals plus locked goals cannot exceed 8.")
          return prev
        }
        next.add(goal.goal_id)
      } else {
        next.delete(goal.goal_id)
      }

      return Array.from(next)
    })
  }

  function handleDelete(goalId: string) {
    if (!window.confirm("Delete this draft goal?")) return

    deleteMutation.mutate(goalId, {
      onSuccess: () => {
        toast.success("Goal deleted")
      },
      onError: (mutationError) => {
        toast.error(getErrorMessage(mutationError, "Delete failed"))
      },
    })
  }

  function handleSubmitGoals() {
    if (!canSubmit) return

    submitMutation.mutate(
      selectedGoals.map((goal) => goal.goal_id),
      {
        onSuccess: () => {
          toast.success("Goals submitted successfully")
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Submission failed"))
        },
      }
    )
  }

  function handleQuarterlyCheckin(
    goalId: string,
    payload: QuarterlyCheckinPayload
  ) {
    checkinMutation.mutate(
      {
        goalId,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Quarterly check-in saved")
          setModal(null)
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Check-in failed"))
        },
      }
    )
  }

  function handleUnlockRequest(goalId: string, reason: string) {
    unlockRequestMutation.mutate(
      {
        goalId,
        reason,
      },
      {
        onSuccess: () => {
          toast.success("Unlock request submitted")
          setModal(null)
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Unlock request failed"))
        },
      }
    )
  }

  if (isLoading) {
    return <div className="text-slate-600">Loading goals...</div>
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {getErrorMessage(error, "Unable to load goals")}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00897B]">
            Employee Workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            My Goals
          </h1>

          <p className="mt-1 text-slate-500">
            Build, submit, and track quarterly commitments with clear ownership.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-[#00897B]/40 hover:bg-[#00897B]/5 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => setModal({ mode: "create" })}
            type="button"
          >
            <Plus size={16} />
            Create Goal
          </button>

          <button
            onClick={handleSubmitGoals}
            disabled={!canSubmit}
            className="rounded-md bg-[#0D47A1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0A3A85] disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Goals"}
          </button>
        </div>
      </div>

      <GoalsSummary
        goals={data}
        lockedGoals={lockedGoals}
        selectedGoals={selectedGoals}
      />

      {data.length === 0 ? (
        <GoalsEmptyState onCreate={() => setModal({ mode: "create" })} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((goal) => (
            <GoalCard
              goal={goal}
              key={goal.goal_id}
              isSelected={activeSelectedGoalIds.includes(goal.goal_id)}
              onDelete={handleDelete}
              onEdit={(selectedGoal) =>
                setModal({
                  mode: "edit",
                  goal: selectedGoal,
                })
              }
              onCheckin={(selectedGoal) =>
                setModal({
                  mode: "checkin",
                  goal: selectedGoal,
                })
              }
              onRequestUnlock={(selectedGoal) =>
                setModal({
                  mode: "unlock-request",
                  goal: selectedGoal,
                })
              }
              onSelectChange={isEditableGoal(goal) ? handleSelectGoal : undefined}
            />
          ))}
        </div>
      )}

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <GoalModal
          goal={modal.goal}
          mode={modal.mode}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.mode === "checkin" && (
        <QuarterlyCheckinModal
          goal={modal.goal}
          isSubmitting={checkinMutation.isPending}
          onClose={() => setModal(null)}
          onSubmit={handleQuarterlyCheckin}
        />
      )}

      {modal?.mode === "unlock-request" && (
        <UnlockRequestModal
          goal={modal.goal}
          isSubmitting={unlockRequestMutation.isPending}
          onClose={() => setModal(null)}
          onSubmit={handleUnlockRequest}
        />
      )}
    </div>
  )
}

export default MyGoalsWorkspace
