import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import type {
  ProgressStatus,
  QuarterKey,
  QuarterlyCheckinPayload,
} from "@/types/goal"

type Props = {
  goalId: string
  goalTitle: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (goalId: string, payload: QuarterlyCheckinPayload) => void
}

const progressStatusOptions: ProgressStatus[] = [
  "NOT_STARTED",
  "ON_TRACK",
  "COMPLETED",
]

const checkinSchema = z.object({
  quarter: z.enum(["1", "2", "3", "4"]),
  achievement_value: z.number().min(0),
  progress_status: z.enum(progressStatusOptions),
})

type CheckinFormValues = z.infer<typeof checkinSchema>

function QuarterlyCheckinModal({
  goalId,
  goalTitle,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckinFormValues>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      quarter: "1",
      achievement_value: 0,
      progress_status: "ON_TRACK",
    },
  })

  function submit(values: CheckinFormValues) {
    const quarter = values.quarter as QuarterKey

    onSubmit(goalId, {
      quarter: {
        [quarter]: {
          achievement_value: values.achievement_value,
          progress_status: values.progress_status,
        },
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Quarterly Check-in
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {goalTitle}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Quarter
              </span>
              <select
                {...register("quarter")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="1">Q1</option>
                <option value="2">Q2</option>
                <option value="3">Q3</option>
                <option value="4">Q4</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Achievement Value
              </span>
              <input
                {...register("achievement_value", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                min={0}
                step="any"
                type="number"
              />
              {errors.achievement_value && (
                <p className="text-sm text-red-600">
                  {errors.achievement_value.message}
                </p>
              )}
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Progress Status
            </span>
            <select
              {...register("progress_status")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              {progressStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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
              {isSubmitting ? "Saving..." : "Save Check-in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuarterlyCheckinModal
