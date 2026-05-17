/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react"
import type { ReactNode } from "react"
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom"

import LoadingSkeleton from "@/components/ui/loading-skeleton"
import DashboardLayout from "@/layouts/DashboardLayout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { roleHomePath } from "@/app/navigation"
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute"

const LoginPage = lazy(() => import("@/pages/LoginPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"))

const EmployeeDashboard = lazy(() => import("@/pages/employee/EmployeeDashboard"))
const MyGoalsPage = lazy(() => import("@/pages/employee/MyGoalsPage"))

const ManagerDashboard = lazy(() => import("@/pages/manager/ManagerDashboard"))
const ManagerProgressPage = lazy(() => import("@/pages/manager/ManagerProgressPage"))
const ReviewGoalsPage = lazy(() => import("@/pages/manager/ReviewGoalsPage"))

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"))
const AdminLogsPage = lazy(() => import("@/pages/admin/AdminLogsPage"))

function RouteFallback() {
  return (
    <div className="p-6">
      <LoadingSkeleton rows={3} />
    </div>
  )
}

function withSuspense(element: ReactNode) {
  return (
    <Suspense fallback={<RouteFallback />}>
      {element}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/unauthorized",
    element: withSuspense(<UnauthorizedPage />),
  },

  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={["EMPLOYEE"]}>
          <DashboardLayout />
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: (
          <Navigate
            to={roleHomePath.EMPLOYEE}
            replace
          />
        ),
      },
      {
        path: "dashboard",
        element: withSuspense(<EmployeeDashboard />),
      },
      {
        path: "goals",
        element: withSuspense(<MyGoalsPage />),
      },
    ],
  },

  {
    path: "/manager",
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={["MANAGER"]}>
          <DashboardLayout />
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: (
          <Navigate
            to={roleHomePath.MANAGER}
            replace
          />
        ),
      },
      {
        path: "dashboard",
        element: withSuspense(<ManagerDashboard />),
      },
      {
        path: "review",
        element: withSuspense(<ReviewGoalsPage />),
      },
      {
        path: "progress",
        element: withSuspense(<ManagerProgressPage />),
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={["ADMIN"]}>
          <DashboardLayout />
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: (
          <Navigate
            to={roleHomePath.ADMIN}
            replace
          />
        ),
      },
      {
        path: "dashboard",
        element: withSuspense(<AdminDashboard />),
      },
      {
        path: "logs",
        element: withSuspense(<AdminLogsPage />),
      },
    ],
  },

  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
  },
])
