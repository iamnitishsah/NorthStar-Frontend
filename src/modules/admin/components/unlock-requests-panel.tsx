import { Check, X } from "lucide-react"
import { toast } from "sonner"

import Button from "@/components/ui/button"
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
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Pending Unlock Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review employee requests before locked goals move to admin unlocked.
          </p>
        </div>
        <span className="shrink-0 rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {data.length} pending
        </span>
      </div>

      {isLoading && (
        <div className="mt-5 text-sm text-slate-600">
          Loading unlock requests...
        </div>
      )}

      {isError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Unable to load unlock requests.
        </div>
      )}

      {!isLoading && !isError && data.length === 0 && (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          No pending unlock requests.
        </div>
      )}

      {!isLoading && !isError && data.length > 0 && (
        <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
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
                    <p className="font-medium text-slate-950 dark:text-white">
                      {getRequester(request)}
                    </p>
                    <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-400/15 dark:text-yellow-200">
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-slate-500">
                    Goal ID: {request.goal_id}
                  </p>
                  {request.reason && (
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
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
    </section>
  )
}

export default UnlockRequestsPanel
