import axios, { AxiosHeaders } from "axios"
import type { InternalAxiosRequestConfig } from "axios"

import { useAuthStore } from "@/app/store/auth-store"

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000"

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Avoid accessing `localStorage` during SSR or non-browser environments
  if (typeof window === "undefined") return config

  const storage = localStorage.getItem("northstar-auth")

  if (!storage) return config

  try {
    const parsed = JSON.parse(storage)
    const token = parsed?.state?.accessToken

    if (token) {
      const headers = AxiosHeaders.from(config.headers || {})
      headers.set("Authorization", `Bearer ${token}`)
      config.headers = headers
    }
  } catch {
    // If parsing fails, just continue without attaching a token
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
    }

    return Promise.reject(error)
  }
)
