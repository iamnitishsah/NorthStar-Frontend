import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import Button from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Textarea } from "@/components/ui/form"
import { ModalFooter, ModalShell } from "@/components/ui/surface"
import type { Goal, QuarterlyCommentPayload } from "@/types/goal"

type Props = {
  goal: Goal
  quarter: number
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (goalId: string, payload: QuarterlyCommentPayload) => void
}

const commentSchema = z.object({
  comment: z.string().trim().min(1, "Comment is required").max(500),
})

type CommentFormValues = z.infer<typeof commentSchema>

function QuarterlyCommentModal({
  goal,
  quarter,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  })

  function submit(values: CommentFormValues) {
    onSubmit(goal.goal_id, {
      quarter,
      comment: values.comment.trim(),
    })
  }

  return (
    <ModalShell
      title={`Add Q${quarter} Comment`}
      description={goal.title}
      onClose={onClose}
      footer={
        <ModalFooter>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            form="quarterly-comment-form"
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save Comment"}
          </Button>
        </ModalFooter>
      }
    >
        <form
          className="space-y-5"
          id="quarterly-comment-form"
          onSubmit={handleSubmit(submit)}
        >
          <Field>
            <FieldLabel>
              Manager Comment
            </FieldLabel>
            <Textarea
              {...register("comment")}
              className="min-h-32"
              hasError={Boolean(errors.comment)}
              rows={5}
            />
            <FieldError message={errors.comment?.message} />
          </Field>
        </form>
    </ModalShell>
  )
}

export default QuarterlyCommentModal
