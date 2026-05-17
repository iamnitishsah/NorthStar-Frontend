import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import OrganizationTree from "@/modules/organization/components/organization-tree"
import { useOrganizationHierarchy } from "@/modules/organization/hooks/use-organization-hierarchy"

function OrganizationPage() {
  const hierarchyQuery = useOrganizationHierarchy()

  if (hierarchyQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Organization"
          description="Explore the company hierarchy and reporting structure."
        />
        <LoadingSkeleton rows={4} />
      </div>
    )
  }

  if (hierarchyQuery.isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Organization"
          description="Explore the company hierarchy and reporting structure."
        />
        <ErrorState
          message="Unable to load organization hierarchy."
          onRetry={hierarchyQuery.refetch}
        />
      </div>
    )
  }

  const hierarchy = hierarchyQuery.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization"
        description="Explore the company hierarchy and reporting structure."
      />
      <OrganizationTree
        hierarchy={hierarchy}
        showHeader={false}
      />
    </div>
  )
}

export default OrganizationPage
