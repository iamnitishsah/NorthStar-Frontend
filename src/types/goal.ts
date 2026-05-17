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
  source_goal_id?: string
  thrust_area: string
  title: string
  description?: string | null

  uom_type: UOMType
  measurement_type: MeasurementType

  target_value: number
  weightage: number
  target_date?: string | null

  achievement_value?: number | null
  progress_percentage?: number | null
  progress_status?: ProgressStatus
  quarter?: Partial<
    Record<
      "1" | "2" | "3" | "4",
      {
        achievement_value: number
        progress_status: ProgressStatus
        manager_note?: string | null
      }
    >
  >

  employee_name: string
  employee_id?: string
  manager_id?: string

  status: GoalStatus

  manager_note?: string | null
  approver_id?: string | null
  approver_name?: string | null
  is_shared?: boolean
  primary_owner_id?: string | null
  submitted_at?: string | null
  approved_at?: string | null
  returned_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiMessageResponse {
  message: string
}

export interface GoalPayload {
  thrust_area: string
  title: string
  description?: string
  uom_type: UOMType
  measurement_type: MeasurementType
  target_value: number
  weightage: number
  target_date?: string | null
  progress_status?: ProgressStatus
}

export type CreateGoalPayload = GoalPayload

export type UpdateGoalPayload = Partial<GoalPayload>
