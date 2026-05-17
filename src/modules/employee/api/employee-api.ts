import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"

import type {
  ApiMessageResponse,
  CreateGoalPayload,
  Goal,
  QuarterlyCheckinPayload,
  UpdateGoalPayload,
} from "@/types/goal"

export async function fetchMyGoals() {
  const response =
    await api.get<Goal[]>(
      endpoints.employeeGoals.my
    )

  return response.data
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
}: {
  goalId: string
  payload: UpdateGoalPayload
}) {
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
