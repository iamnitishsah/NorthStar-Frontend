import { useQuery } from "@tanstack/react-query"

import { fetchMyGoals } from "../api/employee-api"

export function useMyGoals() {
  return useQuery({
    queryKey: ["my-goals"],

    queryFn: fetchMyGoals,
  })
}