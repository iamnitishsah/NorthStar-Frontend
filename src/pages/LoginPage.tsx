import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginUser } from "@/modules/auth/auth-service"
import { getRoleHomePath } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"

import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(3),
})

type FormData = z.infer<typeof schema>

function LoginPage() {
  const navigate = useNavigate()

  const [loginType, setLoginType] = useState<
    "email" | "employee_id"
  >("email")

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
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || "Login failed"
        : "Login failed"

      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[400px] space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold">
            NorthStar
          </h1>

          <p className="text-slate-500 mt-1">
            Goal Management Portal
          </p>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={loginType === "email"}
              onChange={() =>
                setLoginType("email")
              }
            />
            Email
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={
                loginType === "employee_id"
              }
              onChange={() =>
                setLoginType("employee_id")
              }
            />
            Employee ID
          </label>
        </div>

        <div>
          <input
            type="text"
            placeholder={
              loginType === "email"
                ? "Enter Email"
                : "Enter Employee ID"
            }
            {...register("identifier")}
            className="w-full border p-3 rounded-lg"
          />

          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter Password"
            {...register("password")}
            className="w-full border p-3 rounded-lg"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-slate-900 hover:bg-slate-800 transition text-white p-3 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Logging in..."
            : "Login"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link
            className="font-medium text-slate-900 hover:underline"
            to="/register"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
