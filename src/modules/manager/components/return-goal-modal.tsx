import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Return Goal
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a clear note so the employee can revise and resubmit.
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
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              {goal.thrust_area}
            </p>
            <h3 className="font-semibold text-slate-950">
              {goal.title}
            </h3>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Manager Note
            </span>
            <textarea
              {...register("manager_note")}
              className="min-h-32 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              rows={5}
            />
            {errors.manager_note && (
              <p className="text-sm text-red-600">
                {errors.manager_note.message}
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
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Returning..." : "Return Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReturnGoalModal
