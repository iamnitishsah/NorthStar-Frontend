import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import Button from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Textarea } from "@/components/ui/form"
import { ModalFooter, ModalShell, SectionCard } from "@/components/ui/surface"
import type { Goal, ReturnGoalPayload } from "@/types/goal"

type Props = {
  goal: Goal
  isSubmitting: boolean
  onClose: () => void
  onReturn: (goalId: string, payload: ReturnGoalPayload) => void
}

const returnSchema = z.object({
  manager_note: z.string().trim().min(1, "Manager note is required").max(500),
})

type ReturnFormValues = z.infer<typeof returnSchema>

function ReturnGoalModal({
  goal,
  isSubmitting,
  onClose,
  onReturn,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      manager_note: "",
    },
  })

  function submit(values: ReturnFormValues) {
    onReturn(goal.goal_id, {
      manager_note: values.manager_note.trim(),
    })
  }

  return (
    <ModalShell
      title="Return Goal"
      description="Add a clear note so the employee can revise and resubmit."
      onClose={onClose}
      footer={
        <ModalFooter>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            form="return-goal-form"
            type="submit"
            variant="danger"
          >
            {isSubmitting ? "Returning..." : "Return Goal"}
          </Button>
        </ModalFooter>
      }
    >
        <form
          className="space-y-5"
          id="return-goal-form"
          onSubmit={handleSubmit(submit)}
        >
          <SectionCard>
            <p className="text-sm text-muted-foreground">
              {goal.thrust_area}
            </p>
            <h3 className="font-semibold text-surface-foreground">
              {goal.title}
            </h3>
          </SectionCard>

          <Field>
            <FieldLabel>
              Manager Note
            </FieldLabel>
            <Textarea
              {...register("manager_note")}
              className="min-h-32"
              hasError={Boolean(errors.manager_note)}
              rows={5}
            />
            <FieldError message={errors.manager_note?.message} />
          </Field>
        </form>
    </ModalShell>
  )
}

export default ReturnGoalModal
