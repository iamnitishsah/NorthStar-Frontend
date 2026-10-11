import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check, ChevronDown, Search, Send, UserCheck, X } from "lucide-react"
import { toast } from "sonner"

import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import ErrorState from "@/components/ui/error-state"
import {
  Field,
  FieldError,
  FieldLabel,
  Input,
  Select,
} from "@/components/ui/form"
import InfoTooltip from "@/components/ui/info-tooltip"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"
import { formatDateIST, formatDateTimeIST } from "@/lib/datetime"
import {
  GOAL_HELP,
  getGoalStatusHelp,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomFieldHelp,
  getUomHelp,
} from "@/lib/goal-help"
import { getTodayDateInputValue } from "@/modules/employee/utils/goal-form"
import { useOrganizationHierarchy } from "@/modules/organization/hooks/use-organization-hierarchy"
import { getApiErrorMessage } from "@/services/api-error"
import type {
  HierarchyNode,
  MeasurementType,
  SharedGoalPushPayload,
  UOMType,
} from "@/types/goal"

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
    recipient_employee_ids: z
      .array(z.string())
      .min(1, "Select at least one employee"),
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
    recipient_employee_ids: values.recipient_employee_ids,
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

type EmployeeOption = {
  employee_id: string
  name: string
  designation: string
  department: string
}

function flattenEmployeeOptions(nodes: HierarchyNode[]): EmployeeOption[] {
  const employees = new Map<string, EmployeeOption>()

  function visit(node: HierarchyNode) {
    if (node.role === "EMPLOYEE") {
      employees.set(node.employee_id, {
        employee_id: node.employee_id,
        name: node.name,
        designation: node.designation,
        department: node.department,
      })
    }

    node.children.forEach(visit)
  }

  nodes.forEach(visit)

  return Array.from(employees.values()).sort((left, right) =>
    left.name.localeCompare(right.name)
  )
}

