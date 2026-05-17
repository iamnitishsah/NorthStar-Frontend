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

  const { data, isLoading } =
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
    return <div>Loading...</div>
  }

  const totalWeightage =
    data?.reduce(
      (acc, goal) =>
        acc + goal.weightage,
      0
    ) || 0

  const draftGoals =
    data?.filter(
      (goal) =>
        goal.status === "DRAFT" ||
        goal.status === "RETURNED"
    ) || []

  function handleSubmitGoals() {
    submitMutation.mutate(
      draftGoals.map(
        (goal) => goal.goal_id
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
          disabled={
            draftGoals.length === 0
          }
          className="bg-slate-900 text-white px-5 py-3 rounded-xl"
        >
          Submit Goals
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex justify-between">
          <span>
            Total Weightage
          </span>

          <span className="font-bold">
            {totalWeightage}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data?.map((goal) => (
          <GoalCard
            key={goal.goal_id}
            goal={goal}
            onDelete={(id) =>
              deleteMutation.mutate(
                id
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

export default MyGoalsPage