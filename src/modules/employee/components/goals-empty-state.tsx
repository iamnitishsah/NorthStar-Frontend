import { Plus, Target } from "lucide-react"
import Button from "@/components/ui/button"
import EmptyState from "@/components/ui/empty-state"

type Props = {
  onCreate: () => void
}

function GoalsEmptyState({ onCreate }: Props) {
  return (
    <EmptyState
      icon={Target}
      title="No goals found"
      description="Create your first draft goal, assign weightage, then submit your goal sheet when the total reaches 100%."
      action={
        <Button icon={<Plus size={16} />} onClick={onCreate}>
          Create Goal
        </Button>
      }
    />
  )
}

export default GoalsEmptyState
