import { api } from "@/services/api"

import type { Goal } from "@/types/goal"

export async function fetchMyGoals() {
  const response =
    await api.get<Goal[]>(
      "/employee/goals/my"
    )

  return response.data
}

export async function deleteGoal(
  goalId: string
) {
  const response = await api.delete(
    `/employee/goals/${goalId}`
  )

  return response.data
}

export async function submitGoals(
  goalIds: string[]
) {
  const response = await api.post(
    "/employee/goals/submit",
    goalIds
  )

  return response.data
}