import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import type { HierarchyNode } from "@/types/goal"

export async function fetchOrganizationHierarchy() {
  const response = await api.get<HierarchyNode[]>(
    endpoints.organization.hierarchy
  )

  return response.data
}
