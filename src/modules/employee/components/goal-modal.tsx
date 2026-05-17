import { X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import type { CreateGoalPayload, Goal, UpdateGoalPayload } from "@/types/goal"

import {
  useCreateGoal,
  useUpdateGoal,
} from "../hooks/use-goal-actions"
import GoalForm from "./goal-form"

type Props = {
  mode: "create" | "edit"
  goal?: Goal
  onClose: () => void
}

function getErrorMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? error.response?.data?.detail || fallback
    : fallback
}

function GoalModal({
  mode,
  goal,
  onClose,
}: Props) {
  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const isSubmitting =
    createMutation.isPending || updateMutation.isPending

  function handleCreate(payload: CreateGoalPayload) {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Goal created")
        onClose()
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Create goal failed"))
      },
    })
  }

  function handleUpdate(goalId: string, payload: UpdateGoalPayload) {
    updateMutation.mutate(
      {
        goalId,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Goal updated")
          onClose()
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Update goal failed"))
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {mode === "edit" ? "Edit Goal" : "Create Goal"}
            </h2>
            <p className="text-sm text-slate-500">
              Goals remain editable until they are submitted and approved.
            </p>
          </div>

          <button
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <GoalForm
            goal={goal}
            isSubmitting={isSubmitting}
            mode={mode}
            onCancel={onClose}
            onSubmit={handleCreate}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default GoalModal
