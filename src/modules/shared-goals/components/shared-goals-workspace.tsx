import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send } from "lucide-react"
import { toast } from "sonner"

import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import { getTodayDateInputValue } from "@/modules/employee/utils/goal-form"
import { getApiErrorMessage } from "@/services/api-error"
import type { MeasurementType, SharedGoalPushPayload, UOMType } from "@/types/goal"

import {
  usePushedSharedGoals,
  usePushSharedGoal,
} from "../hooks/use-shared-goals"

const uomOptions: UOMType[] = [
  "NUMERIC",
  "PERCENTAGE",
  "TIMELINE",
  "ZERO_BASED",
]

const measurementOptions: MeasurementType[] = ["MIN", "MAX"]

const schema = z
  .object({
    recipient_employee_ids: z.string().min(1, "Enter at least one employee ID"),
    thrust_area: z.string().trim().min(3).max(100),
    title: z.string().trim().min(3).max(100),
    description: z.string().trim().max(500).optional(),
    uom_type: z.enum(uomOptions),
    measurement_type: z.enum(measurementOptions),
    target_value: z.coerce.number().gt(0),
    default_weightage: z.coerce.number().min(10).max(100),
    target_date: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.uom_type === "TIMELINE" && !value.target_date) {
      context.addIssue({
        code: "custom",
        message: "Target date is required for timeline goals",
        path: ["target_date"],
      })
    }

    if (value.target_date && value.target_date < getTodayDateInputValue()) {
      context.addIssue({
        code: "custom",
        message: "Target date cannot be in the past",
        path: ["target_date"],
      })
    }
  })

type FormValues = z.input<typeof schema>

function toPayload(values: FormValues): SharedGoalPushPayload {
  const isZeroBased = values.uom_type === "ZERO_BASED"

  return {
    recipient_employee_ids: values.recipient_employee_ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
    thrust_area: values.thrust_area.trim(),
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    uom_type: values.uom_type,
    measurement_type: isZeroBased ? "MIN" : values.measurement_type,
    target_value: Number(values.target_value),
    default_weightage: Number(values.default_weightage),
    target_date: values.target_date ? `${values.target_date}T00:00:00Z` : null,
  }
}

function SharedGoalsWorkspace() {
  const pushedQuery = usePushedSharedGoals()
  const pushMutation = usePushSharedGoal()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      recipient_employee_ids: "",
      thrust_area: "",
      title: "",
      description: "",
      uom_type: "NUMERIC",
      measurement_type: "MIN",
      target_value: 1,
      default_weightage: 10,
      target_date: "",
    },
  })

  const uomType = useWatch({ control, name: "uom_type" })
  const isTimeline = uomType === "TIMELINE"
  const isZeroBased = uomType === "ZERO_BASED"

  useEffect(() => {
    if (isZeroBased) {
      setValue("measurement_type", "MIN")
    }
  }, [isZeroBased, setValue])

  function submit(values: FormValues) {
    const payload = toPayload(values)

    if (payload.recipient_employee_ids.length === 0) {
      toast.error("Enter at least one employee ID")
      return
    }

    pushMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message)
        reset()
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Shared goal push failed"))
      },
    })
  }

  if (pushedQuery.isLoading) {
    return <LoadingSkeleton rows={4} />
  }

  if (pushedQuery.isError) {
    return (
      <ErrorState
        message="Unable to load pushed shared goals."
        onRetry={() => pushedQuery.refetch()}
      />
    )
  }

  const pushedGoals = pushedQuery.data ?? []
  const minTargetDate = getTodayDateInputValue()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shared Goals"
        description="Push departmental KPIs to employees and monitor shared goal copies."
      />

      <Card className="p-5">
        <form className="space-y-5" onSubmit={handleSubmit(submit)}>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Recipient employee IDs
              </span>
              <input
                {...register("recipient_employee_ids")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="EMP001, EMP002"
              />
              {errors.recipient_employee_ids && (
                <p className="text-sm text-red-600">
                  {errors.recipient_employee_ids.message}
                </p>
              )}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Thrust area
              </span>
              <input
                {...register("thrust_area")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                {...register("title")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Description
              </span>
              <input
                {...register("description")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                UoM type
              </span>
              <select
                {...register("uom_type")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {uomOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Measurement
              </span>
              <select
                {...register("measurement_type")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {measurementOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Target</span>
              <input
                {...register("target_value")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                min={1}
                step="any"
                type="number"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Default weightage
              </span>
              <input
                {...register("default_weightage")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                max={100}
                min={10}
                type="number"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Target date{isTimeline ? " *" : ""}
              </span>
              <input
                {...register("target_date")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                min={minTargetDate}
                type="date"
              />
              {errors.target_date && (
                <p className="text-sm text-red-600">
                  {errors.target_date.message}
                </p>
              )}
            </label>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <Button
              disabled={pushMutation.isPending}
              icon={<Send size={16} />}
              type="submit"
            >
              {pushMutation.isPending ? "Pushing..." : "Push Shared Goal"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Pushed Shared Goals
          </h2>
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {pushedGoals.length}
          </span>
        </div>

        {pushedGoals.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No shared goals have been pushed yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {pushedGoals.map((goal) => (
              <div className="py-4 first:pt-0 last:pb-0" key={goal.goal_id}>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{goal.thrust_area}</p>
                    <h3 className="font-semibold text-slate-950">
                      {goal.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {goal.employee_name}
                    </p>
                  </div>
                  <div className="text-sm text-slate-600">
                    {goal.weightage}% · {goal.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default SharedGoalsWorkspace
