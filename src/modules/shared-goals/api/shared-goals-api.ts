import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import type { Goal, SharedGoalPushPayload, SharedGoalPushResponse } from "@/types/goal"

export async function pushSharedGoal(payload: SharedGoalPushPayload) {
  const response = await api.post<SharedGoalPushResponse>(
    endpoints.sharedGoals.push,
    payload
  )

  return response.data
}

export async function fetchPushedSharedGoals() {
  const response = await api.get<Goal[]>(
    endpoints.sharedGoals.pushed
  )

  return response.data
}
