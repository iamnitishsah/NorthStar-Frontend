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

export interface SharedGoalPushPayload {
  recipient_employee_ids: string[]
  thrust_area: string
  title: string
  description?: string
  uom_type: UOMType
  measurement_type: MeasurementType
  target_value: number
  default_weightage: number
  target_date?: string | null
}

export interface SharedGoalPushResponse {
  message: string
  source_goal_id: string
  recipient_count: number
  recipients: string[]
}

export interface ApiMessageResponse {
  message: string
}

export type UnlockRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"

export interface UnlockRequest {
  request_id?: string
  _id?: string
  goal_id: string
  requester_id?: string
  employee_id?: string
  requester_name?: string
  employee_name?: string
  reason?: string | null
  status: UnlockRequestStatus
  created_at?: string
  updated_at?: string
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

export interface ManagerCheckinQuarter {
  achievement_value?: number | string | null
  progress_percentage?: number | null
  progress_status?: ProgressStatus | null
  manager_note?: string | null
  completed?: boolean
}

export interface ManagerCheckinGoalResponse {
  goal_id: string
  employee_id?: string
  employee_name: string
  title: string
  thrust_area: string
  description?: string | null
  uom_type?: UOMType
  measurement_type?: MeasurementType
  planned_target_value: number
  latest_achievement_value?: number | string | null
  latest_progress_percentage?: number | null
  latest_progress_status?: ProgressStatus | null
  weightage: number
  target_date?: string | null
  quarters: Partial<Record<"q1" | "q2" | "q3" | "q4", ManagerCheckinQuarter>>
  is_shared?: boolean
  primary_owner_id?: string | null
}

export type ManagerCheckinReviewResponse = Record<
  string,
  ManagerCheckinGoalResponse[]
>

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
  manager_id?: string | null
  children: HierarchyNode[]
}

export interface CompletionQuarterStatus {
  employee_completed: boolean
  employee_completed_goals: number
  manager_completed: boolean
  manager_completed_goals: number
  required_goals: number
}

export interface CompletionDashboardRow {
  employee_id: string
  employee_name: string
  manager_id?: string | null
  manager_name?: string | null
  total_goals: number
  checkin_required_goals: number
  latest_completed_quarter?: number | null
  quarters: Partial<
    Record<"q1" | "q2" | "q3" | "q4", CompletionQuarterStatus>
  >
}

export interface QoqQuarterMetric {
  average_progress_percentage: number | null
  completed_goals: number
  qoq_delta: number | null
}

export interface QoqEmployeeMetric {
  employee_id: string
  employee_name: string
  manager_id?: string | null
  manager_name?: string | null
  goal_count: number
  quarters: Partial<Record<"q1" | "q2" | "q3" | "q4", QoqQuarterMetric>>
}

export interface QoqTeamMetric {
  manager_id: string
  manager_name: string
  employee_count: number
  goal_count: number
  quarters: Partial<Record<"q1" | "q2" | "q3" | "q4", QoqQuarterMetric>>
}

export interface QoqAnalyticsResponse {
  employees: QoqEmployeeMetric[]
  teams: QoqTeamMetric[]
}

export interface DistributionBucket {
  label: string
  goal_count: number
  total_weightage: number
  average_progress_percentage?: number | null
  status_breakdown: Partial<Record<GoalStatus, number>>
}

export interface ThrustAreaUomDistributionBucket {
  thrust_area: string
  uom_type: UOMType
  goal_count: number
  total_weightage: number
  average_progress_percentage?: number | null
  status_breakdown: Partial<Record<GoalStatus, number>>
}

export interface GoalDistributionAnalyticsResponse {
  total_goals: number
  by_thrust_area: DistributionBucket[]
  by_uom_type: DistributionBucket[]
  by_thrust_area_and_uom_type: ThrustAreaUomDistributionBucket[]
}
