import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { User } from "@/types/auth"

type AuthState = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null

  setAuth: (
    user: User,
    accessToken: string,
    refreshToken?: string | null
  ) => void

  logout: () => void
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,

        setAuth: (user, accessToken, refreshToken = null) => {
          set({
            user,
            accessToken,
            refreshToken,
          })
        },

        logout: () => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
          })
        },
      }),

      {
        name: "northstar-auth",
      }
    )
  )
