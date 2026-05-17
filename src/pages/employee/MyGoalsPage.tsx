import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"
import axios from "axios"

import {
  deleteGoal,
  submitGoals,
} from "@/modules/employee/api/employee-api"

import { useMyGoals } from "@/modules/employee/hooks/use-my-goals"

import GoalCard from "@/modules/employee/components/goal-card"

function MyGoalsPage() {
  const queryClient =
    useQueryClient()

  const { data = [], isLoading, isError, error } =
    useMyGoals()

  const deleteMutation =
    useMutation({
      mutationFn: deleteGoal,

      onSuccess: () => {
        toast.success(
          "Goal deleted"
        )

        queryClient.invalidateQueries(
          {
            queryKey: [
              "my-goals",
            ],
          }
        )
      },

      onError: (error: unknown) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.detail || "Delete failed"
          : "Delete failed"

        toast.error(message)
      },
    })

  const submitMutation =
    useMutation({
      mutationFn: submitGoals,

      onSuccess: () => {
        toast.success(
          "Goals submitted successfully"
        )

        queryClient.invalidateQueries(
          {
            queryKey: [
              "my-goals",
            ],
          }
        )
      },

      onError: (error: unknown) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.detail || "Submission failed"
          : "Submission failed"

        toast.error(message)
      },
    })

  if (isLoading) {
    return <div className="text-slate-600">Loading goals...</div>
  }

  if (isError) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.detail || "Unable to load goals"
      : "Unable to load goals"

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {message}
      </div>
    )
  }

  const totalWeightage =
    data.reduce(
      (acc, goal) =>
        acc + goal.weightage,
      0
    )

  const draftGoals =
    data.filter(
      (goal) =>
        goal.status === "DRAFT" ||
        goal.status === "RETURNED"
    )

  const canSubmit =
    draftGoals.length > 0 &&
    totalWeightage === 100 &&
    !submitMutation.isPending

  function handleSubmitGoals() {
    if (!canSubmit) return

    submitMutation.mutate(
      draftGoals.map(
        (goal) => goal.goal_id
      )
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

        <button
          onClick={handleSubmitGoals}
          disabled={!canSubmit}
          className="rounded-lg bg-slate-900 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
        >
          {submitMutation.isPending ? "Submitting..." : "Submit Goals"}
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex justify-between gap-4">
          <span>
            Total Weightage
          </span>

          <span className="font-bold">
            {totalWeightage}%
          </span>
        </div>

        {draftGoals.length > 0 && totalWeightage !== 100 && (
          <p className="mt-2 text-sm text-amber-700">
            Backend submission requires the combined active goal weightage to equal 100%.
          </p>
        )}
      </div>

      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No goals found.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((goal) => (
            <GoalCard
              key={goal.goal_id}
              goal={goal}
              onDelete={(id) =>
                window.confirm("Delete this draft goal?") &&
                deleteMutation.mutate(
                  id
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyGoalsPage
