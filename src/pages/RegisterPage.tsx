import { useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Moon,
  Sun,
  UserPlus,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { registerUser } from "@/modules/auth/auth-service"
import { useTheme } from "@/app/providers/use-theme"
import Button from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  Select,
} from "@/components/ui/form"
import { getApiErrorMessage } from "@/services/api-error"
import type { RegisterRequest, UserRole } from "@/types/auth"

const roles: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN", "HR"]
const genders: RegisterRequest["gender"][] = ["MALE", "FEMALE", "OTHER"]

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    employee_id: z
      .string()
      .trim()
      .min(1, "Employee ID is required")
      .max(50, "Employee ID cannot exceed 50 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number must be at least 7 digits")
      .max(20, "Phone number cannot exceed 20 digits"),
    age: z.coerce
      .number()
      .min(18, "Age must be at least 18")
      .max(80, "Age must be 80 or below"),
    gender: z.enum(genders),
    department: z
      .string()
      .trim()
      .min(2, "Department must be at least 2 characters")
      .max(100, "Department cannot exceed 100 characters"),
    designation: z
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation cannot exceed 100 characters"),
    role: z.enum(roles),
    manager_id: z.string().trim().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirm_password"],
      })
    }
  })

type RegisterFormData = z.input<typeof registerSchema>

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

function RegisterPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "EMPLOYEE",
      gender: "MALE",
      manager_id: "",
    },
  })

  async function onSubmit(data: RegisterFormData) {
    setRegisterError(null)

    try {
      const payload: RegisterRequest = {
        name: data.name.trim(),
        employee_id: data.employee_id.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        age: Number(data.age),
        gender: data.gender,
        department: data.department.trim(),
        designation: data.designation.trim(),
        role: data.role,
        manager_id: data.manager_id?.trim() || null,
        password: data.password,
      }

      const response = await registerUser(payload)

      toast.success(
        response.message || "Account registered successfully! Please log in."
      )
      navigate("/login")
    } catch (error: unknown) {
      const message = getApiErrorMessage(
        error,
        "Registration failed. Please check your information and try again."
      )
      setRegisterError(message)
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground sm:p-6 lg:p-8">
      {/* Theme toggle */}
      <button
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="theme-transition absolute right-4 top-4 rounded-md border border-border bg-card p-2 text-muted-foreground shadow-enterprise-sm hover:bg-hover hover:text-foreground"
        onClick={toggleTheme}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        type="button"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="dashboard-surface w-full max-w-2xl space-y-6 rounded-lg p-6 shadow-enterprise-md sm:p-8">
        {/* Navigation link & Header */}
        <div className="space-y-4">
          <Link
            to="/login"
            className="theme-transition inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>

          <div className="flex items-center gap-4">
            <NorthStarMark />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                Create an Account
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Join NorthStar to set, track, and align your enterprise goals
              </p>
            </div>
          </div>
        </div>

        {/* Global error banner */}
        {registerError && (
          <div
            className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold">Registration failed</p>
              <p className="mt-0.5">{registerError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Personal & Identity Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input
                  placeholder="e.g. Alice Johnson"
                  {...register("name")}
                  hasError={Boolean(errors.name)}
                />
                <FieldError message={errors.name?.message} />
              </Field>

              <Field>
                <FieldLabel>Employee ID</FieldLabel>
                <Input
                  placeholder="e.g. EMP001"
                  {...register("employee_id")}
                  hasError={Boolean(errors.employee_id)}
                />
                <FieldError message={errors.employee_id?.message} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Work Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="e.g. alice@company.com"
                  {...register("email")}
                  hasError={Boolean(errors.email)}
                />
                <FieldError message={errors.email?.message} />
              </Field>

              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  {...register("phone")}
                  hasError={Boolean(errors.phone)}
                />
                <FieldError message={errors.phone?.message} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Age</FieldLabel>
                <Input
                  type="number"
                  placeholder="18 - 80"
                  min={18}
                  max={80}
                  {...register("age")}
                  hasError={Boolean(errors.age)}
                />
                <FieldError message={errors.age?.message} />
              </Field>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select
                  {...register("gender")}
                  hasError={Boolean(errors.gender)}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
                <FieldError message={errors.gender?.message} />
              </Field>
            </div>
          </div>

          {/* Section 2: Organizational Profile */}
          <div className="space-y-4 border-t border-border pt-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Organizational Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input
                  placeholder="e.g. Engineering"
                  {...register("department")}
                  hasError={Boolean(errors.department)}
                />
                <FieldError message={errors.department?.message} />
              </Field>

              <Field>
                <FieldLabel>Designation</FieldLabel>
                <Input
                  placeholder="e.g. Software Engineer"
                  {...register("designation")}
                  hasError={Boolean(errors.designation)}
                />
                <FieldError message={errors.designation?.message} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  {...register("role")}
                  hasError={Boolean(errors.role)}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="HR">HR</option>
                </Select>
                <FieldError message={errors.role?.message} />
              </Field>

              <Field>
                <FieldLabel>Reporting Manager ID</FieldLabel>
                <Input
                  placeholder="e.g. EMP010 (optional)"
                  {...register("manager_id")}
                  hasError={Boolean(errors.manager_id)}
                />
                <FieldHint>Leave blank if you report directly to executive leadership</FieldHint>
                <FieldError message={errors.manager_id?.message} />
              </Field>
            </div>
          </div>

          {/* Section 3: Account Security */}
          <div className="space-y-4 border-t border-border pt-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Security
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    {...register("password")}
                    className="pr-10"
                    hasError={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FieldError message={errors.password?.message} />
              </Field>

              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    {...register("confirm_password")}
                    className="pr-10"
                    hasError={Boolean(errors.confirm_password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FieldError message={errors.confirm_password?.message} />
              </Field>
            </div>
          </div>

          <Button
            disabled={isSubmitting}
            className="w-full py-3"
            type="submit"
          >
            <UserPlus size={16} />
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="rounded-md border border-border bg-surface px-3 py-2.5 text-center text-xs text-muted-foreground">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Log in instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
