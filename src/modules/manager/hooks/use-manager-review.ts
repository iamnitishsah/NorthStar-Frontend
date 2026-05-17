import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  approveGoal,
  fetchReviewGoals,
  returnGoal,
} from "../api/manager-api"

export const managerReviewQueryKey = ["manager-review-goals"] as const

export function useReviewGoals() {
  return useQuery({
    queryKey: managerReviewQueryKey,
    queryFn: fetchReviewGoals,
  })
}

export function useApproveGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: managerReviewQueryKey,
      })
    },
  })
}

export function useReturnGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: returnGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: managerReviewQueryKey,
      })
    },
  })
}
