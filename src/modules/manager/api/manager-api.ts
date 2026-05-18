import axios from "axios"

import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import { normalizeQuarterMap } from "@/modules/quarterly/utils/quarterly"
import type {
  ApiMessageResponse,
  ApproveGoalPayload,
  Goal,
  ManagerCheckinGoalResponse,
  ManagerCheckinReviewResponse,
  ManagerGoalsResponse,
  ManagerReviewGoalsResponse,
  QuarterlyCommentPayload,
  ReturnGoalPayload,
} from "@/types/goal"

const normalizeGoalGroup = (group: Record<string, Goal[]>) =>
  Object.fromEntries(
    Object.entries(group).map(([key, goals]) => [
      key,
      goals.map(normalizeQuarterMap),
    ])
  )

function normalizeCheckinGoal(goal: ManagerCheckinGoalResponse): Goal {
  const quarters = goal.quarters ?? {}

  return normalizeQuarterMap({
    goal_id: goal.goal_id,
    employee_id: goal.employee_id,
    employee_name: goal.employee_name,
    title: goal.title,
    thrust_area: goal.thrust_area,
    description: goal.description,
    uom_type: goal.uom_type ?? "NUMERIC",
    measurement_type: goal.measurement_type ?? "MIN",
    target_value: goal.planned_target_value,
    achievement_value: goal.latest_achievement_value,
    progress_percentage: goal.latest_progress_percentage,
    progress_status: goal.latest_progress_status ?? undefined,
    weightage: goal.weightage,
    target_date: goal.target_date,
    quarter: {
      "1": quarters.q1?.completed ? quarters.q1 : undefined,
      "2": quarters.q2?.completed ? quarters.q2 : undefined,
      "3": quarters.q3?.completed ? quarters.q3 : undefined,
      "4": quarters.q4?.completed ? quarters.q4 : undefined,
    },
    status: "LOCKED",
    is_shared: goal.is_shared,
    primary_owner_id: goal.primary_owner_id,
  } as Goal)
}

const normalizeCheckinGroup = (group: ManagerCheckinReviewResponse) =>
  Object.fromEntries(
    Object.entries(group).map(([key, goals]) => [
      key,
      goals.map(normalizeCheckinGoal),
    ])
  )

export async function fetchReviewGoals() {
  try {
    const response = await api.get<ManagerReviewGoalsResponse>(
      endpoints.managerGoals.review
    )

    return normalizeGoalGroup(response.data) as ManagerReviewGoalsResponse
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {}
    }

    throw error
  }
}

export async function fetchManagerGoals() {
  try {
    const response = await api.get<ManagerCheckinReviewResponse>(
      endpoints.managerGoals.checkinReview
    )

    return normalizeCheckinGroup(response.data) as ManagerGoalsResponse
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {}
    }

    throw error
  }
}

export async function approveGoal({
  goalId,
  payload,
}: {
  goalId: string
  payload: ApproveGoalPayload
}) {
  const response = await api.post<ApiMessageResponse>(
    endpoints.managerGoals.approve(goalId),
    payload
  )

  return response.data
}

export async function returnGoal({
  goalId,
  payload,
}: {
  goalId: string
  payload: ReturnGoalPayload
}) {
  const response = await api.post<ApiMessageResponse>(
    endpoints.managerGoals.return(goalId),
    payload
  )

  return response.data
}

export async function addQuarterlyComment({
  goalId,
  payload,
}: {
  goalId: string
  payload: QuarterlyCommentPayload
}) {
  const response = await api.post<ApiMessageResponse>(
    endpoints.managerGoals.comment(goalId),
    payload
  )

  return response.data
}
