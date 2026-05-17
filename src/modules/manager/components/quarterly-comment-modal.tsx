import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Add Q{quarter} Comment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {goal.title}
            </p>
          </div>

          <button
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="space-y-5 p-5"
          onSubmit={handleSubmit(submit)}
        >
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Manager Comment
            </span>
            <textarea
              {...register("comment")}
              className="min-h-32 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              rows={5}
            />
            {errors.comment && (
              <p className="text-sm text-red-600">
                {errors.comment.message}
              </p>
            )}
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Save Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuarterlyCommentModal
