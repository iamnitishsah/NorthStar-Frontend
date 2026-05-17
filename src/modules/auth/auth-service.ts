import { api } from "@/services/api"
import type { LoginRequest, LoginResponse } from "@/types/auth"

export async function loginUser(
  payload: LoginRequest
) {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    payload
  )

  return response.data
}