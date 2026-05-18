import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { registerUser } from "@/modules/auth/auth-service"
import { getApiErrorMessage } from "@/services/api-error"
import type { RegisterRequest, UserRole } from "@/types/auth"

const roles: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN", "HR"]
const genders: RegisterRequest["gender"][] = ["MALE", "FEMALE", "OTHER"]

const schema = z.object({
  email: z.email(),
  employee_id: z.string().trim().min(1),
  name: z.string().trim().min(2).max(100),
  age: z.coerce.number().min(18).max(80),
  gender: z.enum(genders),
  phone: z.string().trim().min(1),
  department: z.string().trim().min(1),
  designation: z.string().trim().min(1),
  role: z.enum(roles),
  manager_id: z.string().trim().optional(),
  password: z.string().min(1),
})

type FormValues = z.input<typeof schema>

function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "EMPLOYEE",
      gender: "OTHER",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await registerUser({
        email: values.email.trim(),
        employee_id: values.employee_id.trim(),
        name: values.name.trim(),
        age: Number(values.age),
        gender: values.gender,
        phone: values.phone.trim(),
        department: values.department.trim(),
        designation: values.designation.trim(),
        role: values.role,
        manager_id: values.manager_id?.trim() || null,
        password: values.password,
      })

      toast.success("Registration successful")
      navigate("/login")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Registration failed"))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <form
        className="mx-auto max-w-3xl space-y-5 rounded-lg bg-white p-8 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="mt-1 text-slate-500">Create a NorthStar user account.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input {...register("email")} className="w-full rounded-lg border p-3" />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Employee ID</span>
            <input {...register("employee_id")} className="w-full rounded-lg border p-3" />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input {...register("name")} className="w-full rounded-lg border p-3" />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Age</span>
            <input {...register("age")} className="w-full rounded-lg border p-3" type="number" />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Gender</span>
            <select {...register("gender")} className="w-full rounded-lg border p-3">
              {genders.map((gender) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input {...register("phone")} className="w-full rounded-lg border p-3" />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Department</span>
            <input {...register("department")} className="w-full rounded-lg border p-3" />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Designation</span>
            <input {...register("designation")} className="w-full rounded-lg border p-3" />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select {...register("role")} className="w-full rounded-lg border p-3">
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Manager ID</span>
            <input {...register("manager_id")} className="w-full rounded-lg border p-3" />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input {...register("password")} className="w-full rounded-lg border p-3" type="password" />
        </label>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-950" to="/login">
            Back to login
          </Link>
          <button
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage
