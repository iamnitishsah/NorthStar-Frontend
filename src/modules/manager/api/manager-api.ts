import axios from "axios"

import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import type {
  ApiMessageResponse,
  ApproveGoalPayload,
  ManagerGoalsResponse,
  ManagerReviewGoalsResponse,
  QuarterlyCommentPayload,
  ReturnGoalPayload,
} from "@/types/goal"

export async function fetchReviewGoals() {
  try {
    const response = await api.get<ManagerReviewGoalsResponse>(
      endpoints.managerGoals.review
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {}
    }

    throw error
  }
}

export async function fetchManagerGoals() {
  try {
    const response = await api.get<ManagerGoalsResponse>(
      endpoints.managerGoals.approved
    )

    return response.data
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
    null,
    {
      params: {
        quarter: payload.quarter,
        comment: payload.comment,
      },
    }
  )

  return response.data
}
