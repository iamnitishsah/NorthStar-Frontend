import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import Button from "@/components/ui/button"
import { registerUser } from "@/modules/auth/auth-service"
import { useOrganizationHierarchy } from "@/modules/organization/hooks/use-organization-hierarchy"
import { getApiErrorMessage } from "@/services/api-error"
import type { RegisterRequest, UserRole } from "@/types/auth"
import type { HierarchyNode } from "@/types/goal"

const roles: UserRole[] = ["EMPLOYEE", "MANAGER", "HR", "ADMIN"]
const genders: RegisterRequest["gender"][] = ["MALE", "FEMALE", "OTHER"]

const schema = z.object({
  employee_id: z.string().trim().min(1, "Employee ID is required"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  age: z.coerce.number().min(18, "Age must be at least 18").max(80, "Age must be 80 or below"),
  gender: z.enum(genders),
  phone: z.string().trim().min(1, "Phone is required"),
  email: z.email("Enter a valid email address"),
  department: z.string().trim().min(1, "Department is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  role: z.enum(roles),
  manager_id: z.string().trim().optional(),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.input<typeof schema>

type ReportingManagerOption = {
  employee_id: string
  name: string
  department: string
  designation: string
  role: string
}

function collectReportingManagers(nodes: HierarchyNode[]): ReportingManagerOption[] {
  return nodes.flatMap((node) => {
    const canReceiveReports = node.role === "MANAGER" || node.role === "ADMIN"
    const current =
      canReceiveReports
        ? [{
            employee_id: node.employee_id,
            name: node.name,
            department: node.department,
            designation: node.designation,
            role: node.role,
          }]
        : []

    return [...current, ...collectReportingManagers(node.children || [])]
  })
}

function fieldClass(hasError?: boolean) {
  return `w-full rounded-lg border bg-white p-3 text-sm text-slate-950 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-300 focus:border-slate-400 focus:ring-slate-100"
  }`
}

function EmployeeOnboardingPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { data: hierarchy = [], isLoading: isLoadingManagers } = useOrganizationHierarchy()

  const reportingManagers = useMemo(
    () => collectReportingManagers(hierarchy).sort((a, b) => a.name.localeCompare(b.name)),
    [hierarchy]
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "EMPLOYEE",
      gender: "OTHER",
      manager_id: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const response = await registerUser({
        employee_id: values.employee_id.trim(),
        name: values.name.trim(),
        age: Number(values.age),
        gender: values.gender,
        phone: values.phone.trim(),
        email: values.email.trim(),
        department: values.department.trim(),
        designation: values.designation.trim(),
        role: values.role,
        manager_id: values.manager_id?.trim() || null,
        password: values.password,
      })

      toast.success(response.message || "Employee account provisioned")
      reset({
        role: "EMPLOYEE",
        gender: "OTHER",
        manager_id: "",
      })
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to provision employee. Check for duplicate employee ID or email."
        )
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Admin Operations
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">
              Employee Onboarding
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Provision workforce accounts internally. Public self-registration is disabled for this portal.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Roles supported: Employee, Manager, HR, Admin
          </div>
        </div>
      </div>

      <form
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Identity</h2>
              <p className="text-sm text-slate-500">
                Employee ID and email must be unique across the organization.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Employee ID</span>
                <input {...register("employee_id")} className={fieldClass(Boolean(errors.employee_id))} />
                {errors.employee_id && <p className="text-sm text-red-600">{errors.employee_id.message}</p>}
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input {...register("email")} className={fieldClass(Boolean(errors.email))} type="email" />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </label>

              <label className="space-y-1.5 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Full Name</span>
                <input {...register("name")} className={fieldClass(Boolean(errors.name))} />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Age</span>
                <input {...register("age")} className={fieldClass(Boolean(errors.age))} type="number" />
                {errors.age && <p className="text-sm text-red-600">{errors.age.message}</p>}
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Gender</span>
                <select {...register("gender")} className={fieldClass(Boolean(errors.gender))}>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Phone</span>
                <input {...register("phone")} className={fieldClass(Boolean(errors.phone))} />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
              </label>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Access</h2>
              <p className="text-sm text-slate-500">
                Assign the operational role and initial credential.
              </p>
            </div>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select {...register("role")} className={fieldClass(Boolean(errors.role))}>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <div className="relative">
                <input
                  {...register("password")}
                  className={`${fieldClass(Boolean(errors.password))} pr-11`}
                  type={showPassword ? "text" : "password"}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </label>
          </section>
        </div>

        <div className="my-6 border-t border-slate-200" />

        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Department & Reporting</h2>
            <p className="text-sm text-slate-500">
              Manager assignment is optional for manager/admin accounts and validated by the backend when supplied.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Department</span>
              <input {...register("department")} className={fieldClass(Boolean(errors.department))} />
              {errors.department && <p className="text-sm text-red-600">{errors.department.message}</p>}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Designation</span>
              <input {...register("designation")} className={fieldClass(Boolean(errors.designation))} />
              {errors.designation && <p className="text-sm text-red-600">{errors.designation.message}</p>}
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Manager</span>
              <select {...register("manager_id")} className={fieldClass(Boolean(errors.manager_id))}>
                <option value="">
                  {isLoadingManagers ? "Loading managers..." : "No manager assigned"}
                </option>
                {reportingManagers.map((manager) => (
                  <option key={manager.employee_id} value={manager.employee_id}>
                    {manager.name} ({manager.employee_id}) - {manager.role}, {manager.department}, {manager.designation}
                  </option>
                ))}
              </select>
              {errors.manager_id && <p className="text-sm text-red-600">{errors.manager_id.message}</p>}
            </label>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-end">
          <Button disabled={isSubmitting} icon={isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />} type="submit">
            {isSubmitting ? "Provisioning..." : "Provision Account"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EmployeeOnboardingPage
