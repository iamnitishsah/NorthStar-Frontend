import axios from "axios"
import { toast } from "sonner"

import { ModalShell } from "@/components/ui/surface"
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

  function handleUpdate(goal: Goal, payload: UpdateGoalPayload) {
    updateMutation.mutate(
      {
        goalId: goal.goal_id,
        payload,
        isSharedGoal: goal.is_shared,
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
    <ModalShell
      title={mode === "edit" ? "Edit Goal" : "Create Goal"}
      description="Goals remain editable until they are submitted and approved."
      maxWidth="3xl"
      onClose={onClose}
    >
      <GoalForm
        goal={goal}
        isSubmitting={isSubmitting}
        mode={mode}
        onCancel={onClose}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
      />
    </ModalShell>
  )
}

export default GoalModal
