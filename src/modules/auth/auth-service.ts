import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import type { LoginRequest, LoginResponse } from "@/types/auth"

export async function loginUser(
  payload: LoginRequest
) {
  const response = await api.post<LoginResponse>(
    endpoints.auth.login,
    payload
  )

  return response.data
}
