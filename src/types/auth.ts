export type UserRole =
  | "EMPLOYEE"
  | "MANAGER"
  | "HR"
  | "ADMIN"

export interface User {
  user_id?: string
  employee_id: string
  name: string
  email?: string
  role: UserRole
  department: string
  designation: string
  age?: number
  gender?: "MALE" | "FEMALE" | "OTHER"
  phone?: string
  manager_id?: string | null
  is_active?: boolean
}

export interface LoginRequest {
  email?: string
  employee_id?: string
  password: string
}

export interface LoginResponse {
  message: string
  response: {
    user_id: string
    access: string
    refresh: string
    user: User
  }
}
