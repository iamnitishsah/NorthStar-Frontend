import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createGoal,
  deleteGoal,
  requestGoalUnlock,
  submitGoals,
  updateQuarterlyCheckin,
  updateGoal,
} from "@/modules/employee/api/employee-api"

export const myGoalsQueryKey = ["my-goals"] as const

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGoal,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myGoalsQueryKey,
      })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGoal,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myGoalsQueryKey,
      })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGoal,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myGoalsQueryKey,
      })
    },
  })
}

export function useSubmitGoals() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitGoals,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myGoalsQueryKey,
      })
    },
  })
}

export function useQuarterlyCheckin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateQuarterlyCheckin,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myGoalsQueryKey,
      })
    },
  })
}

export function useRequestGoalUnlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requestGoalUnlock,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myGoalsQueryKey,
      })
    },
  })
}
