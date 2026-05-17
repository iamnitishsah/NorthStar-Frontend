import { useQuery } from "@tanstack/react-query"

import { fetchOrganizationHierarchy } from "../api/organization-api"

export const organizationHierarchyQueryKey = ["organization-hierarchy"] as const

export function useOrganizationHierarchy() {
  return useQuery({
    queryKey: organizationHierarchyQueryKey,
    queryFn: fetchOrganizationHierarchy,
  })
}
