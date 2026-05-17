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
  useSubmitGoals,
} from "../hooks/use-goal-actions"
import { isEditableGoal } from "../utils/goal-form"
import GoalCard from "./goal-card"
import GoalModal from "./goal-modal"
import GoalsEmptyState from "./goals-empty-state"
import GoalsSummary from "./goals-summary"
import QuarterlyCheckinModal from "./quarterly-checkin-modal"

type ModalState =
  | { mode: "create"; goal?: undefined }
  | { mode: "edit"; goal: Goal }
  | { mode: "checkin"; goal: Goal }
  | null

function getErrorMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? error.response?.data?.detail || fallback
    : fallback
}

function MyGoalsWorkspace() {
  const [modal, setModal] = useState<ModalState>(null)
  const { data = [], isLoading, isError, error } = useMyGoals()
  const deleteMutation = useDeleteGoal()
  const submitMutation = useSubmitGoals()
  const checkinMutation = useQuarterlyCheckin()

  const editableGoals = useMemo(
    () => data.filter(isEditableGoal),
    [data]
  )
  const totalWeightage = useMemo(
    () => data.reduce((sum, goal) => sum + goal.weightage, 0),
    [data]
  )
  const canSubmit =
    editableGoals.length > 0 &&
    data.length <= 8 &&
    totalWeightage === 100 &&
    !submitMutation.isPending

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
      editableGoals.map((goal) => goal.goal_id),
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
          <h1 className="text-3xl font-bold">
            My Goals
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your goal sheet
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={data.length >= 8}
            onClick={() => setModal({ mode: "create" })}
            type="button"
          >
            <Plus size={16} />
            Create Goal
          </button>

          <button
            onClick={handleSubmitGoals}
            disabled={!canSubmit}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Goals"}
          </button>
        </div>
      </div>

      <GoalsSummary goals={data} />

      {data.length === 0 ? (
        <GoalsEmptyState onCreate={() => setModal({ mode: "create" })} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((goal) => (
            <GoalCard
              goal={goal}
              key={goal.goal_id}
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
          goalId={modal.goal.goal_id}
          goalTitle={modal.goal.title}
          isSubmitting={checkinMutation.isPending}
          onClose={() => setModal(null)}
          onSubmit={handleQuarterlyCheckin}
        />
      )}
    </div>
  )
}

export default MyGoalsWorkspace
