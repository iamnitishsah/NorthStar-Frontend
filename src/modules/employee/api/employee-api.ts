import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import { normalizeQuarterMap } from "@/modules/quarterly/utils/quarterly"

import type {
  ApiMessageResponse,
  CreateGoalPayload,
  Goal,
  QuarterlyCheckinPayload,
  UpdateGoalPayload,
} from "@/types/goal"

export async function fetchMyGoals() {
  const [personalResponse, sharedResponse] =
    await Promise.all([
      api.get<Goal[]>(endpoints.employeeGoals.my),
      api.get<Goal[]>(endpoints.employeeGoals.mySharedGoals),
    ])

  return [
    ...personalResponse.data,
    ...sharedResponse.data,
  ]
    .map(normalizeQuarterMap)
    .sort((left, right) => {
      const leftDate = left.created_at ? Date.parse(left.created_at) : 0
      const rightDate = right.created_at ? Date.parse(right.created_at) : 0

      return rightDate - leftDate
    })
}

export async function createGoal(
  payload: CreateGoalPayload
) {
  const response = await api.post<ApiMessageResponse>(
    endpoints.employeeGoals.root,
    payload
  )

  return response.data
}

export async function updateGoal({
  goalId,
  payload,
  isSharedGoal,
}: {
  goalId: string
  payload: UpdateGoalPayload
  isSharedGoal?: boolean
}) {
  if (isSharedGoal) {
    if (typeof payload.weightage !== "number") {
      throw new Error("Weightage is required to update shared goals.")
    }

    const response = await api.patch<ApiMessageResponse>(
      endpoints.employeeGoals.updateWeightage(goalId),
      {
        weightage: payload.weightage,
      }
    )

    return response.data
  }

  const response = await api.patch<ApiMessageResponse>(
    endpoints.employeeGoals.byId(goalId),
    payload
  )

  return response.data
}

export async function updateQuarterlyCheckin({
  goalId,
  payload,
}: {
  goalId: string
  payload: QuarterlyCheckinPayload
}) {
  const response = await api.patch<ApiMessageResponse>(
    endpoints.employeeGoals.quarterlyCheckin(goalId),
    payload
  )

  return response.data
}

export async function requestGoalUnlock({
  goalId,
  reason,
}: {
  goalId: string
  reason: string
}) {
  const response = await api.post<ApiMessageResponse>(
    endpoints.employeeGoals.unlockRequest(goalId),
    { reason }
  )

  return response.data
}

export async function deleteGoal(
  goalId: string
) {
  const response = await api.delete<ApiMessageResponse>(
    endpoints.employeeGoals.byId(goalId)
  )

  return response.data
}

export async function submitGoals(
  goalIds: string[]
) {
  const response = await api.post<ApiMessageResponse>(
    endpoints.employeeGoals.submit,
    goalIds
  )

  return response.data
}
