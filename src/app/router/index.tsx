import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom"

import LoginPage from "@/pages/LoginPage"

import EmployeeDashboard from "@/pages/employee/EmployeeDashboard"
import MyGoalsPage from "@/pages/employee/MyGoalsPage"

import ManagerDashboard from "@/pages/manager/ManagerDashboard"
import ManagerProgressPage from "@/pages/manager/ManagerProgressPage"
import ReviewGoalsPage from "@/pages/manager/ReviewGoalsPage"

import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminLogsPage from "@/pages/admin/AdminLogsPage"

import DashboardLayout from "@/layouts/DashboardLayout"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { roleHomePath } from "@/app/navigation"
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
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
        element: <EmployeeDashboard />,
      },
      {
        path: "goals",
        element: <MyGoalsPage />,
      },
    ],
  },

  {
    path: "/manager",
    element: (
    <ProtectedRoute>
      <RoleProtectedRoute
        allowedRoles={["MANAGER"]}
      >
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
        element: <ManagerDashboard />,
      },
      {
        path: "review",
        element: <ReviewGoalsPage />,
      },
      {
        path: "progress",
        element: <ManagerProgressPage />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
    <ProtectedRoute>
      <RoleProtectedRoute
        allowedRoles={["ADMIN"]}
      >
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
        element: <AdminDashboard />,
      },
      {
        path: "logs",
        element: <AdminLogsPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
])
