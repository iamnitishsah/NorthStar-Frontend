import { Outlet } from "react-router-dom"

import Sidebar from "@/components/ui/sidebar"
import Header from "@/components/ui/header"

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