function SharedGoalsWorkspace() {
  const pushedQuery = usePushedSharedGoals()
  const hierarchyQuery = useOrganizationHierarchy()
  const pushMutation = usePushSharedGoal()
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false)
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
      recipient_employee_ids: [],
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
  const measurementType = useWatch({ control, name: "measurement_type" })
  const selectedRecipientIds = useWatch({
    control,
    name: "recipient_employee_ids",
  }) ?? []
  const isTimeline = uomType === "TIMELINE"
  const isZeroBased = uomType === "ZERO_BASED"
  const activeMeasurementHelp = getMeasurementHelp(
    isZeroBased ? "MIN" : (measurementType ?? "MIN"),
    uomType
  )
  const employeeOptions = useMemo(
    () => flattenEmployeeOptions(hierarchyQuery.data ?? []),
    [hierarchyQuery.data]
  )
  const employeeOptionsById = useMemo(
    () =>
      new Map(
        employeeOptions.map((employee) => [employee.employee_id, employee])
      ),
    [employeeOptions]
  )
  const selectedEmployees = selectedRecipientIds
    .map((employeeId) => employeeOptionsById.get(employeeId))
    .filter((employee): employee is EmployeeOption => Boolean(employee))
  const filteredEmployeeOptions = employeeOptions.filter((employee) => {
    const searchText = employeeSearch.trim().toLowerCase()

    if (!searchText) return true

    return [
      employee.employee_id,
      employee.name,
      employee.department,
      employee.designation,
    ].some((value) => value.toLowerCase().includes(searchText))
  })

  useEffect(() => {
    if (isZeroBased) {
      setValue("measurement_type", "MIN")
    }
  }, [isZeroBased, setValue])

  function submit(values: FormValues) {
    const payload = toPayload(values)

    if (payload.recipient_employee_ids.length === 0) {
      toast.error("Select at least one employee")
      return
    }

    pushMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message)
        reset()
        setEmployeeSearch("")
        setIsEmployeePickerOpen(false)
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Shared goal push failed"))
      },
    })
  }

  function toggleRecipient(employeeId: string) {
    const nextRecipientIds = selectedRecipientIds.includes(employeeId)
      ? selectedRecipientIds.filter((selectedId) => selectedId !== employeeId)
      : [...selectedRecipientIds, employeeId]

    setValue("recipient_employee_ids", nextRecipientIds, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  if (pushedQuery.isLoading || hierarchyQuery.isLoading) {
    return <LoadingSkeleton rows={4} />
  }

  if (pushedQuery.isError || hierarchyQuery.isError) {
    return (
      <ErrorState
        message={
          hierarchyQuery.isError
            ? "Unable to load employees for shared goal selection."
            : "Unable to load pushed shared goals."
        }
        onRetry={() => {
          pushedQuery.refetch()
          hierarchyQuery.refetch()
        }}
      />
    )
  }

  const pushedGoals = pushedQuery.data ?? []
  const minTargetDate = getTodayDateInputValue()

  return (
    <div className="space-y-6">
      <PageHeader
        badge="KPI Cascade"
        title="Shared Goals"
        description="Push departmental KPIs to employees and monitor shared goal copies."
      />

      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit(submit)}>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field>
              <FieldLabel tooltip={GOAL_HELP.sharedRecipients}>
                Shared Goal Recipients
              </FieldLabel>
              <div className="relative">
                <button
                  aria-expanded={isEmployeePickerOpen}
                  className="theme-transition flex min-h-10 w-full items-center justify-between gap-3 rounded-lg border border-input bg-surface/60 px-3.5 py-2.5 text-left text-sm outline-none hover:bg-hover focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20"
                  onClick={() =>
                    setIsEmployeePickerOpen((isOpen) => !isOpen)
                  }
                  type="button"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <UserCheck size={16} className="text-primary" />
                    {selectedRecipientIds.length === 0
                      ? "Select employees..."
                      : `${selectedRecipientIds.length} employee(s) selected`}
                  </span>
                  <ChevronDown
                    className={cn(
                      "theme-transition text-muted-foreground",
                      isEmployeePickerOpen && "rotate-180"
                    )}
                    size={16}
                  />
                </button>

                {isEmployeePickerOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-card p-3 shadow-enterprise-lg">
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-surface/60 px-3 py-2">
                      <Search size={15} className="text-muted-foreground" />
                      <input
                        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        onChange={(event) =>
                          setEmployeeSearch(event.target.value)
                        }
                        placeholder="Search employees..."
                        type="search"
                        value={employeeSearch}
                      />
                    </div>

                    <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
                      {filteredEmployeeOptions.length === 0 ? (
                        <p className="px-2 py-3 text-sm text-muted-foreground">
                          No employees found.
                        </p>
                      ) : (
                        filteredEmployeeOptions.map((employee) => {
                          const isSelected = selectedRecipientIds.includes(
                            employee.employee_id
                          )
                          const isPrimaryOwner =
                            selectedRecipientIds[0] === employee.employee_id

                          return (
                            <button
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-hover",
                                isSelected && "bg-primary/10"
                              )}
                              key={employee.employee_id}
                              onClick={() =>
                                toggleRecipient(employee.employee_id)
                              }
                              type="button"
                            >
                              <span
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border border-input",
                                  isSelected &&
                                    "border-primary bg-primary text-primary-foreground"
                                )}
                              >
                                {isSelected && <Check size={13} />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold text-card-foreground">
                                  {employee.name}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {employee.employee_id} · {employee.department} ·{" "}
                                  {employee.designation}
                                </span>
                              </span>
                              {isPrimaryOwner && (
                                <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                  Primary owner
                                </span>
                              )}
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedEmployees.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedEmployees.map((employee, index) => (
                    <span
                      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-surface-foreground"
                      key={employee.employee_id}
                    >
                      <span className="truncate">
                        {index === 0 ? "Primary: " : ""}
                        {employee.name} ({employee.employee_id})
                      </span>
                      <button
                        aria-label={`Remove ${employee.name}`}
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toggleRecipient(employee.employee_id)}
                        type="button"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <FieldError message={errors.recipient_employee_ids?.message} />
            </Field>

            <Field>
              <FieldLabel tooltip={GOAL_HELP.thrustArea}>Thrust Area</FieldLabel>
              <Input
                placeholder="e.g. Operational Excellence"
                {...register("thrust_area")}
                hasError={Boolean(errors.thrust_area)}
              />
              <FieldError message={errors.thrust_area?.message} />
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Field>
              <FieldLabel tooltip={GOAL_HELP.title}>Title</FieldLabel>
              <Input
                placeholder="e.g. Maintain Zero Critical Security Incidents"
                {...register("title")}
                hasError={Boolean(errors.title)}
              />
              <FieldError message={errors.title?.message} />
            </Field>

            <Field>
              <FieldLabel tooltip={GOAL_HELP.description}>Description</FieldLabel>
              <Input
                placeholder="Optional context or KPI measurement notes"
                {...register("description")}
                hasError={Boolean(errors.description)}
              />
              <FieldError message={errors.description?.message} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field>
              <FieldLabel tooltip={getUomFieldHelp(uomType)}>UoM Type</FieldLabel>
              <Select {...register("uom_type")}>
                {uomOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <FieldLabel tooltip={activeMeasurementHelp}>Measurement</FieldLabel>
              <Select {...register("measurement_type")} disabled={isZeroBased}>
                {measurementOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} ({option === "MIN" ? "Higher is better" : "Lower is better"})
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <FieldLabel tooltip={GOAL_HELP.targetValue}>Target</FieldLabel>
              <Input
                {...register("target_value")}
                hasError={Boolean(errors.target_value)}
                min={1}
                step="any"
                type="number"
              />
              <FieldError message={errors.target_value?.message} />
            </Field>

            <Field>
              <FieldLabel tooltip={GOAL_HELP.weightage}>Default Weightage (%)</FieldLabel>
              <Input
                {...register("default_weightage")}
                hasError={Boolean(errors.default_weightage)}
                max={100}
                min={10}
                type="number"
              />
              <FieldError message={errors.default_weightage?.message} />
            </Field>

            <Field>
              <FieldLabel tooltip={GOAL_HELP.targetDate}>Target Date{isTimeline ? " *" : ""}</FieldLabel>
              <Input
                {...register("target_date")}
                hasError={Boolean(errors.target_date)}
                min={minTargetDate}
                type="date"
              />
              <FieldError message={errors.target_date?.message} />
            </Field>
          </div>

          <div className="flex justify-end border-t border-border pt-5">
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

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-card-foreground">
              Pushed Shared Goals
            </h2>
            <InfoTooltip content={GOAL_HELP.sharedGoalBadge} />
          </div>
          <StatusBadge tone="info">
            {pushedGoals.length} Total
          </StatusBadge>
        </div>

        {pushedGoals.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No shared goals have been pushed yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {pushedGoals.map((goal) => (
              <div className="py-4 first:pt-0 last:pb-0" key={goal.goal_id}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {goal.thrust_area}
                      </p>
                      <InfoTooltip content={GOAL_HELP.thrustArea} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <h3 className="font-semibold text-card-foreground">
                        {goal.title}
                      </h3>
                      <InfoTooltip content={GOAL_HELP.title} />
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span>
                        Recipient: <span className="font-medium text-foreground">{goal.employee_name}</span>
                      </span>
                      <InfoTooltip content={GOAL_HELP.sharedRecipients} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-0.5 font-mono text-surface-foreground">
                        <span>Target: {goal.target_value} {goal.uom_type}</span>
                        <InfoTooltip content={getGoalTargetHelp(goal)} />
                      </span>
                      <span className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-0.5 font-mono text-surface-foreground">
                        <span>UoM: {goal.uom_type}</span>
                        <InfoTooltip content={getUomHelp(goal.uom_type)} />
                      </span>
                      <span className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-0.5 font-mono text-surface-foreground">
                        <span>Measure: {goal.measurement_type}</span>
                        <InfoTooltip
                          content={getMeasurementHelp(goal.measurement_type, goal.uom_type)}
                        />
                      </span>
                      {goal.target_date && (
                        <span className="inline-flex items-center gap-1">
                          <span>Target date: {formatDateIST(goal.target_date)}</span>
                          <InfoTooltip content={GOAL_HELP.targetDate} />
                        </span>
                      )}
                      {goal.created_at && (
                        <span className="inline-flex items-center gap-1">
                          <span>Created: {formatDateTimeIST(goal.created_at)}</span>
                          <InfoTooltip content={GOAL_HELP.createdTimestamp} />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-foreground">
                      <span>{goal.weightage}%</span>
                      <InfoTooltip content={GOAL_HELP.weightage} />
                    </span>
                    <div className="flex items-center gap-1">
                      <StatusBadge tone={goal.status === "LOCKED" ? "success" : "default"}>
                        {goal.status}
                      </StatusBadge>
                      <InfoTooltip content={getGoalStatusHelp(goal.status)} />
                    </div>
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
