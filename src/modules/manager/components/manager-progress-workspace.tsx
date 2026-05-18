import { useMemo, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import type { Goal, QuarterlyCommentPayload } from "@/types/goal"

import {
  useManagerGoals,
  useQuarterlyComment,
} from "../hooks/use-manager-review"
import {
  getReviewGoalCount,
  toEmployeeReviewGroups,
} from "../utils/review-goals"
import ManagerProgressEmptyState from "./manager-progress-empty-state"
import ManagerProgressSection from "./manager-progress-section"
import QuarterlyCommentModal from "./quarterly-comment-modal"

type CommentState = {
  goal: Goal
  quarter: number
} | null

function getErrorMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? error.response?.data?.detail || fallback
    : fallback
}

function ManagerProgressWorkspace() {
  const [commentState, setCommentState] = useState<CommentState>(null)
  const { data = {}, isLoading, isError, error } = useManagerGoals()
  const commentMutation = useQuarterlyComment()

  const groups = useMemo(
    () => toEmployeeReviewGroups(data),
    [data]
  )
  const totalGoals = useMemo(
    () => getReviewGoalCount(groups),
    [groups]
  )

  function handleComment(goalId: string, payload: QuarterlyCommentPayload) {
    commentMutation.mutate(
      {
        goalId,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Quarterly comment saved")
          setCommentState(null)
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Comment failed"))
        },
      }
    )
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading quarterly progress...</div>
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-4 text-destructive">
        {getErrorMessage(error, "Unable to load manager goals")}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Quarterly Progress
          </h1>

          <p className="mt-1 text-muted-foreground">
            Track employee check-ins, progress trends, and manager comments
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-surface-foreground">
          {totalGoals} tracked {totalGoals === 1 ? "goal" : "goals"}
        </div>
      </div>

      {groups.length === 0 ? (
        <ManagerProgressEmptyState />
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <ManagerProgressSection
              group={group}
              key={group.employeeName}
              onComment={(goal, quarter) =>
                setCommentState({
                  goal,
                  quarter,
                })
              }
            />
          ))}
        </div>
      )}

      {commentState && (
        <QuarterlyCommentModal
          goal={commentState.goal}
          isSubmitting={commentMutation.isPending}
          onClose={() => setCommentState(null)}
          onSubmit={handleComment}
          quarter={commentState.quarter}
        />
      )}
    </div>
  )
}

export default ManagerProgressWorkspace
