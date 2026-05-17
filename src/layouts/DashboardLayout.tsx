import { Outlet } from "react-router-dom"
import { useState } from "react"

import Sidebar from "@/components/ui/sidebar"
import Header from "@/components/ui/header"

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
