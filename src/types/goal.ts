export type GoalStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "LOCKED"
  | "RETURNED"

export type ProgressStatus =
  | "NOT_STARTED"
  | "ON_TRACK"
  | "COMPLETED"

export type UOMType =
  | "NUMERIC"
  | "PERCENTAGE"
  | "TIMELINE"
  | "ZERO_BASED"

export type MeasurementType =
  | "MIN"
  | "MAX"

export interface Goal {
  goal_id: string
  thrust_area: string
  title: string
  description?: string

  uom_type: UOMType
  measurement_type: MeasurementType

  target_value: number
  weightage: number

  progress_percentage?: number
  progress_status?: ProgressStatus

  employee_name: string

  status: GoalStatus

  manager_note?: string
  approver_name?: string
}