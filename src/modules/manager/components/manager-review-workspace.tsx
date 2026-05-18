import { useMemo, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import type {
  ApproveGoalPayload,
  Goal,
  ReturnGoalPayload,
} from "@/types/goal"

import {
  useApproveGoal,
  useReturnGoal,
  useReviewGoals,
} from "../hooks/use-manager-review"
import {
  getReviewGoalCount,
  toEmployeeReviewGroups,
} from "../utils/review-goals"
import ApproveGoalModal from "./approve-goal-modal"
import EmployeeReviewSection from "./employee-review-section"
import ReturnGoalModal from "./return-goal-modal"
import ReviewEmptyState from "./review-empty-state"

type ModalState =
  | { type: "approve"; goal: Goal }
  | { type: "return"; goal: Goal }
  | null

function getErrorMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? error.response?.data?.detail || fallback
    : fallback
}

function ManagerReviewWorkspace() {
  const [modal, setModal] = useState<ModalState>(null)
  const { data = {}, isLoading, isError, error } = useReviewGoals()
  const approveMutation = useApproveGoal()
  const returnMutation = useReturnGoal()

  const groups = useMemo(
    () => toEmployeeReviewGroups(data),
    [data]
  )
  const totalReviewGoals = useMemo(
    () => getReviewGoalCount(groups),
    [groups]
  )

  function handleApprove(goalId: string, payload: ApproveGoalPayload) {
    approveMutation.mutate(
      {
        goalId,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Goal approved")
          setModal(null)
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Approval failed"))
        },
      }
    )
  }

  function handleReturn(goalId: string, payload: ReturnGoalPayload) {
    returnMutation.mutate(
      {
        goalId,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Goal returned")
          setModal(null)
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Return failed"))
        },
      }
    )
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading review queue...</div>
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-4 text-destructive">
        {getErrorMessage(error, "Unable to load review goals")}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Manager Review Queue
          </p>
          <h1 className="mt-1 text-3xl font-bold text-card-foreground">
            Review Goals
          </h1>

          <p className="mt-1 text-muted-foreground">
            Approve, tweak, or return submitted employee goals
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm font-semibold text-surface-foreground shadow-sm">
          {totalReviewGoals} pending {totalReviewGoals === 1 ? "goal" : "goals"}
        </div>
      </div>

      {groups.length === 0 ? (
        <ReviewEmptyState />
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <EmployeeReviewSection
              group={group}
              key={group.employeeName}
              onApprove={(goal) =>
                setModal({
                  type: "approve",
                  goal,
                })
              }
              onReturn={(goal) =>
                setModal({
                  type: "return",
                  goal,
                })
              }
            />
          ))}
        </div>
      )}

      {modal?.type === "approve" && (
        <ApproveGoalModal
          goal={modal.goal}
          isSubmitting={approveMutation.isPending}
          onApprove={handleApprove}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "return" && (
        <ReturnGoalModal
          goal={modal.goal}
          isSubmitting={returnMutation.isPending}
          onClose={() => setModal(null)}
          onReturn={handleReturn}
        />
      )}
    </div>
  )
}

export default ManagerReviewWorkspace
