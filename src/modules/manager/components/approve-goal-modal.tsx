import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import type { ApproveGoalPayload, Goal } from "@/types/goal"

type Props = {
  goal: Goal
  isSubmitting: boolean
  onClose: () => void
  onApprove: (goalId: string, payload: ApproveGoalPayload) => void
}

function getApproveSchema() {
  return z.object({
    target_value: z.number(),
    weightage: z.number().min(10).max(100),
  })
  .superRefine((value, context) => {
    if (value.target_value <= 0) {
      context.addIssue({
        code: "custom",
        message: "Target value must be greater than 0",
        path: ["target_value"],
      })
    }
  })
}

type ApproveFormValues = z.infer<ReturnType<typeof getApproveSchema>>

function ApproveGoalModal({
  goal,
  isSubmitting,
  onClose,
  onApprove,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApproveFormValues>({
    resolver: zodResolver(getApproveSchema()),
    defaultValues: {
      target_value: goal.target_value,
      weightage: goal.weightage,
    },
  })

  function submit(values: ApproveFormValues) {
    onApprove(goal.goal_id, {
      target_value: values.target_value,
      weightage: values.weightage,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Approve Goal
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review and optionally tweak the target or weightage before locking.
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Target Value
              </span>
              <input
                {...register("target_value", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                step="any"
                type="number"
              />
              {errors.target_value && (
                <p className="text-sm text-red-600">
                  {errors.target_value.message}
                </p>
              )}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Weightage
              </span>
              <input
                {...register("weightage", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                max={100}
                min={10}
                type="number"
              />
              {errors.weightage && (
                <p className="text-sm text-red-600">
                  {errors.weightage.message}
                </p>
              )}
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Approving..." : "Approve Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApproveGoalModal
