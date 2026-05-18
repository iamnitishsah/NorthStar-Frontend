import { Check, Inbox, X } from "lucide-react"
import { toast } from "sonner"

import Button from "@/components/ui/button"
import EmptyState from "@/components/ui/empty-state"
import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import { Panel } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import { getApiErrorMessage } from "@/services/api-error"
import type { UnlockRequest } from "@/types/goal"

import {
  useApproveUnlockRequest,
  useRejectUnlockRequest,
  useUnlockRequests,
} from "../hooks/use-admin"

function getRequestId(request: UnlockRequest) {
  return request.request_id || request._id || ""
}

function getRequester(request: UnlockRequest) {
  return (
    request.requester_name ||
    request.employee_name ||
    request.requester_id ||
    request.employee_id ||
    "Unknown employee"
  )
}

function UnlockRequestsPanel() {
  const { data = [], isLoading, isError } = useUnlockRequests({
    status: "PENDING",
  })
  const approveMutation = useApproveUnlockRequest()
  const rejectMutation = useRejectUnlockRequest()

  function handleApprove(request: UnlockRequest) {
    const requestId = getRequestId(request)
    if (!requestId) return
    if (!window.confirm(`Approve unlock request for goal ${request.goal_id}?`)) {
      return
    }

    approveMutation.mutate(requestId, {
      onSuccess: () => toast.success("Unlock request approved"),
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Approval failed")),
    })
  }

  function handleReject(request: UnlockRequest) {
    const requestId = getRequestId(request)
    if (!requestId) return

    const reason =
      window.prompt("Reason for rejecting this unlock request?") ?? ""

    rejectMutation.mutate(
      {
        requestId,
        reason,
      },
      {
        onSuccess: () => toast.success("Unlock request rejected"),
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Rejection failed")),
      }
    )
  }

  return (
    <Panel className="min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-card-foreground">
            Pending Unlock Requests
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review employee requests before locked goals move to admin unlocked.
          </p>
        </div>
        <StatusBadge className="shrink-0" tone="warning">
          {data.length} pending
        </StatusBadge>
      </div>

      {isLoading && (
        <div className="mt-5">
          <LoadingSkeleton rows={2} />
        </div>
      )}

      {isError && (
        <div className="mt-5">
          <ErrorState message="Unable to load unlock requests." />
        </div>
      )}

      {!isLoading && !isError && data.length === 0 && (
        <div className="mt-5">
          <EmptyState
            icon={Inbox}
            title="No pending unlock requests"
            description="Employee unlock requests will appear here when they need review."
          />
        </div>
      )}

      {!isLoading && !isError && data.length > 0 && (
        <div className="mt-5 divide-y divide-border">
          {data.map((request) => {
            const requestId = getRequestId(request)
            const isActing =
              approveMutation.isPending || rejectMutation.isPending

            return (
              <div
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-start lg:justify-between"
                key={requestId || `${request.goal_id}-${request.created_at}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-card-foreground">
                      {getRequester(request)}
                    </p>
                    <StatusBadge tone="warning">
                      {request.status}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    Goal ID: {request.goal_id}
                  </p>
                  {request.reason && (
                    <p className="mt-2 text-sm leading-6 text-surface-foreground">
                      {request.reason}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    disabled={!requestId || isActing}
                    icon={<Check size={16} />}
                    onClick={() => handleApprove(request)}
                  >
                    Approve
                  </Button>
                  <Button
                    disabled={!requestId || isActing}
                    icon={<X size={16} />}
                    onClick={() => handleReject(request)}
                    variant="secondary"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}

export default UnlockRequestsPanel
