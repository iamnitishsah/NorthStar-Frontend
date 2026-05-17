export type UserRole =
  | "EMPLOYEE"
  | "MANAGER"
  | "ADMIN"

export interface User {
  employee_id: string
  name: string
  email: string
  role: UserRole
  department: string
  designation: string
}

export interface LoginRequest {
  email?: string
  employee_id?: string
  password: string
}

export interface LoginResponse {
  message: string
  response: {
    access: string
    refresh: string
    user: User
  }
}