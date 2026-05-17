function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manager Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Track and manage your goals
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          Total Goals
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          Completed
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          Pending
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard