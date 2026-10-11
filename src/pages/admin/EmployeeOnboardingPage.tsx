import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import Button from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
  Input,
  Select,
} from "@/components/ui/form"
import PageHeader from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Panel } from "@/components/ui/surface"
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
      <PageHeader
        badge="Admin Operations"
        title="Employee Onboarding"
        description="Provision workforce accounts internally and bind reporting manager hierarchies."
        actions={
          <StatusBadge tone="info">
            Roles: Employee · Manager · HR · Admin
          </StatusBadge>
        }
      />

      <Panel className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-semibold text-card-foreground">Identity & Personal Profile</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Employee ID and email must be unique across the organization.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Employee ID</FieldLabel>
                  <Input
                    placeholder="e.g. EMP042"
                    {...register("employee_id")}
                    hasError={Boolean(errors.employee_id)}
                  />
                  <FieldError message={errors.employee_id?.message} />
                </Field>

                <Field>
                  <FieldLabel>Work Email</FieldLabel>
                  <Input
                    placeholder="e.g. user@northstar.io"
                    type="email"
                    {...register("email")}
                    hasError={Boolean(errors.email)}
                  />
                  <FieldError message={errors.email?.message} />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    placeholder="e.g. Priya Sharma"
                    {...register("name")}
                    hasError={Boolean(errors.name)}
                  />
                  <FieldError message={errors.name?.message} />
                </Field>

                <Field>
                  <FieldLabel>Age</FieldLabel>
                  <Input
                    placeholder="18 - 80"
                    type="number"
                    {...register("age")}
                    hasError={Boolean(errors.age)}
                  />
                  <FieldError message={errors.age?.message} />
                </Field>

                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Select {...register("gender")} hasError={Boolean(errors.gender)}>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.gender?.message} />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input
                    placeholder="e.g. 9876543210"
                    {...register("phone")}
                    hasError={Boolean(errors.phone)}
                  />
                  <FieldError message={errors.phone?.message} />
                </Field>
              </div>
            </section>

            <section className="space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-semibold text-card-foreground">Access & Credentials</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Assign the operational role and initial login credential.
                </p>
              </div>

              <Field>
                <FieldLabel>Portal Role</FieldLabel>
                <Select {...register("role")} hasError={Boolean(errors.role)}>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.role?.message} />
              </Field>

              <Field>
                <FieldLabel>Initial Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...register("password")}
                    className="pr-10"
                    hasError={Boolean(errors.password)}
                    placeholder="Minimum 6 characters"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FieldError message={errors.password?.message} />
              </Field>
            </section>
          </div>

          <div className="my-6 border-t border-border" />

          <section className="space-y-5">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-semibold text-card-foreground">Department & Reporting</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manager assignment is optional for manager/admin accounts and validated by the backend when supplied.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                  placeholder="e.g. Senior Systems Engineer"
                  {...register("designation")}
                  hasError={Boolean(errors.designation)}
                />
                <FieldError message={errors.designation?.message} />
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Reporting Manager</FieldLabel>
                <Select {...register("manager_id")} hasError={Boolean(errors.manager_id)}>
                  <option value="">
                    {isLoadingManagers ? "Loading managers..." : "No manager assigned"}
                  </option>
                  {reportingManagers.map((manager) => (
                    <option key={manager.employee_id} value={manager.employee_id}>
                      {manager.name} ({manager.employee_id}) — {manager.role}, {manager.department}, {manager.designation}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.manager_id?.message} />
              </Field>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Button
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
              type="submit"
            >
              {isSubmitting ? "Provisioning..." : "Provision Account"}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  )
}

export default EmployeeOnboardingPage
