import { useQuery } from "@tanstack/react-query"

import { fetchMyGoals } from "../api/employee-api"
import { myGoalsQueryKey } from "./use-goal-actions"

export function useMyGoals() {
  return useQuery({
    queryKey: myGoalsQueryKey,

    queryFn: fetchMyGoals,
  })
}
