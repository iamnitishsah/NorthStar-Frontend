export type GoalStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "LOCKED"
  | "RETURNED"
  | "ADMIN_UNLOCKED"

export type ProgressStatus =
  | "NOT_STARTED"
  | "ON_TRACK"
  | "COMPLETED"

export type QuarterKey =
  | "1"
  | "2"
  | "3"
  | "4"

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

  achievement_value?: number | string | null
  progress_percentage?: number | null
  progress_status?: ProgressStatus
  quarter?: Partial<
    Record<
      QuarterKey,
      QuarterlyCheckin
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

export type ManagerReviewGoalsResponse = Record<string, Goal[]>

export interface ApproveGoalPayload {
  target_value?: number
  weightage?: number
}

export interface ReturnGoalPayload {
  manager_note?: string
}

export interface QuarterlyCheckin {
  achievement_value: number | string
  progress_status: ProgressStatus
  manager_note?: string | null
  progress_percentage?: number | null
}

export interface QuarterlyCheckinPayload {
  quarter: Partial<Record<QuarterKey, {
    achievement_value: number | string
    progress_status: ProgressStatus
  }>>
}

export interface QuarterlyCommentPayload {
  quarter: number
  comment: string
}

export type ManagerGoalsResponse = Record<string, Goal[]>

export type AuditLogDetails = Record<string, unknown>

export interface AuditLogEntry {
  _id: string
  user_id: string
  action: string
  details: AuditLogDetails
  timestamp: string
}

export interface HierarchyNode {
  employee_id: string
  name: string
  designation: string
  department: string
  role: string
  children: HierarchyNode[]
}
