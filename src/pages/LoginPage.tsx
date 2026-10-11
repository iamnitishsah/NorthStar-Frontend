import { useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Moon,
  Sun,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { loginUser } from "@/modules/auth/auth-service"
import { getRoleHomePath } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"
import { useTheme } from "@/app/providers/use-theme"
import Button from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Input } from "@/components/ui/form"
import { getApiErrorMessage } from "@/services/api-error"

const schema = z.object({
  identifier: z.string().trim().min(1, "Please enter your email or employee ID"),
  password: z.string().min(3, "Password must be at least 3 characters"),
})

type FormData = z.infer<typeof schema>

function NorthStarMark() {
  return (
    <div className="northstar-mark flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl">
      <img
        alt="NorthStar Logo"
        className="h-full w-full"
        src="/favicon.svg"
      />
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.accessToken)

  const [loginType, setLoginType] = useState<"email" | "employee_id">("email")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const setAuth = useAuthStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (token && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />
  }

  async function onSubmit(data: FormData) {
    setLoginError(null)

    try {
      const payload =
        loginType === "email"
          ? {
              email: data.identifier.trim(),
              password: data.password,
            }
          : {
              employee_id: data.identifier.trim(),
              password: data.password,
            }

      const response = await loginUser(payload)

      if (!response?.response?.user || !response.response.access) {
        throw new Error(
          "Login response was incomplete. Please contact Admin operations."
        )
      }

      const authUser = {
        ...response.response.user,
        user_id: response.response.user_id,
      }
      const accessToken = response.response.access
      const refreshToken = response.response.refresh

      setAuth(authUser, accessToken, refreshToken)

      toast.success("Login successful")

      navigate(getRoleHomePath(authUser.role))
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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-4 text-foreground sm:p-6">
      {/* Subtle Ambient Background Accent */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl sm:h-[460px] sm:w-[460px]" />

      <button
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="theme-transition absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-surface-foreground shadow-enterprise-sm hover:border-primary/35 hover:bg-hover"
        onClick={toggleTheme}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        type="button"
      >
        {theme === "dark" ? (
          <>
            <Sun size={16} className="text-warning" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon size={16} className="text-primary" />
            <span>Dark</span>
          </>
        )}
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="dashboard-surface w-full max-w-[440px] space-y-6 rounded-2xl border border-border p-7 shadow-enterprise-md sm:p-8"
      >
        <div className="space-y-4">
          <Link
            to="/"
            className="theme-transition inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
            <NorthStarMark />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                Sign In
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                NorthStar Performance Operations Console
              </p>
            </div>
          </div>
        </div>

        {loginError && (
          <div
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-0.5 text-xs leading-5">{loginError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-surface p-1.5">
          <label
            className={`theme-transition flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold sm:text-sm ${
              loginType === "email"
                ? "border border-primary/25 bg-card text-primary shadow-enterprise-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <input
              className="sr-only"
              type="radio"
              checked={loginType === "email"}
              onChange={() => setLoginType("email")}
            />
            <Mail size={15} />
            Work Email
          </label>

          <label
            className={`theme-transition flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold sm:text-sm ${
              loginType === "employee_id"
                ? "border border-primary/25 bg-card text-primary shadow-enterprise-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <input
              className="sr-only"
              type="radio"
              checked={loginType === "employee_id"}
              onChange={() => setLoginType("employee_id")}
            />
            <Building2 size={15} />
            Employee ID
          </label>
        </div>

        <div className="space-y-4">
          <Field>
            <FieldLabel>
              {loginType === "email" ? "Work Email" : "Employee ID"}
            </FieldLabel>
            <Input
              type="text"
              placeholder={
                loginType === "email" ? "name@company.com" : "e.g. EMP001"
              }
              {...register("identifier")}
              hasError={Boolean(errors.identifier)}
            />
            <FieldError message={errors.identifier?.message} />
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="pr-10"
                hasError={Boolean(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
          </Field>
        </div>

        <Button
          disabled={isSubmitting}
          className="w-full py-3"
          type="submit"
        >
          <KeyRound size={16} />
          {isSubmitting ? "Signing in..." : "Sign In to Console"}
        </Button>

        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center text-xs text-muted-foreground">
          <span>Don&apos;t have an account? </span>
          <Link
            to="/register"
            className="font-bold text-primary underline-offset-4 hover:underline"
          >
            Register new account
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
