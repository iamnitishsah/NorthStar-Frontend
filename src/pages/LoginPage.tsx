import { useState } from "react"
import {
  AlertCircle,
  Building2,
  KeyRound,
  Mail,
  Moon,
  Sun,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginUser } from "@/modules/auth/auth-service"
import { getRoleHomePath } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"
import { useTheme } from "@/app/providers/use-theme"
import Button from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Input } from "@/components/ui/form"
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
    <div className="northstar-mark flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl">
      <img
        alt=""
        className="h-full w-full"
        src="/favicon.svg"
      />
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
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
      <button
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="theme-transition absolute right-4 top-4 rounded-md border border-border bg-card p-2 text-muted-foreground shadow-enterprise-sm hover:bg-hover hover:text-foreground"
        onClick={toggleTheme}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        type="button"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="dashboard-surface w-full max-w-[440px] space-y-6 rounded-lg p-8 shadow-enterprise-md"
      >
        <div className="space-y-4">
          <NorthStarMark />
          <div>
          <h1 className="text-3xl font-bold text-card-foreground">
            NorthStar
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Enterprise goal lifecycle and performance operations
          </p>
          </div>
        </div>

        {loginError && (
          <div
            className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold">Login failed</p>
              <p className="mt-0.5">{loginError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-1">
          <label className={`theme-transition flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${loginType === "email" ? "bg-card text-primary shadow-enterprise-sm" : "text-muted-foreground hover:text-foreground"}`}>
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

          <label className={`theme-transition flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${loginType === "employee_id" ? "bg-card text-primary shadow-enterprise-sm" : "text-muted-foreground hover:text-foreground"}`}>
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

        <Field>
          <FieldLabel>
            {loginType === "email" ? "Work email" : "Employee ID"}
          </FieldLabel>
          <Input
            type="text"
            placeholder={
              loginType === "email"
                ? "name@company.com"
                : "EMP-0000"
            }
            {...register("identifier")}
            className="py-3"
            hasError={Boolean(errors.identifier)}
          />
          <FieldError message={errors.identifier?.message} />
        </Field>

        <Field>
          <FieldLabel>
            Password
          </FieldLabel>
          <Input
            type="password"
            placeholder="Enter password"
            {...register("password")}
            className="py-3"
            hasError={Boolean(errors.password)}
          />
          <FieldError message={errors.password?.message} />
        </Field>

        <Button
          disabled={isSubmitting}
          className="w-full p-3"
          type="submit"
        >
          <KeyRound size={16} />
          {isSubmitting
            ? "Logging in..."
            : "Login"}
        </Button>

        <p className="rounded-md border border-border bg-surface px-3 py-2 text-center text-xs text-muted-foreground">
          Accounts are provisioned internally by Admin operations.
        </p>
      </form>
    </div>
  )
}

export default LoginPage
