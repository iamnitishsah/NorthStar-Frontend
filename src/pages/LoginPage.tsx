import { useState } from "react"
import {
  AlertCircle,
  Building2,
  KeyRound,
  Mail,
  Moon,
  Sparkles,
  Star,
  Sun,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginUser } from "@/modules/auth/auth-service"
import { getRoleHomePath } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"
import { useTheme } from "@/app/providers/theme-provider"
import { getApiErrorMessage } from "@/services/api-error"

import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(3),
})

type FormData = z.infer<typeof schema>

function NorthStarMark() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-[#0B1220] text-white shadow-lg shadow-[#0D47A1]/25">
      <div className="absolute inset-1 rounded-lg border border-white/10" />
      <Star className="relative fill-[#00897B] text-[#00897B]" size={30} />
      <Sparkles className="absolute right-1.5 top-1.5 text-white" size={13} />
      <span className="absolute -bottom-1 h-1.5 w-8 rounded-full bg-[#00897B]/40 blur-sm" />
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()

  const [loginType, setLoginType] = useState<
    "email" | "employee_id"
  >("email")
  const [loginError, setLoginError] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()

  const setAuth = useAuthStore(
    (state) => state.setAuth
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoginError(null)

    try {
      const payload =
        loginType === "email"
          ? {
              email: data.identifier,
              password: data.password,
            }
          : {
              employee_id: data.identifier,
              password: data.password,
            }

      const response = await loginUser(payload)

      if (!response?.response?.user || !response.response.access) {
        throw new Error("Login response was incomplete. Please contact Admin operations.")
      }

      const user = {
        ...response.response.user,
        user_id: response.response.user_id,
      }
      const token = response.response.access
      const refreshToken = response.response.refresh

      setAuth(user, token, refreshToken)

      toast.success("Login successful")

      navigate(getRoleHomePath(user.role))
    } catch (error: unknown) {
      const message =
        error instanceof Error && !("isAxiosError" in error)
          ? error.message
          : getApiErrorMessage(error, "Login failed")

      setLoginError(message)
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ns-bg)] p-4">
      <button
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="absolute right-4 top-4 rounded-md border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={toggleTheme}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        type="button"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[440px] space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10"
      >
        <div className="space-y-4">
          <NorthStarMark />
          <div>
          <h1 className="text-3xl font-bold text-slate-950">
            NorthStar
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Enterprise goal lifecycle and performance operations
          </p>
          </div>
        </div>

        {loginError && (
          <div
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#C62828]"
            role="alert"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold">Login failed</p>
              <p className="mt-0.5">{loginError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${loginType === "email" ? "bg-white text-[#0D47A1] shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>
            <input
              className="sr-only"
              type="radio"
              checked={loginType === "email"}
              onChange={() =>
                setLoginType("email")
              }
            />
            <Mail size={16} />
            Email
          </label>

          <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${loginType === "employee_id" ? "bg-white text-[#0D47A1] shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>
            <input
              className="sr-only"
              type="radio"
              checked={
                loginType === "employee_id"
              }
              onChange={() =>
                setLoginType("employee_id")
              }
            />
            <Building2 size={16} />
            Employee ID
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            {loginType === "email" ? "Work email" : "Employee ID"}
          </label>
          <input
            type="text"
            placeholder={
              loginType === "email"
                ? "name@company.com"
                : "EMP-0000"
            }
            {...register("identifier")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15"
          />

          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            {...register("password")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0D47A1] p-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0A3A85] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <KeyRound size={16} />
          {isSubmitting
            ? "Logging in..."
            : "Login"}
        </button>

        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
          Accounts are provisioned internally by Admin operations.
        </p>
      </form>
    </div>
  )
}

export default LoginPage
