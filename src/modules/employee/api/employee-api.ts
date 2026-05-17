import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"

import type { ApiMessageResponse, Goal } from "@/types/goal"

export async function fetchMyGoals() {
  const response =
    await api.get<Goal[]>(
      endpoints.employeeGoals.my
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
