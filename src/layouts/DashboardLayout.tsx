import { Outlet } from "react-router-dom"

import Sidebar from "@/components/ui/sidebar"
import Header from "@/components/ui/header"

function DashboardLayout() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout