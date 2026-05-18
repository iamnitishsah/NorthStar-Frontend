import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  fetchPushedSharedGoals,
  pushSharedGoal,
} from "../api/shared-goals-api"

export const pushedSharedGoalsQueryKey = ["pushed-shared-goals"] as const

export function usePushedSharedGoals() {
  return useQuery({
    queryKey: pushedSharedGoalsQueryKey,
    queryFn: fetchPushedSharedGoals,
  })
}

export function usePushSharedGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: pushSharedGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pushedSharedGoalsQueryKey,
      })
    },
  })
}
