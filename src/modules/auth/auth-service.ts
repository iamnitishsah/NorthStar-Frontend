import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth"

export async function loginUser(
  payload: LoginRequest
) {
  const response = await api.post<LoginResponse>(
    endpoints.auth.login,
    payload
  )

  return response.data
}

export async function registerUser(payload: RegisterRequest) {
  const response = await api.post<RegisterResponse>(
    endpoints.auth.register,
    payload
  )

  return response.data
}
